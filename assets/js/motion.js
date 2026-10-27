(() => {
    'use strict';
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const header = document.querySelector('.header');
    const topButton = document.getElementById('back-to-top');
    const hero = document.querySelector('.hero');
    const stage = document.querySelector('.hero-stage');
    let scrollPending = false;
    const updateScrollState = () => {
      const top = window.scrollY || document.documentElement.scrollTop;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      header.style.setProperty('--scroll-progress', `${max > 0 ? Math.min(100, top/max*100) : 0}%`);
      header.classList.toggle('is-scrolled',top > 18);
      topButton.classList.toggle('is-visible',top > 500);
      scrollPending = false;
    };
    window.addEventListener('scroll', () => {
      if (!scrollPending) {scrollPending = true; requestAnimationFrame(updateScrollState);}
    },{passive:true});
    window.addEventListener('resize',updateScrollState,{passive:true});
    updateScrollState();

    // Accessibility: never hide content in older browsers or for users who opt out of motion.
    const revealSelectors = [
      '.quickitem','.courses .section-head','.filter-area','.course-card',
      '.learn-copy > .eyebrow','.learn-copy > .section-title','.learn-copy > p',
      '.learn-copy > .steps','.learn-copy > .btn','.learn-visual',
      '.why > .container > .eyebrow','.why > .container > .section-title',
      '.why-card','.cta-panel','.faq-layout > div:first-child','.faq details',
      '.footer-grid > div'
    ].join(',');
    if ('IntersectionObserver' in window && !reducedMotion.matches) {
      const revealElements = [...document.querySelectorAll(revealSelectors)];
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },{rootMargin:'0px 0px -42px 0px',threshold:.08});
      revealElements.forEach((element,index) => {
        element.classList.add('reveal-on-scroll');
        if (element.classList.contains('learn-visual')) element.classList.add('reveal-right');
        if (element.classList.contains('learn-copy')) element.classList.add('reveal-left');
        // Cards reveal in small groups, rather than all at once.
        if (element.matches('.course-card,.why-card,.quickitem,.faq details')) {
          const siblingIndex = [...element.parentElement.children].indexOf(element);
          element.style.setProperty('--reveal-delay',`${Math.min(siblingIndex%4*85,255)}ms`);
        }
        observer.observe(element);
      });
      root.classList.add('motion-enabled');
    }

    // Decorative effects are only enabled for fine-pointer devices with motion allowed.
    if (window.matchMedia('(hover:hover) and (pointer:fine)').matches && !reducedMotion.matches) {
      let heroFrame = null;
      hero.addEventListener('pointermove', e => {
        if (heroFrame !== null) cancelAnimationFrame(heroFrame);
        heroFrame = requestAnimationFrame(() => {
          const bounds=hero.getBoundingClientRect();
          hero.style.setProperty('--spot-x',`${((e.clientX-bounds.left)/bounds.width*100).toFixed(2)}%`);
          hero.style.setProperty('--spot-y',`${((e.clientY-bounds.top)/bounds.height*100).toFixed(2)}%`);
          heroFrame = null;
        });
      },{passive:true});
      let stageFrame = null;
      stage.addEventListener('pointermove',e => {
        if(stageFrame !== null) cancelAnimationFrame(stageFrame);
        stageFrame=requestAnimationFrame(() => {
          const b=stage.getBoundingClientRect();
          const x=Math.max(-1,Math.min(1,((e.clientX-b.left)/b.width-.5)*2));
          const y=Math.max(-1,Math.min(1,((e.clientY-b.top)/b.height-.5)*2));
          stage.style.setProperty('--stage-x',`${(x*11).toFixed(2)}px`);
          stage.style.setProperty('--stage-y',`${(y*8).toFixed(2)}px`);
          stage.style.setProperty('--float-x',`${(-x*11).toFixed(2)}px`);
          stage.style.setProperty('--float-y',`${(-y*7).toFixed(2)}px`);
          stage.style.setProperty('--float-opp-x',`${(x*11).toFixed(2)}px`);
          stage.style.setProperty('--float-opp-y',`${(y*7).toFixed(2)}px`);
          stageFrame=null;
        });
      },{passive:true});
      stage.addEventListener('pointerleave',()=>{
        ['--stage-x','--stage-y','--float-x','--float-y','--float-opp-x','--float-opp-y'].forEach(prop=>stage.style.removeProperty(prop));
      });
    }

    // Active navigation underlines follow the section in the viewport.
    const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
    const navSections = navLinks.map(a=>({a,section:document.querySelector(a.getAttribute('href'))})).filter(item=>item.section);
    if ('IntersectionObserver' in window) {
      const sectionObserver = new IntersectionObserver(entries => {
        const visible=entries.filter(e=>e.isIntersecting);
        if(!visible.length)return;
        const best=visible.sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0].target;
        navSections.forEach(({a,section}) => {
          const isCurrent=section===best;
          a.classList.toggle('is-current',isCurrent);
          if(isCurrent)a.setAttribute('aria-current','location');
          else a.removeAttribute('aria-current');
        });
      },{rootMargin:'-18% 0px -48% 0px',threshold:[0,.05,.25,.5]});
      navSections.forEach(item=>sectionObserver.observe(item.section));
    }
  })();
