(function () {
  "use strict";

  const canvas = document.getElementById("badgeCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  const S = window.__badgeStrings || {};

  const photoInput = document.getElementById("badgePhoto");
  const nameInput = document.getElementById("badgeName");
  const commentInput = document.getElementById("badgeComment");
  const genBtn = document.getElementById("badgeGenerate");
  const dlBtn = document.getElementById("badgeDownload");
  const shareBtn = document.getElementById("badgeShare");

  const OVERLAY = "/images/avp.png";
  const PALETTE = {
    bg: "#050505",
    yellow: "#ffea00",
    magenta: "#ff006e",
    cyan: "#00d4ff",
    green: "#00ff9d",
    ink: "#ededed",
    muted: "#7a7a85",
    line: "rgba(255,234,0,0.4)"
  };

  let uploadedPhoto = null;
  let blob = null;

  // Load file as Image
  photoInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
      const img = new Image();
      img.onload = function () { uploadedPhoto = img; };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  function loadImage(url) {
    return new Promise(function (resolve, reject) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error("Failed to load: " + url)); };
      img.src = url;
    });
  }

  function drawBackground() {
    ctx.fillStyle = PALETTE.bg;
    ctx.fillRect(0, 0, W, H);

    // magenta glow on left
    const grad = ctx.createRadialGradient(W * 0.18, H * 0.5, 0, W * 0.18, H * 0.5, W * 0.55);
    grad.addColorStop(0, "rgba(255, 0, 110, 0.22)");
    grad.addColorStop(1, "rgba(255, 0, 110, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // soft cyan glow bottom right
    const grad2 = ctx.createRadialGradient(W * 0.85, H * 0.85, 0, W * 0.85, H * 0.85, W * 0.45);
    grad2.addColorStop(0, "rgba(0, 212, 255, 0.10)");
    grad2.addColorStop(1, "rgba(0, 212, 255, 0)");
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, W, H);

    // scanlines
    ctx.fillStyle = "rgba(255,255,255,0.022)";
    for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);

    // HUD corner brackets (yellow)
    ctx.strokeStyle = PALETTE.yellow;
    ctx.lineWidth = 3;
    drawBracket(40, 40, 50, "tl");
    drawBracket(W - 40, 40, 50, "tr");
    drawBracket(40, H - 40, 50, "bl");
    drawBracket(W - 40, H - 40, 50, "br");

    // node id (top-left)
    ctx.fillStyle = PALETTE.green;
    ctx.font = 'bold 18px "Share Tech Mono", "JetBrains Mono", monospace';
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(S.nodeId || "[ NODE_ID :: FUK_01 // 06.26.26 ]", 70, 60);

    // REC indicator (top-right)
    ctx.fillStyle = PALETTE.magenta;
    ctx.textAlign = "right";
    ctx.fillText(S.rec || "● REC", W - 70, 60);

    // I'M ATTENDING (yellow, large)
    ctx.textAlign = "left";
    ctx.fillStyle = PALETTE.yellow;
    ctx.font = '900 88px "Orbitron", "Share Tech Mono", monospace';
    ctx.fillText(S.title || "I'M ATTENDING", 70, 130);

    // Event line 1 (white, large)
    ctx.fillStyle = PALETTE.ink;
    ctx.font = '700 56px "Orbitron", sans-serif';
    ctx.fillText(S.eventLine1 || "XR VisionDevCamp", 70, 240);

    // Event line 2
    ctx.font = '500 40px "Orbitron", sans-serif';
    ctx.fillText(S.eventLine2 || "Fukuoka · 2026", 70, 295);

    // Magenta divider line
    ctx.strokeStyle = PALETTE.magenta;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(70, 350);
    ctx.lineTo(380, 350);
    ctx.stroke();

    // Date (magenta)
    ctx.fillStyle = PALETTE.magenta;
    ctx.font = 'bold 32px "Share Tech Mono", monospace';
    ctx.fillText("// " + (S.dateLine || "26 – 28 JUNE 2026"), 70, 380);

    // Venue
    ctx.fillStyle = PALETTE.muted;
    ctx.font = '24px "Share Tech Mono", monospace';
    ctx.fillText(S.venueLine || "@ Engineer Café · CIC Fukuoka", 70, 425);

    // URL bottom-left
    ctx.fillStyle = PALETTE.cyan;
    ctx.font = '20px "Share Tech Mono", monospace';
    ctx.fillText(S.urlLine || "// xr.visiondevcamp.org", 70, H - 70);

    // small kana flourish bottom-right
    ctx.fillStyle = "rgba(255, 0, 110, 0.4)";
    ctx.textAlign = "right";
    ctx.font = '14px "Share Tech Mono", monospace';
    ctx.fillText("XR ／ ヴィジョンデブキャンプ", W - 70, H - 70);
  }

  function drawBracket(x, y, size, corner) {
    ctx.beginPath();
    if (corner === "tl") { ctx.moveTo(x, y + size); ctx.lineTo(x, y); ctx.lineTo(x + size, y); }
    if (corner === "tr") { ctx.moveTo(x, y + size); ctx.lineTo(x, y); ctx.lineTo(x - size, y); }
    if (corner === "bl") { ctx.moveTo(x, y - size); ctx.lineTo(x, y); ctx.lineTo(x + size, y); }
    if (corner === "br") { ctx.moveTo(x, y - size); ctx.lineTo(x, y); ctx.lineTo(x - size, y); }
    ctx.stroke();
  }

  function drawCircularImage(image, cx, cy, diameter) {
    const radius = diameter / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    const ratio = image.width / image.height;
    let w, h;
    if (ratio > 1) { h = diameter; w = image.width * (h / image.height); }
    else { w = diameter; h = image.height * (w / image.width); }
    ctx.drawImage(image, cx - w / 2, cy - h / 2, w, h);
    ctx.restore();

    // magenta ring around photo
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2);
    ctx.strokeStyle = PALETTE.magenta;
    ctx.lineWidth = 3;
    ctx.stroke();

    // outer thin yellow ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 14, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 234, 0, 0.5)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // four reticle ticks at compass points
    ctx.strokeStyle = PALETTE.yellow;
    ctx.lineWidth = 2;
    [0, 90, 180, 270].forEach(function (deg) {
      const a = (deg * Math.PI) / 180;
      const inner = radius + 16;
      const outer = radius + 28;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
      ctx.lineTo(cx + Math.cos(a) * outer, cy + Math.sin(a) * outer);
      ctx.stroke();
    });
  }

  async function generate() {
    // Wait for fonts before drawing text to canvas
    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch (e) { /* fall through */ }
    }

    drawBackground();

    if (uploadedPhoto) {
      const cx = 950, cy = 280, dia = 380;
      drawCircularImage(uploadedPhoto, cx, cy, dia);

      // overlay (AVP goggles) on top of photo
      try {
        const overlay = await loadImage(OVERLAY);
        const ratio = overlay.width / overlay.height;
        let w = dia, h = dia / ratio;
        if (ratio < 1) { h = dia; w = dia * ratio; }
        // scale to ~80% and shift up
        w *= 0.85; h *= 0.85;
        ctx.drawImage(overlay, cx - w / 2, cy - h / 2 - 60, w, h);
      } catch (e) { /* overlay optional */ }

      // attendee name (yellow, bold)
      ctx.textAlign = "center";
      ctx.fillStyle = PALETTE.yellow;
      ctx.font = 'bold 36px "Orbitron", sans-serif';
      ctx.fillText(nameInput.value || "", cx, cy + dia / 2 + 50);

      // comment (cyan, smaller)
      ctx.fillStyle = PALETTE.cyan;
      ctx.font = '24px "Share Tech Mono", monospace';
      ctx.fillText(commentInput.value || "", cx, cy + dia / 2 + 88);
    } else {
      // placeholder ring on right
      ctx.strokeStyle = "rgba(255, 234, 0, 0.4)";
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(950, 280, 190, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.textAlign = "center";
      ctx.fillStyle = PALETTE.muted;
      ctx.font = '20px "Share Tech Mono", monospace';
      ctx.fillText("// AWAITING_INPUT", 950, 285);
    }

    canvas.toBlob(function (b) {
      blob = b;
      dlBtn.disabled = !blob;
      shareBtn.disabled = !blob;
    }, "image/png");
  }

  genBtn.addEventListener("click", generate);

  dlBtn.addEventListener("click", function () {
    if (!blob) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "xrvdc-fukuoka-2026.png";
    a.click();
  });

  const statusEl = document.getElementById("badgeStatus");
  let statusTimer = null;
  function showStatus(msg) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    if (statusTimer) clearTimeout(statusTimer);
    statusTimer = setTimeout(function () { statusEl.textContent = ""; }, 6000);
  }

  function downloadBlob() {
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "xrvdc-fukuoka-2026.png";
    a.click();
  }

  shareBtn.addEventListener("click", async function () {
    if (!blob) return;
    const file = new File([blob], "xrvdc-fukuoka-2026.png", { type: "image/png" });
    const shareUrl = S.shareUrl || window.location.href;
    const shareText = S.shareText || "";

    // Native Web Share with file (mobile + recent desktop Safari/Chrome)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ text: shareText, url: shareUrl, files: [file] });
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return; // user cancelled
        console.warn("Web Share failed, falling back:", err);
      }
    }

    // Fallback: download image + copy text+url to clipboard
    downloadBlob();
    const clipText = shareText + " " + shareUrl;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(clipText);
      }
    } catch (err) {
      console.warn("Clipboard write failed:", err);
    }
    showStatus(S.shareFallback || "Image downloaded · link copied to clipboard");
  });

  // Social share buttons — none of these endpoints accept attached images,
  // so we pre-stage the badge: download the PNG, copy the caption, then open
  // the platform's compose URL. The user pastes/attaches in the new tab.
  document.querySelectorAll("[data-social]").forEach(function (btn) {
    btn.addEventListener("click", async function () {
      const where = btn.dataset.social;
      const shareUrl = S.shareUrl || window.location.href;
      const shareText = S.shareText || "";
      const text = encodeURIComponent(shareText);
      const url = encodeURIComponent(shareUrl);

      let target = "";
      if (where === "x") target = "https://twitter.com/intent/tweet?text=" + text + "&url=" + url;
      else if (where === "facebook") target = "https://www.facebook.com/sharer/sharer.php?u=" + url;
      else if (where === "linkedin") target = "https://www.linkedin.com/sharing/share-offsite/?url=" + url;
      if (!target) return;

      // Open the compose tab synchronously (popup blockers reject delayed window.open).
      const popup = window.open(target, "_blank", "noopener");

      // Pre-stage the badge so the user can attach it in the new tab.
      if (blob) downloadBlob();
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareText + " " + shareUrl);
        }
      } catch (err) { console.warn("Clipboard write failed:", err); }

      showStatus(S.socialShareHint || "Badge downloaded · caption copied — attach the image in the new tab.");
      if (!popup) console.warn("Popup blocked for", target);
    });
  });

  // Initial render so canvas isn't blank
  generate();
})();
