// Content panel built with three-mesh-ui. Materializes in front of user when a face is selected.

import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import { FONT, PAL } from "./menu-data.js";

const PANEL_W = 1.0;
const PANEL_H = 0.62;
const PADDING = 0.045;

function hex(c) {
  return new THREE.Color(c);
}

export function buildContentPanel() {
  const container = new ThreeMeshUI.Block({
    width: PANEL_W,
    height: PANEL_H,
    padding: PADDING,
    fontFamily: FONT.json,
    fontTexture: FONT.png,
    backgroundColor: hex(PAL.bgPanel),
    backgroundOpacity: 0.92,
    borderRadius: 0.012,
    justifyContent: "start",
    alignItems: "stretch",
  });
  container.name = "content-panel";

  // Header row: index/title + close button (laid out as a single text line for simplicity)
  const header = new ThreeMeshUI.Block({
    width: PANEL_W - PADDING * 2,
    height: 0.10,
    backgroundOpacity: 0,
    contentDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 0.005,
  });
  container.add(header);

  const headerLabel = new ThreeMeshUI.Block({
    width: 0.7,
    height: 0.08,
    backgroundOpacity: 0,
    justifyContent: "center",
    alignItems: "start",
  });
  const headerText = new ThreeMeshUI.Text({ content: "// --", fontColor: hex(PAL.magenta), fontSize: 0.038 });
  headerLabel.add(headerText);
  header.add(headerLabel);

  // Close button — its own Block so we can hit-test it
  const closeBtn = new ThreeMeshUI.Block({
    width: 0.10,
    height: 0.08,
    backgroundColor: hex(PAL.magenta),
    backgroundOpacity: 0.18,
    borderRadius: 0.005,
    justifyContent: "center",
    alignItems: "center",
  });
  closeBtn.add(new ThreeMeshUI.Text({ content: "[ X ]", fontColor: hex(PAL.magenta), fontSize: 0.028 }));
  closeBtn.name = "panel-close";
  closeBtn.userData = { isCloseButton: true };
  header.add(closeBtn);

  // Divider strip (yellow underline)
  const divider = new ThreeMeshUI.Block({
    width: PANEL_W - PADDING * 2,
    height: 0.003,
    backgroundColor: hex(PAL.yellow),
    backgroundOpacity: 0.7,
    margin: 0.005,
  });
  container.add(divider);

  // Body — long descriptive paragraph
  const body = new ThreeMeshUI.Block({
    width: PANEL_W - PADDING * 2,
    height: PANEL_H * 0.55,
    backgroundOpacity: 0,
    justifyContent: "start",
    alignItems: "start",
    margin: 0.005,
  });
  const bodyText = new ThreeMeshUI.Text({ content: "...", fontColor: hex(PAL.amber), fontSize: 0.026 });
  const routeText = new ThreeMeshUI.Text({ content: "", fontColor: hex(PAL.warmEdge), fontSize: 0.020 });
  body.add(bodyText);
  body.add(routeText);
  container.add(body);

  // Footer hint — link instruction
  const footer = new ThreeMeshUI.Block({
    width: PANEL_W - PADDING * 2,
    height: 0.06,
    backgroundOpacity: 0,
    contentDirection: "row",
    justifyContent: "end",
    alignItems: "center",
  });
  const footerText = new ThreeMeshUI.Text({
    content: "// SELECT [ X ] TO RETURN",
    fontColor: hex(PAL.warmEdge),
    fontSize: 0.020,
  });
  footer.add(footerText);
  container.add(footer);

  // Magenta corner brackets (4 small Blocks at corners — purely decorative)
  for (const corner of ["tl", "tr", "bl", "br"]) {
    const c = new ThreeMeshUI.Block({
      width: 0.04, height: 0.005,
      backgroundColor: hex(PAL.magenta), backgroundOpacity: 1,
    });
    container.add(c);
    const cy = corner.startsWith("t") ? PANEL_H / 2 - 0.002 : -PANEL_H / 2 + 0.002;
    const cx = corner.endsWith("l") ? -PANEL_W / 2 + 0.022 : PANEL_W / 2 - 0.022;
    c.position.set(cx, cy, 0.001);
  }

  // Initial pose — hidden / scaled down for materialize-in
  container.scale.set(0.001, 0.001, 0.001);
  container.visible = false;

  return {
    container,
    closeBtn,
    setContent(item) {
      headerText.set({ content: "// " + item.index + " :: " + item.title });
      // Trailing newline pushes the route onto its own line in the inline run.
      bodyText.set({ content: item.summary + "\n\n" });
      routeText.set({ content: "// ROUTE :: " + (item.href || "/") });
      ThreeMeshUI.update();
    },
  };
}

// Materialize-in animation: scale 0 → 1 over ~600ms, exponential-out, with a quick magenta flash.
export function materializeIn(container, onDone) {
  const startScale = 0.001;
  const endScale = 1.0;
  const dur = 600; // ms
  container.visible = true;
  const t0 = performance.now();
  function tick() {
    const t = Math.min((performance.now() - t0) / dur, 1);
    // exponential-out
    const eased = 1 - Math.pow(2, -8 * t);
    const s = startScale + (endScale - startScale) * eased;
    container.scale.set(s, s, s);
    if (t < 1) requestAnimationFrame(tick);
    else if (onDone) onDone();
  }
  requestAnimationFrame(tick);
}

export function materializeOut(container, onDone) {
  const dur = 380;
  const t0 = performance.now();
  function tick() {
    const t = Math.min((performance.now() - t0) / dur, 1);
    const eased = Math.pow(2, -8 * t);
    container.scale.set(eased, eased, eased);
    if (t < 1) requestAnimationFrame(tick);
    else {
      container.visible = false;
      if (onDone) onDone();
    }
  }
  requestAnimationFrame(tick);
}
