// Keeps keyboard focus inside the mobile drawer while it's open
(function(){
  const drawerSel = '#mobile-menu';
  const overlaySel = 'button[aria-label="Close menu"].fixed';

  function trap(container){
    const focusables = container.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if(!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length - 1];

    function onKey(e){
      if(e.key !== 'Tab') return;
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
    container.addEventListener('keydown', onKey);
    container.__trapOff = () => container.removeEventListener('keydown', onKey);
  }

  const mo = new MutationObserver(()=>{
    const drawer = document.querySelector(drawerSel);
    const overlay = document.querySelector(overlaySel);
    if(drawer && overlay){
      setTimeout(()=> drawer.querySelector('button, a, input')?.focus(), 10);
      trap(drawer);
      overlay.addEventListener('click', ()=> drawer.__trapOff && drawer.__trapOff(), { once:true });
    }
  });
  mo.observe(document.body, { childList:true, subtree:true });
})();
