/* TABİM Akademi — temalar; sunucusuz ve harici kütüphanesiz */
(function () {
  'use strict';
  const key = 'tabim-akademi-color-theme-v1';
  const names = {
    midnight: 'Midnight Ocean', gold: 'Obsidian Gold',
    cosmic: 'Cosmic Violet', arctic: 'Arctic Minimal',
    emerald: 'Emerald Night', classic: 'Klasik TABİM'
  };
  const backgrounds = {
    midnight: '#091521', gold: '#101214', cosmic: '#0c0920',
    arctic: '#172845', emerald: '#071c1b', classic: '#0b1429'
  };
  const root = document.documentElement;
  const isValid = value => Object.prototype.hasOwnProperty.call(names, value);
  const readSaved = () => { try { return localStorage.getItem(key); } catch (_) { return null; } };
  const save = value => { try { localStorage.setItem(key, value); } catch (_) { /* örn. kısıtlı file:// bağlamı */ } };
  let active = isValid(readSaved()) ? readSaved() : 'midnight';
  root.dataset.theme = active; // Sayfa çizilmeden uygulanır.

  function init() {
    const dock = document.getElementById('theme-dock');
    const trigger = document.getElementById('theme-launch');
    const panel = document.getElementById('theme-panel');
    const close = document.getElementById('theme-panel-close');
    const label = document.getElementById('theme-current');
    const announcement = document.getElementById('theme-announcement');
    const options = [...document.querySelectorAll('[data-set-theme]')];
    if (!dock || !trigger || !panel || !close || !label || !options.length) return;

    const paint = name => {
      if (!isValid(name)) return;
      active = name;
      root.dataset.theme = name;
      label.textContent = names[name];
      trigger.setAttribute('aria-label', 'Renk paletini değiştir. Seçili: ' + names[name]);
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', backgrounds[name]);
      options.forEach(option => {
        const chosen = option.dataset.setTheme === name;
        option.setAttribute('aria-pressed', String(chosen));
      });
    };
    const setOpen = open => {
      dock.dataset.open = String(open);
      panel.setAttribute('aria-hidden', String(!open));
      trigger.setAttribute('aria-expanded', String(open));
      // Kapalı içerik klavye tab sırasına girmez.
      panel.inert = !open;
    };
    paint(active);
    setOpen(false);
    trigger.addEventListener('click', () => {
      const open = dock.dataset.open !== 'true';
      setOpen(open);
      if (open) panel.querySelector('[aria-pressed="true"]')?.focus({preventScroll:true});
    });
    close.addEventListener('click', () => {setOpen(false);trigger.focus({preventScroll:true});});
    options.forEach(option => option.addEventListener('click', () => {
      const name = option.dataset.setTheme;
      if (!isValid(name)) return;
      paint(name);
      save(name);
      if (announcement) announcement.textContent = names[name] + ' teması uygulandı.';
      setOpen(false);
      trigger.focus({preventScroll:true});
    }));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && dock.dataset.open === 'true') {
        setOpen(false);trigger.focus({preventScroll:true});
      }
    });
    document.addEventListener('pointerdown', event => {
      if (dock.dataset.open === 'true' && !dock.contains(event.target)) setOpen(false);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
