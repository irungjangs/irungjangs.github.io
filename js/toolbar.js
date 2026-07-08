/**
 * toolbar.js
 * Manages the docked floating toolbar visibility.
 * When the bottom project-grid comes into view,
 * the toolbar hides with a spring animation (GSAP back ease).
 * When it leaves view, the toolbar reappears with a spring bounce.
 */

(function () {
  const toolbar = document.querySelector('.docked-toolbar');
  const grid = document.querySelector('nav.project-grid');

  if (!toolbar || !grid || typeof gsap === 'undefined') return;

  // Initial state — hidden below
  gsap.set(toolbar, { opacity: 0, y: 30, scale: 0.92 });

  let isVisible = false;
  let entryTimer = null;

  // Delay first appearance slightly so it doesn't pop in immediately on load
  entryTimer = setTimeout(() => {
    showToolbar();
  }, 600);

  function showToolbar() {
    if (isVisible) return;
    isVisible = true;
    gsap.killTweensOf(toolbar);
    gsap.to(toolbar, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.55,
      ease: 'back.out(1.6)',
      overwrite: true,
    });
  }

  function hideToolbar() {
    if (!isVisible) return;
    isVisible = false;
    gsap.killTweensOf(toolbar);
    gsap.to(toolbar, {
      opacity: 0,
      y: 24,
      scale: 0.92,
      duration: 0.38,
      ease: 'back.in(1.4)',
      overwrite: true,
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // project-grid is visible → hide toolbar
          clearTimeout(entryTimer);
          hideToolbar();
        } else {
          // project-grid left view → show toolbar
          showToolbar();
        }
      });
    },
    {
      // Trigger when at least 8% of the grid is on screen
      threshold: 0.08,
    }
  );

  observer.observe(grid);
})();
