const lightbox = document.querySelector("#lightbox");
const lightboxImg = document.querySelector("#lightbox-img");
const closeButton = document.querySelector(".lightbox-close");
const detailImages = document.querySelectorAll(".detail-img");

function openLightbox(image) {
  if (!lightbox || !lightboxImg) return;

  lightboxImg.src = image.currentSrc || image.src;
  lightboxImg.alt = image.alt;
  lightbox.setAttribute("aria-hidden", "false");
  lightbox.classList.add("is-open");
  document.body.classList.add("is-locked");

  if (window.gsap) {
    gsap.killTweensOf([lightbox, lightboxImg]);
    gsap.to(lightbox, { opacity: 1, duration: 0.22, ease: "power2.out" });
    gsap.fromTo(lightboxImg, { scale: 0.72 }, { scale: 1, duration: 0.46, ease: "back.out(1.2)" });
  } else {
    lightbox.style.opacity = "1";
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

detailImages.forEach((image) => {
  image.addEventListener("click", () => openLightbox(image));
});

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

closeButton?.addEventListener("click", closeLightbox);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox?.classList.contains("is-open")) {
    closeLightbox();
  }
});
