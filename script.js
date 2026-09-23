// Acesso Aberto — interações simples e acessíveis por teclado e toque

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Barra de acessibilidade: tamanho do texto ---------- */
  var fontSteps = ['87.5%', '100%', '112.5%', '125%', '137.5%'];
  var storedStep = parseInt(localStorage.getItem('aa-font-step'), 10);
  var fontStepIndex = isNaN(storedStep) ? 1 : Math.min(Math.max(storedStep, 0), fontSteps.length - 1);

  var btnDecrease = document.getElementById('btn-font-decrease');
  var btnReset = document.getElementById('btn-font-reset');
  var btnIncrease = document.getElementById('btn-font-increase');

  function applyFontStep() {
    document.documentElement.style.fontSize = fontSteps[fontStepIndex];
    localStorage.setItem('aa-font-step', String(fontStepIndex));
    if (btnDecrease) btnDecrease.disabled = fontStepIndex === 0;
    if (btnIncrease) btnIncrease.disabled = fontStepIndex === fontSteps.length - 1;
  }

  if (btnDecrease && btnReset && btnIncrease) {
    btnDecrease.addEventListener('click', function () {
      fontStepIndex = Math.max(0, fontStepIndex - 1);
      applyFontStep();
    });
    btnReset.addEventListener('click', function () {
      fontStepIndex = 1;
      applyFontStep();
    });
    btnIncrease.addEventListener('click', function () {
      fontStepIndex = Math.min(fontSteps.length - 1, fontStepIndex + 1);
      applyFontStep();
    });
    applyFontStep();
  }

  /* ---------- Barra de acessibilidade: alto contraste ---------- */
  var btnContrast = document.getElementById('btn-contrast');
  if (btnContrast) {
    var contrastOn = localStorage.getItem('aa-high-contrast') === 'true';

    function applyContrast() {
      document.body.classList.toggle('high-contrast', contrastOn);
      btnContrast.setAttribute('aria-pressed', String(contrastOn));
    }
    applyContrast();

    btnContrast.addEventListener('click', function () {
      contrastOn = !contrastOn;
      localStorage.setItem('aa-high-contrast', String(contrastOn));
      applyContrast();
    });
  }

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('menu-principal');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Fecha o menu ao escolher um link (útil no celular)
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.matchMedia('(max-width: 720px)').matches) {
          nav.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /* ---------- Destaque de navegação ativa ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.main-nav a');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            if (link.getAttribute('href') === '#' + id) { link.setAttribute('aria-current', 'true'); } else { link.removeAttribute('aria-current'); }
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });

    sections.forEach(function (section) { observer.observe(section); });
  }

  /* ---------- Fonte legível ---------- */
  var btnReadable = document.getElementById('btn-font-readable');
  if (btnReadable) {
    var readableOn = localStorage.getItem('aa-readable') === 'true';
    var applyReadable = function () {
      document.body.classList.toggle('readable-font', readableOn);
      btnReadable.setAttribute('aria-pressed', String(readableOn));
    };
    applyReadable();
    btnReadable.addEventListener('click', function () {
      readableOn = !readableOn;
      localStorage.setItem('aa-readable', String(readableOn));
      applyReadable();
    });
  }

  /* ---------- Galeria: imagem ampliada ---------- */
  var box = document.getElementById('lightbox');
  var zoomButtons = document.querySelectorAll('.gallery-zoom');
  if (box && typeof box.showModal === 'function') {
    var boxImg = document.getElementById('lightbox-img');
    var boxCaption = document.getElementById('lightbox-caption');
    zoomButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var img = btn.querySelector('img');
        boxImg.src = img.currentSrc || img.src;
        boxImg.alt = img.alt;
        boxCaption.textContent = btn.closest('figure').querySelector('figcaption').textContent;
        box.showModal();
      });
    });
    box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
  } else {
    zoomButtons.forEach(function (b) { b.disabled = true; b.style.cursor = 'default'; });
  }


});