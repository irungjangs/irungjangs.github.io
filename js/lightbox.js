const lightbox = document.querySelector("#lightbox");
const lightboxImg = document.querySelector("#lightbox-img");
const closeButton = document.querySelector(".lightbox-close");
const detailImages = document.querySelectorAll(".detail-img");

// Zoom Toolbar elements
const zoomOutBtn = document.querySelector("#zoom-out-btn");
const zoomInBtn = document.querySelector("#zoom-in-btn");
const zoomLabel = document.querySelector("#zoom-label");

let zoomLevel = 1;
let panX = 0;
let panY = 0;
let isDragging = false;
let startX = 0;
let startY = 0;

function updateZoomUI() {
  if (zoomLabel) {
    zoomLabel.textContent = `${Math.round(zoomLevel * 100)}%`;
  }
  if (zoomOutBtn) {
    if (zoomLevel <= 1) zoomOutBtn.classList.add("is-disabled");
    else zoomOutBtn.classList.remove("is-disabled");
  }
  if (zoomInBtn) {
    if (zoomLevel >= 3) zoomInBtn.classList.add("is-disabled");
    else zoomInBtn.classList.remove("is-disabled");
  }
}

function applyTransform(animate = false) {
  // Clamp panning loosely based on viewport and zoom
  const limitX = (window.innerWidth / 2) * zoomLevel;
  const limitY = (window.innerHeight / 2) * zoomLevel;
  
  if (zoomLevel === 1) {
    panX = 0;
    panY = 0;
  } else {
    if (panX > limitX) panX = limitX;
    if (panX < -limitX) panX = -limitX;
    if (panY > limitY) panY = limitY;
    if (panY < -limitY) panY = -limitY;
  }

  updateZoomUI();

  if (window.gsap) {
    if (animate) {
      gsap.to(lightboxImg, { scale: zoomLevel, x: panX, y: panY, duration: 0.4, ease: "back.out(1.2)", overwrite: "auto" });
    } else {
      gsap.set(lightboxImg, { scale: zoomLevel, x: panX, y: panY });
    }
  } else {
    lightboxImg.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
  }
}

function setZoom(newZoom, cx = 0, cy = 0, animate = true) {
  const oldZoom = zoomLevel;
  if (newZoom < 1) newZoom = 1;
  if (newZoom > 3) newZoom = 3;
  
  if (newZoom === oldZoom) return;

  // Zoom towards (cx, cy)
  const dx = cx - panX;
  const dy = cy - panY;
  
  panX = cx - dx * (newZoom / oldZoom);
  panY = cy - dy * (newZoom / oldZoom);
  
  zoomLevel = newZoom;
  applyTransform(animate);
}

function openLightbox(image) {
  if (!lightbox || !lightboxImg) return;

  lightboxImg.src = image.currentSrc || image.src;
  lightboxImg.alt = image.alt;
  lightbox.setAttribute("aria-hidden", "false");
  lightbox.classList.add("is-open");
  document.body.classList.add("is-locked");

  zoomLevel = 1;
  panX = 0;
  panY = 0;
  updateZoomUI();

  if (window.gsap) {
    gsap.killTweensOf([lightbox, lightboxImg]);
    gsap.set(lightboxImg, { x: 0, y: 0 });
    gsap.to(lightbox, { opacity: 1, duration: 0.22, ease: "power2.out" });
    gsap.fromTo(lightboxImg, { scale: 0.72 }, { scale: 1, duration: 0.46, ease: "back.out(1.2)" });
  } else {
    lightbox.style.opacity = "1";
    applyTransform(false);
  }
}

function closeLightbox() {
  if (!lightbox || !lightboxImg) return;

  const finish = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.removeAttribute("src");
    document.body.classList.remove("is-locked");
  };

  if (window.gsap) {
    gsap.to(lightbox, { opacity: 0, duration: 0.18, ease: "power2.in", onComplete: finish });
  } else {
    lightbox.style.opacity = "0";
    finish();
  }
}

// ─── Event Listeners ────────────────────────────────────────────

detailImages.forEach((image) => {
  image.addEventListener("click", () => openLightbox(image));
});

// Click outside image to close (ensure toolbar clicks don't close it)
lightbox?.addEventListener("pointerdown", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

closeButton?.addEventListener("click", closeLightbox);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox?.classList.contains("is-open")) {
    closeLightbox();
  }
});

// ─── Zoom and Pan Interaction ───────────────────────────────────

if (lightboxImg) {
  // Double click to zoom
  lightboxImg.addEventListener("dblclick", (e) => {
    let targetZoom = zoomLevel >= 3 ? 1 : Math.min(3, zoomLevel + 1);
    
    const cx = e.clientX - window.innerWidth / 2;
    const cy = e.clientY - window.innerHeight / 2;
    
    setZoom(targetZoom, cx, cy, true);
  });

  // Drag to pan
  lightboxImg.addEventListener("pointerdown", (e) => {
    if (zoomLevel <= 1) return; // Only pan when zoomed in
    e.preventDefault(); // prevent default image drag
    
    isDragging = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
    lightboxImg.setPointerCapture(e.pointerId);
  });

  lightboxImg.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    applyTransform(false);
  });

  const stopDrag = (e) => {
    if (isDragging) {
      isDragging = false;
      lightboxImg.releasePointerCapture(e.pointerId);
      applyTransform(true); // animate snapping back to bounds if needed
    }
  };

  lightboxImg.addEventListener("pointerup", stopDrag);
  lightboxImg.addEventListener("pointercancel", stopDrag);
}

// ─── Toolbar Controls ───────────────────────────────────────────

zoomOutBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  setZoom(zoomLevel - 1, 0, 0, true);
});

zoomInBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  setZoom(zoomLevel + 1, 0, 0, true);
});
