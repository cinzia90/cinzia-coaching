/* ============================================================
   CINZIA ROSATO PT — Premium JS 2026
   Three.js WebGL | Grain | Lenis | Char Split | Velocity Skew
   Custom Cursor | Magnetic | Particles | GSAP | Tilt | Form
   ============================================================ */

/* ----- PRELOADER INTRO (logo + tagline → curtain sweep → sito) ----- */
(function() {
  var pre  = document.getElementById('preloader');
  if (!pre) return;

  document.body.style.overflow = 'hidden';

  var logoWrap  = pre.querySelector('.pre-logo-wrap');
  var words     = pre.querySelectorAll('.pre-word');
  var bar       = document.getElementById('pre-bar');
  var curtain   = pre.querySelector('.pre-curtain');

  function runPreloader() {
    var tl = gsap.timeline({
      onComplete: function() {
        document.body.style.overflow = '';
        pre.style.display = 'none';
      }
    });

    /* 1. Logo appare */
    tl.to(logoWrap, { opacity: 1, scale: 1, duration: .9, ease: 'power3.out' }, 0);

    /* 2. Parole appaiono a stagger */
    tl.to(words, {
      opacity: 1, y: 0, duration: .65,
      stagger: .18, ease: 'power3.out'
    }, .5);

    /* 3. Barra si riempie */
    tl.to(bar, { width: '100%', duration: 1.6, ease: 'power2.inOut' }, .6);

    /* 4. Tendina teal sale dal basso (curtain reveal) */
    tl.to(curtain, { y: 0, duration: .55, ease: 'power4.in' }, 2.5);

    /* 5. Tutto sale e sparisce */
    tl.to(pre, { yPercent: -100, duration: .65, ease: 'power4.inOut' }, 3.0);
  }

  if (typeof gsap !== 'undefined') {
    runPreloader();
  } else {
    /* fallback CSS */
    setTimeout(function() {
      pre.style.transition = 'opacity .6s';
      pre.style.opacity = '0';
      setTimeout(function() {
        pre.style.display = 'none';
        document.body.style.overflow = '';
      }, 650);
    }, 2400);
  }
})();

/* ----- THREE.JS ANIMATED GRADIENT MESH (hero background) ----- */
(function() {
  var canvas = document.getElementById('webgl-hero');
  if (!canvas || typeof THREE === 'undefined') return;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);

  var scene  = new THREE.Scene();
  var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  var uniforms = {
    u_time:       { value: 0.0 },
    u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    u_mouse:      { value: new THREE.Vector2(0.5, 0.5) }
  };

  var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    transparent: true,
    vertexShader: [
      'varying vec2 vUv;',
      'void main() { vUv = uv; gl_Position = vec4(position, 1.0); }'
    ].join('\n'),
    fragmentShader: [
      'precision mediump float;',
      'uniform float u_time;',
      'uniform vec2 u_resolution;',
      'uniform vec2 u_mouse;',
      'varying vec2 vUv;',

      'float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5); }',
      'float noise(vec2 p){',
      '  vec2 i=floor(p),f=fract(p);',
      '  f=f*f*(3.0-2.0*f);',
      '  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);',
      '}',

      'void main(){',
      '  float t = u_time * 0.16;',
      '  vec2 uv = vUv;',
      '  vec2 m = u_mouse * 0.15;',

      '  float n1 = noise(uv * 2.4 + t + m);',
      '  float n2 = noise(uv * 3.6 - t * 0.8 + 1.7 + m * 1.2);',
      '  float n3 = noise(uv * 1.8 + t * 0.5 + 3.1);',

      '  vec3 dark  = vec3(0.020, 0.051, 0.067);',   /* #050D11 */
      '  vec3 mid   = vec3(0.043, 0.098, 0.129);',   /* #0B1921 */
      '  vec3 teal  = vec3(0.059, 0.455, 0.435);',   /* accent  */

      '  vec3 c = mix(dark, mid, n1 * 0.75);',
      '  c = mix(c, teal, n2 * n3 * 0.38);',

      '  gl_FragColor = vec4(c, 0.92);',
      '}'
    ].join('\n')
  });

  var mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(mesh);

  window.addEventListener('mousemove', function(e) {
    uniforms.u_mouse.value.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
  }, { passive: true });

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
  }, { passive: true });

  var clock = new THREE.Clock();
  (function animate() {
    uniforms.u_time.value = clock.getElapsedTime();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  })();
})();

/* ----- CHARACTER SPLIT HERO TITLE (stile cinematografico) ----- */
(function splitHeroChars() {
  var words = document.querySelectorAll('.reveal-word');
  if (!words.length || typeof gsap === 'undefined') return;

  words.forEach(function(word, wi) {
    var text   = word.textContent;
    var isTeal = word.classList.contains('teal-word');
    var html   = '';
    text.split('').forEach(function(ch) {
      var safe = ch === ' ' ? '&nbsp;' : ch.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      html += '<span class="char">' + safe + '</span>';
    });
    word.innerHTML = html;
    word.classList.add('split-done');
    if (isTeal) word.querySelectorAll('.char').forEach(function(c){ c.style.color = 'inherit'; });

    gsap.from(word.querySelectorAll('.char'), {
      y: 90,
      opacity: 0,
      rotateX: -55,
      transformOrigin: '0% 50% -40px',
      duration: 0.85,
      stagger: 0.038,
      ease: 'power4.out',
      delay: wi * 0.22 + 0.4
    });
  });
})();

/* ----- LENIS SMOOTH SCROLL (RAF classico — stabile con ScrollTrigger) ----- */
var lenis;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 0.9,            /* ridotto da 1.1 → meno lag su trackpad PC integrato */
    easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    smoothWheel: true,
    wheelMultiplier: 0.95,
    smoothTouch: false,       /* mobile: usa scroll nativo, evita conflitti iOS */
    touchMultiplier: 1.8
  });

  /* Loop RAF — nessun conflitto con ScrollTrigger */
  function _lenisRaf(time) { lenis.raf(time); requestAnimationFrame(_lenisRaf); }
  requestAnimationFrame(_lenisRaf);

  /* ScrollTrigger aggiornato ad ogni frame Lenis */
  lenis.on('scroll', function() {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
  });

  /* VELOCITY SKEW leggero solo sul titolo hero */
  var _skewEl = document.querySelector('[data-skew]');
  lenis.on('scroll', function(e) {
    if (!_skewEl || typeof gsap === 'undefined') return;
    var sk = Math.min(Math.max(e.velocity * 0.15, -1.8), 1.8);
    gsap.to(_skewEl, { skewY: sk, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
  });
}

/* ----- CUSTOM CURSOR (stile luxury brand) ----- */
var dot    = document.getElementById('cursor-dot');
var ring   = document.getElementById('cursor-ring');
var mouseX = 0, mouseY = 0;
var ringX  = 0, ringY  = 0;
var isMobileDevice = window.innerWidth < 768;

if (!isMobileDevice && dot && ring) {
  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = 'translate(' + (mouseX - 4) + 'px,' + (mouseY - 4) + 'px)';
  });

  (function animateCursor() {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    ring.style.transform = 'translate(' + (ringX - 20) + 'px,' + (ringY - 20) + 'px)';
    requestAnimationFrame(animateCursor);
  })();

  // Cursor scale su elementi interattivi
  var interactives = document.querySelectorAll('a, button, .tilt-card, .marquee-item, .comp-scene');
  interactives.forEach(function(el) {
    el.addEventListener('mouseenter', function() {
      dot.classList.add('cursor-hover');
      ring.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', function() {
      dot.classList.remove('cursor-hover');
      ring.classList.remove('cursor-hover');
    });
  });
}

/* ----- NAV ----- */
function toggleMenu() { document.getElementById('nav-mobile').classList.toggle('hidden'); }
function closeMenu()  { document.getElementById('nav-mobile').classList.add('hidden'); }

document.querySelectorAll('a[href^="#"]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    closeMenu();
    if (lenis) { lenis.scrollTo(target, { offset: -70, duration: 1.6 }); }
    else        { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

window.addEventListener('scroll', function() {
  var nav = document.getElementById('navbar');
  if (!nav) return;
  nav.style.boxShadow = window.scrollY > 60 ? '0 4px 30px rgba(0,0,0,.5)' : 'none';
}, { passive: true });

/* ----- PARTICLE SYSTEM ----- */
(function() {
  var canvas = document.getElementById('particles');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var N = window.innerWidth < 768 ? 35 : 80;
  var mouse = { x: 0, y: 0 };

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    N = window.innerWidth < 768 ? 35 : 80;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('mousemove', function(e) {
    mouse.x = (e.clientX / window.innerWidth  - .5) * 14;
    mouse.y = (e.clientY / window.innerHeight - .5) * 14;
  }, { passive: true });

  function Particle() {
    this.reset = function() {
      this.x     = Math.random() * canvas.width;
      this.y     = canvas.height + Math.random() * 80;
      this.size  = Math.random() * 1.8 + .3;
      this.speed = Math.random() * .5 + .15;
      this.drift = (Math.random() - .5) * .2;
      this.alpha = Math.random() * .4 + .07;
    };
    this.reset();
    this.y = Math.random() * canvas.height;
    this.update = function() {
      this.y -= this.speed; this.x += this.drift;
      if (this.y < -8) this.reset();
    };
    this.draw = function() {
      ctx.beginPath();
      ctx.arc(this.x + mouse.x * .25, this.y + mouse.y * .25, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15,184,176,' + this.alpha + ')';
      ctx.fill();
    };
  }

  var particles = [];
  for (var i = 0; i < N; i++) particles.push(new Particle());

  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    while (particles.length < N) particles.push(new Particle());
    if (particles.length > N) particles.length = N;
    particles.forEach(function(p) { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  })();
})();

/* ----- GSAP + ScrollTrigger ----- */
window.addEventListener('load', function() {
  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.ticker.lagSmoothing(0); /* previene compensazione frame-drop che rompe Lenis */
    if (lenis) ScrollTrigger.scrollerProxy(document.body, {
      scrollTop: function(v) { return arguments.length ? lenis.scrollTo(v) : lenis.scroll; },
      getBoundingClientRect: function() { return { top:0, left:0, width: window.innerWidth, height: window.innerHeight }; }
    });
  }

  /* CLIP-PATH IMAGE REVEAL (effetto tendina stile luxury) */
  document.querySelectorAll('.reveal-clip').forEach(function(el) {
    gsap.fromTo(el,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.3,
        ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 82%', once: true }
      }
    );
  });

  /* CHI SONO */
  gsap.from('#chi-sono .chisono-media', {
    scrollTrigger: { trigger: '#chi-sono', start: 'top 78%', once: true },
    x: -60, opacity: 0, duration: 1, ease: 'power3.out'
  });
  gsap.from('#chi-sono .chisono-text > *', {
    scrollTrigger: { trigger: '#chi-sono', start: 'top 76%', once: true },
    y: 35, opacity: 0, duration: .8, stagger: .1, ease: 'power2.out', delay: .2
  });

  /* PALMARES — stage panels entrano da opposti */
  gsap.from('.stage-panel:nth-child(1) .stage-panel-img', {
    scrollTrigger: { trigger: '.stage-panels', start: 'top 82%', once: true },
    x: -70, opacity: 0, duration: 1.1, ease: 'power3.out'
  });
  gsap.from('.stage-panel:nth-child(1) .stage-panel-info > *', {
    scrollTrigger: { trigger: '.stage-panels', start: 'top 82%', once: true },
    y: 28, opacity: 0, duration: .75, stagger: .1, ease: 'power2.out', delay: .3
  });
  gsap.from('.stage-panel:nth-child(2) .stage-panel-img', {
    scrollTrigger: { trigger: '.stage-panel:nth-child(2)', start: 'top 80%', once: true },
    x: 70, opacity: 0, duration: 1.1, ease: 'power3.out'
  });
  gsap.from('.stage-panel:nth-child(2) .stage-panel-info > *', {
    scrollTrigger: { trigger: '.stage-panel:nth-child(2)', start: 'top 80%', once: true },
    y: 28, opacity: 0, duration: .75, stagger: .1, ease: 'power2.out', delay: .3
  });
  /* COMP STRIP */
  gsap.from('.comp-strip-item', {
    scrollTrigger: { trigger: '.comp-strip', start: 'top 90%', once: true },
    y: 30, opacity: 0, duration: .7, stagger: .15, ease: 'power2.out'
  });
  /* (vortex gallery gestita separatamente sotto) */

  /* PERCORSI */
  gsap.from('.percorso-card', {
    scrollTrigger: { trigger: '.percorsi-grid', start: 'top 80%', once: true },
    y: 50, opacity: 0, duration: .9, stagger: .2, ease: 'power3.out'
  });

  /* METODO */
  gsap.from('.metodo-step', {
    scrollTrigger: { trigger: '.metodo-grid', start: 'top 80%', once: true },
    y: 35, opacity: 0, duration: .7, stagger: .12, ease: 'power2.out'
  });

  /* CONTATTI */
  gsap.from('.contatti-info > *', {
    scrollTrigger: { trigger: '#contatti', start: 'top 78%', once: true },
    y: 30, opacity: 0, duration: .7, stagger: .1, ease: 'power2.out'
  });
  gsap.from('.contact-form-box', {
    scrollTrigger: { trigger: '#contatti', start: 'top 78%', once: true },
    x: 40, opacity: 0, duration: 1, ease: 'power3.out', delay: .2
  });

  /* SECTION HEADERS */
  gsap.utils.toArray('.section-header').forEach(function(el) {
    gsap.from(el.children, {
      scrollTrigger: { trigger: el, start: 'top 84%', once: true },
      y: 22, opacity: 0, duration: .75, stagger: .13, ease: 'power2.out'
    });
  });

  /* PARALLAX hero photo rispetto allo scroll */
  gsap.to('.hero-photo-wrap', {
    scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: 1.2 },
    y: 80, ease: 'none'
  });

  /* ---- COVERFLOW 3D GALLERY (CSS sticky, nessun pin GSAP) ---- */
  (function() {
    var ring  = document.getElementById('vortex-ring');
    var label = document.getElementById('vortex-label');
    if (!ring) return;

    var items = Array.from(ring.querySelectorAll('.vortex-item'));
    var N     = items.length;
    var isMob = window.innerWidth < 768;
    var spread = isMob ? 230 : 330; /* distanza orizzontale tra le card */

    function updateCoverflow(progress) {
      var floatIdx = progress * (N - 1);
      var frontIdx = 0; var minDist = 999;

      items.forEach(function(item, i) {
        var offset = i - floatIdx;
        var absOff = Math.abs(offset);

        /* posizione e profondità */
        var tx = offset * spread;
        var tz = -absOff * 85;
        var ry = -Math.min(Math.max(offset * 18, -38), 38);
        var sc = Math.max(0.6, 1 - absOff * 0.15);
        var op = Math.max(0.25, 1 - absOff * 0.27);

        gsap.set(item, {
          x: tx, z: tz, rotateY: ry, scale: sc, opacity: op,
          zIndex: Math.round(20 - absOff * 4)
        });

        if (absOff < minDist) { minDist = absOff; frontIdx = i; }
        item.classList.toggle('is-front', absOff < 0.52);
      });

      if (label && items[frontIdx]) {
        label.textContent = items[frontIdx].dataset.phrase || '';
      }
    }

    /* Init e scroll-driven */
    updateCoverflow(0);

    gsap.to({}, {
      scrollTrigger: {
        trigger: '.gallery-scroll-space',
        start:   'top top',
        end:     'bottom bottom',
        scrub:   2,
        onUpdate: function(self) { updateCoverflow(self.progress); }
      }
    });
  })();
});

/* ----- 3D TILT su card ----- */
document.querySelectorAll('.tilt-card').forEach(function(card) {
  var bounds;
  card.addEventListener('mouseenter', function() { bounds = card.getBoundingClientRect(); });
  card.addEventListener('mousemove', function(e) {
    if (!bounds) return;
    var rx = ((e.clientY - bounds.top)  / bounds.height - .5) * -8;
    var ry = ((e.clientX - bounds.left) / bounds.width  - .5) *  8;
    card.style.transform = 'perspective(900px) rotateX('+rx+'deg) rotateY('+ry+'deg) translateY(-4px)';
  });
  card.addEventListener('mouseleave', function() {
    card.style.transition = 'transform .6s cubic-bezier(.25,.46,.45,.94)';
    card.style.transform  = '';
    setTimeout(function() { card.style.transition = ''; }, 600);
  });
});

/* ----- MAGNETIC BUTTONS (stile luxury) ----- */
document.querySelectorAll('.magnetic').forEach(function(el) {
  el.addEventListener('mousemove', function(e) {
    var rect = el.getBoundingClientRect();
    var dx = (e.clientX - rect.left - rect.width  / 2) * .3;
    var dy = (e.clientY - rect.top  - rect.height / 2) * .3;
    el.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
  });
  el.addEventListener('mouseleave', function() {
    el.style.transition = 'transform .5s cubic-bezier(.25,.46,.45,.94)';
    el.style.transform  = '';
    setTimeout(function() { el.style.transition = ''; }, 500);
  });
});

/* ----- MARQUEE pausa su hover ----- */
var marqueeEl = document.getElementById('marquee-inner');
var marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack && marqueeEl) {
  marqueeTrack.addEventListener('mouseenter', function() {
    marqueeEl.style.animationPlayState = 'paused';
  });
  marqueeTrack.addEventListener('mouseleave', function() {
    marqueeEl.style.animationPlayState = 'running';
  });
}

/* ----- VIDEO CAROUSEL SPOTLIGHT (vc-wrap) ----- */
(function() {
  var wrap    = document.getElementById('vc-wrap');
  var track   = document.getElementById('vc-track');
  var prevBtn = document.getElementById('vc-prev');
  var nextBtn = document.getElementById('vc-next');
  var dotsWrap = document.getElementById('vc-dots');
  if (!track) return;

  var slides  = Array.from(track.querySelectorAll('.vc-slide'));
  var dots    = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.vc-dot')) : [];
  var N       = slides.length;
  var current = 0;
  var autoTimer;

  function slideW() { return slides[0] ? (slides[0].offsetWidth + 16) : 236; }

  function offsetForIdx(idx) {
    var wW = wrap ? wrap.offsetWidth : window.innerWidth;
    return -(idx * slideW()) + (wW / 2) - (slideW() / 2) + 8;
  }

  function goTo(idx, noAuto) {
    idx = ((idx % N) + N) % N;
    current = idx;
    track.style.transform = 'translateX(' + offsetForIdx(idx) + 'px)';
    slides.forEach(function(s, i) {
      s.classList.toggle('active', i === idx);
      var v = s.querySelector('video');
      if (v) { if (i === idx) v.play().catch(function(){}); else v.pause(); }
    });
    dots.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
    if (!noAuto) resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(function() { goTo(current + 1, true); }, 4800);
  }

  goTo(0, true);
  resetAuto();

  if (prevBtn) prevBtn.addEventListener('click', function() { goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function() { goTo(current + 1); });
  dots.forEach(function(d, i) { d.addEventListener('click', function() { goTo(i); }); });

  /* touch swipe */
  var tsX = 0;
  track.addEventListener('touchstart', function(e) { tsX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   function(e) {
    var dx = e.changedTouches[0].clientX - tsX;
    if (Math.abs(dx) > 44) goTo(dx < 0 ? current + 1 : current - 1);
  }, { passive: true });

  /* pause auto on hover */
  if (wrap) {
    wrap.addEventListener('mouseenter', function() { clearInterval(autoTimer); });
    wrap.addEventListener('mouseleave', resetAuto);
  }

  /* recalculate on resize */
  window.addEventListener('resize', function() { goTo(current, true); }, { passive: true });
})();

/* hero usa img statica, nessun video fallback necessario */

/* ----- WHATSAPP FORM ----- */
var form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var n = document.getElementById('nome').value.trim();
    var c = document.getElementById('cognome').value.trim();
    var t = document.getElementById('telefono').value.trim();
    var em = document.getElementById('email').value.trim();
    var p = document.getElementById('percorso').value;
    var o = document.getElementById('obiettivo').value.trim();

    var msg = 'Ciao Cinzia! Sono ' + n + ' ' + c + '.\n\n';
    if (p)  msg += 'Percorso: ' + p + '.\n\n';
    if (t)  msg += 'Tel: ' + t + '\n';
    if (em) msg += 'Email: ' + em + '\n';
    if (o)  msg += '\nObiettivo: ' + o;

    window.open('https://wa.me/393276956188?text=' + encodeURIComponent(msg), '_blank');
    var btn = form.querySelector('.btn-form');
    var orig = btn.textContent;
    btn.textContent = '✓ Apertura WhatsApp…';
    btn.style.background = '#097570';
    setTimeout(function() { btn.textContent = orig; btn.style.background = ''; form.reset(); }, 3000);
  });
}
