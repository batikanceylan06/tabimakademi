/* STUDIO MOTION: interactive academy journey, animated illustrations and pointer light. */
(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopPointer = window.matchMedia('(hover:hover) and (pointer:fine)');
  const lab = document.getElementById('akademi-360');
  const theatre = lab.querySelector('.lab-theatre');
  const tabs = [...lab.querySelectorAll('.lab-tab')];
  const panels = [...lab.querySelectorAll('.lab-panel')];
  const phoneTitle = document.getElementById('lab-phone-title');
  const phoneValue = document.getElementById('lab-phone-value');
  const phoneCaption = document.getElementById('lab-phone-caption');
  const phoneRing = lab.querySelector('.lab-phone-ring');
  const phoneBars = [...lab.querySelectorAll('.lab-phone-bars i')];
  const dots = [...lab.querySelectorAll('.lab-stage-pagination i')];
  const counter = document.getElementById('lab-count');
  const autoButton = document.getElementById('lab-autoplay');
  const autoLabel = document.getElementById('lab-play-label');
  const autoIcon = lab.querySelector('.lab-pause-icon');
  const states = [
    {title:'Öğrenmeye başla',caption:'Bir konu seç, yolculuğun başlasın.', ring:'33%'},
    {title:'Kendine zaman ayır',caption:'Her derste bir adım daha ileri.',ring:'65%'},
    {title:'Gelişimini gör',caption:'Öğrendiklerin yanında kalsın.',ring:'92%'}
  ];
  let selected = 0;
  let automatic = !reduced.matches;
  let onScreen = false;
  let interacting = false;
  let timer = null;
  function stop(){ if(timer !== null) {clearInterval(timer);timer=null;} }
  function syncPlayButton(){
    autoButton.setAttribute('aria-pressed',String(automatic));
    autoButton.setAttribute('aria-label',automatic?'Otomatik geçişleri durdur':'Otomatik geçişleri başlat');
    autoLabel.textContent=automatic?'Otomatik geçiş açık':'Otomatik geçiş kapalı';
    autoIcon.textContent=automatic?'Ⅱ':'▶';
  }
  function activate(index,focus=false){
    selected = (index+tabs.length)%tabs.length;
    tabs.forEach((tab,i)=>{
      let active = i===selected;
      tab.classList.toggle('is-active',active);
      tab.setAttribute('aria-selected',String(active));
      tab.tabIndex = active?0:-1;
      if(active && focus) tab.focus();
    });
    panels.forEach((panel,i)=>{
      const active=i===selected;
      panel.classList.toggle('is-active',active);
      panel.setAttribute('aria-hidden',String(!active));
      // Decorational simulated UI has no controls.
    });
    phoneTitle.textContent=states[selected].title;
    phoneValue.textContent=String(selected+1).padStart(2,'0');
    phoneCaption.textContent=states[selected].caption;
    phoneRing.style.setProperty('--ring-value',states[selected].ring);
    phoneBars.forEach((bar,i)=>bar.classList.toggle('is-current',i===selected));
    dots.forEach((dot,i)=>dot.classList.toggle('is-active',i===selected));
    counter.textContent=String(selected+1).padStart(2,'0');
  }
  function start(){
    stop();
    if(onScreen && automatic && !interacting && !reduced.matches && !document.hidden) {
      timer = setInterval(()=>activate(selected+1),5900);
    }
  }
  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>{activate(i);start()});
    tab.addEventListener('keydown',event=>{
      let n=i;
      if(event.key==='ArrowDown'||event.key==='ArrowRight') n=i+1;
      else if(event.key==='ArrowUp'||event.key==='ArrowLeft') n=i-1;
      else if(event.key==='Home') n=0;
      else if(event.key==='End') n=tabs.length-1;
      else return;
      event.preventDefault();activate(n,true);start();
    });
  });
  autoButton.addEventListener('click',()=>{
    automatic=!automatic;syncPlayButton();start();
  });
  const tabBar = lab.querySelector('.lab-tabs');
  tabBar.addEventListener('pointerenter',()=>{interacting=true;stop();});
  tabBar.addEventListener('pointerleave',()=>{interacting=false;start();});
  lab.addEventListener('focusin',()=>{interacting=true;stop();});
  lab.addEventListener('focusout',()=>{
    // When focus moves between controls, do not restart auto rotation.
    requestAnimationFrame(()=>{if(!lab.contains(document.activeElement)){interacting=false;start();}});
  });
  document.addEventListener('visibilitychange',()=>{start()});
  if('IntersectionObserver' in window) {
    const observer=new IntersectionObserver(entries=>{
      onScreen=entries[0].isIntersecting;
      theatre.classList.toggle('is-in-view',onScreen);
      start();
    },{threshold:.15});observer.observe(lab);
  } else {onScreen=true;start();}
  if(reduced.addEventListener){reduced.addEventListener('change',e=>{if(e.matches)automatic=false;syncPlayButton();start();});}
  syncPlayButton();activate(0);
  // 3D micro parallax on the tour; the existing cinematic laptops remain independent.
  if(desktopPointer.matches && !reduced.matches){
    let raf=0;
    theatre.addEventListener('pointermove',event=>{
      if(raf) return;
      raf=requestAnimationFrame(()=>{
        const b=theatre.getBoundingClientRect();
        const x=Math.max(-1,Math.min(1,((event.clientX-b.left)/b.width-.5)*2));
        const y=Math.max(-1,Math.min(1,((event.clientY-b.top)/b.height-.5)*2));
        theatre.style.setProperty('--lab-parallax-x',`${(x*10).toFixed(1)}px`);
        theatre.style.setProperty('--lab-parallax-y',`${(y*7).toFixed(1)}px`);
        raf=0;
      });
    },{passive:true});
    theatre.addEventListener('pointerleave',()=>{
      theatre.style.removeProperty('--lab-parallax-x');theatre.style.removeProperty('--lab-parallax-y');
    });
    document.querySelectorAll('.course-card,.why-card').forEach(card=>{
      let frame=0;
      card.addEventListener('pointermove',event=>{
        if(frame) return;
        frame=requestAnimationFrame(()=>{
          const r=card.getBoundingClientRect();
          const x=(event.clientX-r.left)/r.width;
          const y=(event.clientY-r.top)/r.height;
          if(card.classList.contains('course-card')) {
            card.style.setProperty('--card-rx',`${((.5-y)*6).toFixed(2)}deg`);
            card.style.setProperty('--card-ry',`${((x-.5)*7).toFixed(2)}deg`);
            card.style.setProperty('--card-glow-x',`${(x*100).toFixed(0)}%`);
            card.style.setProperty('--card-glow-y',`${(y*100).toFixed(0)}%`);
          } else {
            card.style.setProperty('--glow-x',`${(x*100).toFixed(0)}%`);
            card.style.setProperty('--glow-y',`${(y*100).toFixed(0)}%`);
          }
          frame=0;
        });
      },{passive:true});
      card.addEventListener('pointerleave',()=>{
        card.style.removeProperty('--card-rx');card.style.removeProperty('--card-ry');
      });
    });
    const cta=document.querySelector('.cta-panel');
    if(cta){
      cta.addEventListener('pointermove',e=>{
        const r=cta.getBoundingClientRect();
        cta.style.setProperty('--cta-x',`${(e.clientX-r.left)/r.width*100}%`);
        cta.style.setProperty('--cta-y',`${(e.clientY-r.top)/r.height*100}%`);
      },{passive:true});
    }
  }
  const why=document.querySelector('.why');
  if(why){
    if('IntersectionObserver' in window && !reduced.matches){
      const items=[...why.querySelectorAll('.why-milestone')];
      const ob=new IntersectionObserver(entries=>entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add('is-visible');ob.unobserve(entry.target);}
      }),{threshold:.2});
      items.forEach((item,i)=>{
        item.classList.add('reveal-on-scroll');
        item.style.setProperty('--reveal-delay',`${i*140}ms`);
        ob.observe(item);
      });
    }
  }
})();
