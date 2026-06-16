// Smart hairline indicator for desktop nav (no JSX edits needed)
(function(){
  const nav = document.querySelector('header nav[aria-label="Primary"]');
  if(!nav) return;

  const links = Array.from(nav.querySelectorAll('a'));

  function setFromEl(el){
    if(!el) return;
    const r = el.getBoundingClientRect();
    const nr = nav.getBoundingClientRect();
    const left = Math.round(r.left - nr.left);
    const width = Math.round(r.width);
    nav.style.setProperty('--ind-left', left + 'px');
    nav.style.setProperty('--ind-width', width + 'px');
    nav.style.setProperty('--ind-opacity', 1);
  }

  // initial position (prefer active page)
  function setToActive(){
    setFromEl(links.find(a => a.getAttribute('aria-current') === 'page') || links[0]);
  }
  requestAnimationFrame(setToActive);

  // hover/focus moves the bar; leave/blur returns to active
  links.forEach(a=>{
    a.addEventListener('mouseenter', ()=> setFromEl(a));
    a.addEventListener('focus', ()=> setFromEl(a));
    a.addEventListener('mouseleave', setToActive);
    a.addEventListener('blur', setToActive);
  });

  // observe changes to aria-current (React Router updates it)
  const mo = new MutationObserver(setToActive);
  mo.observe(nav, { subtree:true, attributes:true, attributeFilter:['aria-current'] });

  // reposition on resize
  window.addEventListener('resize', setToActive, { passive:true });
})();
