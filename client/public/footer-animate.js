// Footer reveal + nice stagger — no changes to your Footer.jsx required.
(function(){
  const footer = document.querySelector('footer[aria-labelledby="site-footer-title"]');
  if (!footer) return;

  // Stagger columns (L/M/R)
  const cols = footer.querySelectorAll('.max-w-6xl > *');
  cols.forEach((col, idx) => col.style.setProperty('--col-delay', (0.10 * idx) + 's'));

  // Stagger lists (company links, social links, payment logos)
  const staggerGroups = [
    ...footer.querySelectorAll('nav[aria-label="Company"] li'),
    ...footer.querySelectorAll('.mt-4[aria-label="Social media"] li'),
    ...footer.querySelectorAll('.mt-6 ul li')
  ];
  staggerGroups.forEach((el, i) => el.style.setProperty('--i', (0.03 * i) + 's'));

  // Reveal on intersection (once)
  if (!('IntersectionObserver' in window)) {
    footer.setAttribute('data-visible', '1');
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        footer.setAttribute('data-visible', '1');
        io.disconnect();
        break;
      }
    }
  }, { threshold: 0.12 });
  io.observe(footer);
})();
