(function () {
  "use strict";

  const lb = document.getElementById("lightbox");
  if (!lb) return;

  const img = lb.querySelector("[data-lightbox-img]");
  const idEl = lb.querySelector("[data-lightbox-id]");
  const nameEl = lb.querySelector("[data-lightbox-name]");
  const countEl = lb.querySelector("[data-lightbox-count]");
  const closeBtn = lb.querySelector(".lightbox__close");
  const prevBtn = lb.querySelector(".lightbox__nav--prev");
  const nextBtn = lb.querySelector(".lightbox__nav--next");

  // Group items by data-set so prev/next walks within a section.
  const sets = {};
  document.querySelectorAll(".gallery-item").forEach(function (el) {
    const k = el.dataset.set || "default";
    (sets[k] = sets[k] || []).push(el);
  });

  let activeSet = null;
  let activeIndex = 0;

  function open(el) {
    activeSet = el.dataset.set || "default";
    activeIndex = sets[activeSet].indexOf(el);
    render();
    lb.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function close() {
    lb.hidden = true;
    document.body.style.overflow = "";
    img.src = "";
  }

  function step(d) {
    const arr = sets[activeSet];
    if (!arr) return;
    activeIndex = (activeIndex + d + arr.length) % arr.length;
    render();
  }

  function render() {
    const el = sets[activeSet][activeIndex];
    if (!el) return;
    img.src = el.dataset.src;
    img.alt = el.dataset.name || "";
    idEl.textContent = (activeSet === "event" ? "CAM_03" : "CAM_07") + " // " + (el.dataset.name || "");
    nameEl.textContent = el.dataset.name || "";
    countEl.textContent =
      (activeIndex + 1).toString().padStart(3, "0") + " / " + sets[activeSet].length.toString().padStart(3, "0");
  }

  document.querySelectorAll(".gallery-item").forEach(function (el) {
    el.addEventListener("click", function () { open(el); });
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", function () { step(-1); });
  nextBtn.addEventListener("click", function () { step(1); });

  lb.addEventListener("click", function (e) {
    if (e.target === lb) close();
  });

  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
  });
})();
