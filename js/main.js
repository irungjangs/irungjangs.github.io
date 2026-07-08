const tiles = document.querySelectorAll(".project-tile[href]");

tiles.forEach((tile) => {
  const bgImage = tile.querySelector(".bg-image");
  const hoverUI = tile.querySelector(".hover-ui");

  if (!bgImage || !hoverUI || !window.gsap) return;

  tile.addEventListener("mouseenter", () => {
    gsap.to(bgImage, {
      scale: 1.4,
      opacity: 0,
      duration: 0.6,
      ease: "back.out(1.5)",
      overwrite: true
    });
    gsap.to(hoverUI, {
      opacity: 1,
      duration: 0.36,
      ease: "power2.out",
      overwrite: true
    });
  });

  tile.addEventListener("mouseleave", () => {
    gsap.to(bgImage, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.5)",
      overwrite: true
    });
    gsap.to(hoverUI, {
      opacity: 0,
      duration: 0.28,
      ease: "power2.out",
      overwrite: true
    });
  });
});
