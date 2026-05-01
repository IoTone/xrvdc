// Per-hand interaction state machine: hover/select/release with debounce.

import * as THREE from "three";
import { PAL } from "./menu-data.js";

const HOVER_DEBOUNCE_MS = 150;

export class HandInputs {
  constructor(scene, raycastTargets) {
    this.scene = scene;
    this.targets = raycastTargets; // Array<Mesh> — face-target planes + close button mesh
    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Line.threshold = 0.0005;
    this.tmp = new THREE.Vector3();
    this.tmpDir = new THREE.Vector3();

    this.hands = []; // { source, beam, reticle, currentHover, lastHoverChange, locked, locked Target }
    this.onHoverChange = null;
    this.onSelect = null;

    // 2D / mouse fallback
    this._mouseSource = null;
  }

  registerXRController(controller, source) {
    const beam = makeBeam();
    controller.add(beam);
    const reticle = makeReticle();
    this.scene.add(reticle);
    reticle.visible = false;

    const hand = {
      controller, source, beam, reticle,
      currentHover: null, lastHoverChange: 0,
      locked: false, lockedTarget: null,
    };
    this.hands.push(hand);

    controller.addEventListener("selectstart", () => this._onSelectStart(hand));
    controller.addEventListener("selectend",   () => this._onSelectEnd(hand));
  }

  // For 2D fallback: pretend the mouse is one "hand"
  registerMouse(camera, canvas) {
    this._fallbackCamera = camera;
    this._fallbackCanvas = canvas;
    const beam = null;
    const reticle = makeReticle();
    this.scene.add(reticle);
    reticle.visible = false;

    const hand = {
      controller: null, source: "mouse", beam, reticle,
      currentHover: null, lastHoverChange: 0,
      locked: false, lockedTarget: null,
    };
    this._mouseSource = hand;
    this.hands.push(hand);

    canvas.addEventListener("pointermove", (e) => this._onMouseMove(e, hand));
    canvas.addEventListener("pointerdown", () => this._onSelectStart(hand));
    canvas.addEventListener("pointerup",   () => this._onSelectEnd(hand));
  }

  _onMouseMove(e, hand) {
    const rect = this._fallbackCanvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    hand._mouseNDC = new THREE.Vector2(x, y);
  }

  _setRayFromController(hand) {
    if (hand.source === "mouse" && hand._mouseNDC) {
      this.raycaster.setFromCamera(hand._mouseNDC, this._fallbackCamera);
      return true;
    }
    if (hand.controller) {
      this.tmp.setFromMatrixPosition(hand.controller.matrixWorld);
      this.tmpDir.set(0, 0, -1).applyQuaternion(hand.controller.getWorldQuaternion(new THREE.Quaternion()));
      this.raycaster.set(this.tmp, this.tmpDir);
      return true;
    }
    return false;
  }

  _onSelectStart(hand) {
    if (!hand.currentHover) return;
    hand.locked = true;
    hand.lockedTarget = hand.currentHover; // press-lock per doc rule
  }

  _onSelectEnd(hand) {
    if (hand.locked && hand.lockedTarget && hand.lockedTarget === hand.currentHover) {
      if (this.onSelect) this.onSelect(hand.lockedTarget);
    }
    hand.locked = false;
    hand.lockedTarget = null;
  }

  update() {
    const now = performance.now();
    for (const hand of this.hands) {
      if (!this._setRayFromController(hand)) continue;
      const intersects = this.raycaster.intersectObjects(this.targets, false);
      const hit = intersects.length > 0 ? intersects[0] : null;
      const target = hit ? hit.object : null;

      if (target !== hand.currentHover) {
        // debounce loss-of-hover only
        if (hand.currentHover && now - hand.lastHoverChange < HOVER_DEBOUNCE_MS && !target) {
          // ignore — keep current hover
        } else {
          hand.currentHover = target;
          hand.lastHoverChange = now;
          if (this.onHoverChange) this.onHoverChange(target, hand);
        }
      }

      // Update reticle + beam visuals
      if (hit) {
        hand.reticle.position.copy(hit.point);
        hand.reticle.visible = true;
        if (hand.beam) {
          hand.beam.scale.z = hit.distance;
          hand.beam.visible = true;
        }
      } else {
        hand.reticle.visible = false;
        if (hand.beam) hand.beam.visible = false;
      }
    }
  }
}

function makeBeam() {
  // Thin beam from origin pointing -Z, default length 1m.
  const geom = new THREE.CylinderGeometry(0.0005, 0.001, 1, 6, 1, true);
  geom.translate(0, -0.5, 0);
  geom.rotateX(Math.PI / 2);
  const mat = new THREE.MeshBasicMaterial({ color: PAL.amber, transparent: true, opacity: 0.7 });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.visible = false;
  return mesh;
}

function makeReticle() {
  const g = new THREE.SphereGeometry(0.008, 12, 12);
  const m = new THREE.MeshBasicMaterial({ color: PAL.amber, transparent: true, opacity: 0.85 });
  return new THREE.Mesh(g, m);
}
