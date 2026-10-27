(() => {
      'use strict';
      const courseData = {
        surucu: {title:'Sürücü Kursu Otomasyonu',desc:'Kursiyer, dönem, ders ve sınav süreçlerinin ürün eğitimi için örnek bir öğrenme planı.',items:['Programın genel arayüzüne giriş','Kursiyer ve dönem kayıtları','Ders planları ve sınav işlemleri','Raporlama ve temel kontroller']},
        src: {title:'SRC Kurs İşlemleri',desc:'SRC kurslarının operasyonel süreçlerini öğrenmek için hazırlanan örnek konu akışı.',items:['Kursiyer kayıt ve grup tanımları','Evrak ve sınıf işlemleri','Sınav listeleri ve sonuç takibi','Yönetim raporları']},
        site: {title:'Site ve Apartman Yönetimi',desc:'Toplu yaşam alanlarında yönetim işlerine odaklanan örnek eğitim planı.',items:['Site ve bağımsız bölüm tanımları','Sakin ve mülk sahibi kayıtları','Aidat ve tahsilat akışları','İşlem ve durum raporları']},
        muhasebe: {title:'Genel Muhasebe Temelleri',desc:'Muhasebe yazılımı kullanımına başlangıç için tasarlanmış örnek ders akışı.',items:['Hesap planını tanıma','Fiş giriş ve kontrolü','Cari ve kayıt yönetimi','Temel mali raporlar']},
        efatura: {title:'E-Fatura ve E-Defter',desc:'Elektronik belge süreçlerine yönelik örnek öğrenme başlıkları.',items:['E-belge süreçlerine giriş','Belge oluşturma adımları','Gönderim ve durum kontrolleri','Arşivleme ve raporlama']},
        rapor: {title:'Raporlama ve Verimlilik',desc:'Operasyonel verileri daha anlamlı kullanmak için oluşturulan örnek eğitim akışı.',items:['Rapor ekranlarını tanıma','Filtre ve tarih aralıkları','Rapor çıktıları alma','Günlük kontrol listeleri']}
      };
      const grid = document.getElementById('course-grid');
      const cards = [...grid.querySelectorAll('.course-card')];
      const buttons = [...document.querySelectorAll('[data-filter]')];
      const search = document.getElementById('course-search');
      let activeCategory = 'all';
      const filterCards = (animate = false) => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const oldRects = animate && !reduceMotion ? new Map(cards.filter(card => !card.hidden).map(card => [card, card.getBoundingClientRect()])) : null;
        const q = search.value.trim().toLocaleLowerCase('tr-TR');
        let visible = 0;
        cards.forEach(card => {
          const matchesCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
          const matchesQuery = card.textContent.toLocaleLowerCase('tr-TR').includes(q);
          card.hidden = !(matchesCategory && matchesQuery);
          if (!card.hidden) visible++;
        });
        let empty = grid.querySelector('.empty-state');
        if (!visible && !empty) {empty = document.createElement('p');empty.className='empty-state';empty.setAttribute('role','status');empty.textContent='Aramanıza uygun eğitim bulunamadı. Başka bir kelime deneyin.';grid.appendChild(empty)}
        if (visible && empty) empty.remove();
        if (oldRects && typeof Element.prototype.animate === 'function') {
          cards.filter(card => !card.hidden).forEach((card, i) => {
            const before = oldRects.get(card);
            const after = card.getBoundingClientRect();
            const dx = before ? before.left - after.left : 0;
            const dy = before ? before.top - after.top : 22;
            card.animate([
              {opacity: before ? 1 : 0, transform:`translate(${dx}px, ${dy}px)`},
              {opacity:1, transform:'translate(0, 0)'}
            ],{duration:480,delay:Math.min(i*45,240),easing:'cubic-bezier(.22,1,.36,1)'});
          });
        }
      };
      buttons.forEach(btn => btn.addEventListener('click', () => { activeCategory = btn.dataset.filter; buttons.forEach(b => {const selected = b===btn;b.classList.toggle('is-active',selected);b.setAttribute('aria-pressed',String(selected))});filterCards(true) }));
      search.addEventListener('input',filterCards);
      const menuToggle = document.getElementById('menu-toggle');
      const nav = document.getElementById('main-nav');
      function closeMenu(){nav.classList.remove('is-open');menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Menüyü aç')}
      menuToggle.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Menüyü kapat':'Menüyü aç')});
      nav.querySelectorAll('a').forEach(link => link.addEventListener('click',closeMenu));
      const backdrop=document.getElementById('course-modal');
      const modal=backdrop.querySelector('.modal');
      const closeBtn=document.getElementById('modal-close');
      let priorFocus=null;
      function closeModal(){backdrop.classList.remove('is-open');backdrop.setAttribute('aria-hidden','true');document.body.style.overflow='';if(priorFocus)priorFocus.focus()}
      function openModal(id,origin){const c=courseData[id];if(!c)return;priorFocus=origin||document.activeElement;document.getElementById('modal-heading').textContent=c.title;document.getElementById('modal-description').textContent=c.desc;document.getElementById('modal-modules').replaceChildren(...c.items.map(t=>{const li=document.createElement('li');const icon=document.createElementNS('http://www.w3.org/2000/svg','svg');const use=document.createElementNS('http://www.w3.org/2000/svg','use');use.setAttribute('href','#i-check-circle');icon.appendChild(use);li.appendChild(icon,document.createTextNode(t));return li;}));document.getElementById('modal-mailto').href='mailto:tabim@tabim.com.tr?subject='+encodeURIComponent('TABİM Akademi Eğitim Talebi: '+c.title);backdrop.classList.add('is-open');backdrop.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';closeBtn.focus()}
      document.querySelectorAll('[data-open]').forEach(btn=>btn.addEventListener('click',()=>openModal(btn.dataset.open,btn)));
      document.getElementById('preview-play').addEventListener('click',ev=>openModal('surucu',ev.currentTarget));
      closeBtn.addEventListener('click',closeModal);document.getElementById('modal-back').addEventListener('click',closeModal);
      backdrop.addEventListener('click',e=>{if(e.target===backdrop)closeModal()});
      document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(backdrop.classList.contains('is-open'))closeModal();else closeMenu()}if(e.key==='Tab'&&backdrop.classList.contains('is-open')){const focusables=[...modal.querySelectorAll('button,a[href]')].filter(el=>!el.disabled);const first=focusables[0],last=focusables[focusables.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
      document.getElementById('year').textContent=new Date().getFullYear();
    })();
