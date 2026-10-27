(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(reduced.matches)return;
  const clamp = v => Math.min(1,Math.max(0,v));
  const smooth = v => { const t=clamp(v);return t*t*(3-2*t);};
  const interp=(a,b,t)=>a+(b-a)*t;
  const place=(el,x,y,ry,rx,rz,scale,alpha) => {
    if(!el)return;
    el.style.transform=`translate(-50%,-50%) translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotateY(${ry.toFixed(1)}deg) rotateX(${rx.toFixed(1)}deg) rotateZ(${rz.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
    el.style.opacity=clamp(alpha).toFixed(3);
  };
  function createChapter(id,kind) {
    const root=document.getElementById(id);
    if(!root)return;
    const prefix=kind==='lesson'?'ml':'eco';
    const copies=[...root.querySelectorAll(kind==='lesson'?'[data-motion-copy]':'[data-eco-copy]')];
    const jumps=[...root.querySelectorAll(`[data-${prefix}-jump]`)];
    const fill=root.querySelector(`[data-${prefix}-progress]`);
    const tablet=root.querySelector('[data-ml-device="tablet"]');
    const stack=root.querySelector('[data-ml-device="stack"]');
    const success=root.querySelector('[data-ml-device="success"]');
    const note=root.querySelector('[data-ml-device="note"]');
    const cards=[...root.querySelectorAll('.mv-stack-card')];
    const desktop=root.querySelector('[data-eco-device="desktop"]');
    const ecoTablet=root.querySelector('[data-eco-device="tablet"]');
    const phone=root.querySelector('[data-eco-device="phone"]');
    const ecoLabels=[...root.querySelectorAll('.eco-orbit-label')];
    let target=0,current=0,raf=0,lastScene=-1,wasVisible=true;
    const mobile=()=>window.innerWidth<=700;
    const range=()=>Math.max(1,root.offsetHeight-root.querySelector('.motion-sticky,.eco-sticky').offsetHeight);
    function progress(){return clamp(-root.getBoundingClientRect().top / range());}
    function render(p){
      const isMobile=mobile(), W=window.innerWidth;
      let weights;
      if(kind==='lesson'){
        const en1=smooth((p-.015)/.145), ex1=smooth((p-.285)/.14);
        const en2=smooth((p-.35)/.15), ex2=smooth((p-.615)/.14);
        const en3=smooth((p-.68)/.14);
        const dist=isMobile?Math.max(W*1.55,580):Math.max(W*.75,940);
        place(tablet,dist*(1-en1)-dist*.92*ex1,85*(1-en1)-110*ex1,-62*(1-en1)+24*ex1,17*(1-en1),-21*(1-en1)+14*ex1,.50+.5*en1-.18*ex1,clamp(en1*6)*clamp((1-ex1)*5));
        place(stack,-dist*.08*(1-en2)+dist*.8*ex2,530*(1-en2)-245*ex2,-35*(1-en2)+22*ex2,60*(1-en2)+6*ex2,16*(1-en2)-18*ex2,.58+.42*en2-.25*ex2,clamp(en2*5)*clamp((1-ex2)*5));
        cards.forEach((c,i)=>{const t=smooth((p-.37-i*.035)/.13);const offset=(isMobile?[-9,0,9]:[-78,4,82])[i];const a=(isMobile?[-4,2,5]:[-10,3,12])[i];const dy=isMobile?(i-1)*77*t:(i-1)*8*t;c.style.transform=`translate3d(${(offset*t).toFixed(1)}px,${dy.toFixed(1)}px,0) rotateZ(${(a*t).toFixed(1)}deg)`;c.style.zIndex=String(3-i)});
        place(success,dist*(1-en3),-45*(1-en3),78*(1-en3),-16*(1-en3),16*(1-en3),.66+.34*en3,clamp(en3*6));
        place(note,0,62*(1-en3),0,0,-8+8*en3,.75+.25*en3,clamp((en3-.36)*2.4));
        weights=[1-smooth((p-.29)/.12),smooth((p-.29)/.12)*(1-smooth((p-.63)/.12)),smooth((p-.63)/.12)];
      }else{
        const d=isMobile?Math.max(W*1.9,740):Math.max(W*.9,1200);
        const a=smooth((p-.01)/.18), b=smooth((p-.34)/.17), c=smooth((p-.67)/.17);
        const deskScale=(isMobile?.9:1)*(1-.23*b-.12*c);
        place(desktop,-d*(1-a)+(isMobile?40:35)*b-(isMobile?0:80)*c,65*(1-a)-75*b+(isMobile?-55:0)*c,67*(1-a)-12*b+11*c,21*(1-a)+5*c,-18*(1-a)-8*b, (.55+.45*a)*deskScale,clamp(a*5));
        place(ecoTablet,d*(1-b)+(isMobile?42:60)*c,50*(1-b)+(isMobile?38:80)*c,-66*(1-b)-10*c,-15*(1-b),20*(1-b)-8*c, (.58+.42*b)*(1-.05*c)*(isMobile?1:.88),clamp(b*6));
        place(phone,110*(1-c),d*(1-c)-20,47*(1-c),32*(1-c),44*(1-c)-8*c,.5+.5*c,clamp(c*6));
        ecoLabels.forEach((el,i)=>{const amount=smooth((p-(i===0?.38:.72))/.13);el.style.opacity=amount.toFixed(3);el.style.transform=`translateY(${((1-amount)*25).toFixed(1)}px)`});
        weights=[1-smooth((p-.32)/.13),smooth((p-.32)/.13)*(1-smooth((p-.65)/.13)),smooth((p-.65)/.13)];
      }
      const scene=p<.36?0:p<.69?1:2;
      copies.forEach((el,i)=>{
        const opacity=weights[i];el.style.opacity=opacity.toFixed(3);
        el.style.transform=`translate3d(${((i<scene?-22:0)*(1-opacity)).toFixed(1)}px,${((1-opacity)*45).toFixed(1)}px,0)`;
        el.style.pointerEvents=i===scene?'auto':'none';
        el.setAttribute('aria-hidden',String(i!==scene));
      });
      if(scene!==lastScene){lastScene=scene;jumps.forEach((el,i)=>{el.classList.toggle('is-current',i===scene);if(i===scene)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current')});}
      if(fill) fill.style.transform=`scaleX(${p.toFixed(4)})`;
      root.style.setProperty('--scene-progress',p.toFixed(4));
    }
    function frame(){raf=0;if(!wasVisible)return;current+=.27*(target-current);if(Math.abs(target-current)<.0004)current=target;render(current);if(current!==target)raf=requestAnimationFrame(frame);}
    function schedule(){if(!wasVisible)return;target=progress();if(!raf)raf=requestAnimationFrame(frame);}
    function init(){target=progress();current=target;render(current)}
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',init,{passive:true});
    jumps.forEach((button,i)=>button.addEventListener('click',()=>{
      const rect=root.getBoundingClientRect(),top=window.scrollY+rect.top;
      window.scrollTo({top:Math.round(top+range()*[.165,.50,.855][i]),behavior:'smooth'});
    }));
    if('IntersectionObserver' in window){
      const observer=new IntersectionObserver(entries=>{
        wasVisible=entries[0].isIntersecting;
        if(wasVisible)init();else if(raf){cancelAnimationFrame(raf);raf=0}
      },{rootMargin:'200px 0px 200px 0px'});
      observer.observe(root);
    }
    init();
  }
  createChapter('canli-deneyim','lesson');
  createChapter('her-ekranda','eco');
})();
