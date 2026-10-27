/* Frame-synced, scroll-driven laptop choreography. No libraries/network requests. */
  (() => {
    'use strict';
    const section=document.getElementById('deneyim');
    if(!section) return;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    if(reduced.matches) {section.querySelectorAll('.scene-copy').forEach(copy=>{copy.removeAttribute('aria-hidden');copy.querySelectorAll('a').forEach(link=>link.removeAttribute('tabindex'))});return;}
    const stage=section.querySelector('.cinema-sticky');
    const devices=[...section.querySelectorAll('.cinema-laptop')];
    const copies=[...section.querySelectorAll('.scene-copy')];
    const jumps=[...section.querySelectorAll('[data-cinema-jump]')];
    const fill=document.getElementById('cinema-track-fill');
    const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
    const smoother=(x)=>{x=clamp(x);return x*x*(3-2*x)};
    let progress=0, target=0, request=0, active=-1;
    const range=()=>Math.max(1,section.offsetHeight-window.innerHeight);
    const getProgress=()=>clamp(-section.getBoundingClientRect().top/range());
    function apply(p){
      const vw=window.innerWidth;
      const mobile=vw<821;
      const dist=Math.max(vw*(mobile?1.15:.80),mobile?420:790);
      const entries=[smoother((p-.005)/.125),smoother((p-.30)/.13),smoother((p-.64)/.13)];
      const exits=[smoother((p-.295)/.13),smoother((p-.625)/.13),0];
      const sign=[1,-1,1];
      devices.forEach((device,i)=>{
        const enter=entries[i],exit=exits[i];
        const slide=sign[i]*dist*(1-enter)-sign[i]*dist*.9*exit;
        const y=(1-enter)*(i===1?180:125)+exit*(i===1?-140:90);
        const rotateY=sign[i]*(1-enter)*(-39)+exit*sign[i]*25;
        const rotateZ=(1-enter)*(i===1?-16:13)+exit*(i===1?10:-10);
        const rotateX=(1-enter)*11+(1-exit)*(-2);
        const scale=(mobile?.87:1)*( .68+.32*enter-.19*exit );
        const visibility=clamp(enter*5)*clamp((1-exit)*5);
        device.style.transform=`translate(-50%,-50%) translate3d(${slide.toFixed(1)}px,${y.toFixed(1)}px,0) rotateY(${rotateY.toFixed(1)}deg) rotateX(${rotateX.toFixed(1)}deg) rotateZ(${rotateZ.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
        device.style.opacity=visibility.toFixed(3);
      });
      const fades=[1-smoother((p-.29)/.125),smoother((p-.29)/.125)*(1-smoother((p-.63)/.125)),smoother((p-.63)/.125)];
      const next=p<.357?0:p<.695?1:2;
      copies.forEach((copy,i)=>{
        const opacity=fades[i];
        copy.style.opacity=opacity.toFixed(3);
        copy.style.transform=`translate3d(${(i<next?-32:0)}px,${((1-opacity)*34).toFixed(1)}px,0)`;
        copy.style.pointerEvents=i===next?'auto':'none';
        copy.setAttribute('aria-hidden',String(i!==next));
        copy.querySelectorAll('a').forEach(a=>{a.tabIndex=i===next?0:-1});
      });
      if(next!==active){active=next;jumps.forEach((el,i)=>{el.classList.toggle('is-active',i===next);el.setAttribute('aria-current',i===next?'step':'false')})}
      fill.style.transform=`scaleX(${p.toFixed(4)})`;
      stage.style.setProperty('--halo-x',`${(p*140).toFixed(1)}px`);
      stage.style.setProperty('--halo-y',`${(Math.sin(p*Math.PI)*-55).toFixed(1)}px`);
      stage.style.setProperty('--halo-bx',`${(p*-150).toFixed(1)}px`);
      stage.style.setProperty('--halo-by',`${(p*-90).toFixed(1)}px`);
    }
    function frame(){request=0;progress+=(target-progress)*.32;if(Math.abs(target-progress)<.0003)progress=target;apply(progress);if(progress!==target)request=requestAnimationFrame(frame)}
    function schedule(){target=getProgress();if(!request)request=requestAnimationFrame(frame)}
    let initialized=false;
    function init(){target=getProgress();if(!initialized){progress=target;initialized=true}apply(progress);schedule()}
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',init,{passive:true});
    jumps.forEach((btn,i)=>btn.addEventListener('click',()=>{
      const offsets=[.16,.50,.83];
      const absolute=window.scrollY+section.getBoundingClientRect().top;
      window.scrollTo({top:Math.round(absolute+range()*offsets[i]),behavior:'smooth'});
    }));
    // Reinstating an accessible static layout if user switches Reduce Motion while page is open.
    reduced.addEventListener('change',()=>window.location.reload());
    init();
  })();
