/* Shared: WhatsApp links and the floating bubble. No cookies, no storage, no tracking. */
(function () {
  var BASE = 'https://wa.me/972506762006';
  var TEXTS = {
    'default': 'שלום, הגעתי מהדף של כותר.',
    contractors: 'שלום, אני קבלן או יזם, ורוצה לשלוח תוכניות של פרויקט אחד.',
    home: 'שלום, אני בונה בית, ורוצה לשמוע על פרגולה או דק.'
  };
  var CATALOG = '(הגעתי מהקטלוג)';
  var params = new URLSearchParams(window.location.search);
  var fromCatalog = params.get('utm_source') === 'catalog';

  var links = document.querySelectorAll('[data-wa]');
  for (var i = 0; i < links.length; i++) {
    var key = links[i].getAttribute('data-wa');
    var text = TEXTS[key] || TEXTS['default'];
    if (fromCatalog) text += ' ' + CATALOG;
    links[i].href = BASE + '?text=' + encodeURIComponent(text);
  }

  /* Full gallery: items 01-12 are plain HTML; 13-39 are revealed on request (no src until then). */
  var grid = document.getElementById('grid-all');
  var more = document.getElementById('grid-more');
  var dlg = document.getElementById('g-dialog');
  if (grid && more && dlg && typeof dlg.showModal === 'function') {
    var large = document.getElementById('g-large');
    var cap = document.getElementById('g-cap');
    var closeBtn = document.getElementById('g-close');
    var opener = null;

    more.hidden = false;
    more.addEventListener('click', function () {
      var hiddenItems = grid.querySelectorAll('li[hidden]');
      var firstBtn = null;
      for (var j = 0; j < hiddenItems.length; j++) {
        var im = hiddenItems[j].querySelector('img[data-src]');
        if (im) { im.src = im.getAttribute('data-src'); im.removeAttribute('data-src'); }
        hiddenItems[j].hidden = false;
        if (!firstBtn) firstBtn = hiddenItems[j].querySelector('button');
      }
      more.hidden = true;
      if (firstBtn) firstBtn.focus();
    });

    grid.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.g-thumb') : null;
      if (!btn) return;
      var thumb = btn.querySelector('img');
      opener = btn;
      large.src = '/assets/gallery/' + btn.getAttribute('data-n') + '-large.jpg';
      cap.textContent = thumb.getAttribute('alt');
      dlg.showModal();
    });

    closeBtn.addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () {
      large.removeAttribute('src');
      if (opener) opener.focus();
    });
  }

  var bubble = document.querySelector('.wa-float');
  var contact = document.getElementById('contact');
  if (bubble && contact && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      bubble.classList.toggle('is-hidden', entries[0].isIntersecting);
    }, { threshold: 0.1 }).observe(contact);
  }
})();
