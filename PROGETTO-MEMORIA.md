# Progetto: Cinzia Rosato Coaching Website — Memoria Completa

**File:** `C:\Users\39389\cinzia-coaching\index.html` + `css\style.css` + `js\script.js`  
**Data ultima modifica:** 2026-09-18  
**URL locale:** apri `index.html` direttamente nel browser, oppure con un live server.

---

## Identità del progetto

- **Cliente:** Cinzia Rosato, 36 anni, Lecce
- **Ruolo:** Personal Trainer certificata + Atleta IFBB Bikini Fitness
- **Risultati agonistici:** IFBB Pugliesi 2025 (1° Posto), Panatta Rimini Contest (2° Posto)
- **Contatto WhatsApp:** +39 327 695 6188
- **Instagram:** @rosatocinzia
- **Tagline sito:** "Scegliti. Costruisciti. Risplendi."

---

## Stack tecnico

| Libreria | Versione | CDN |
|---|---|---|
| Three.js | 0.128.0 | jsdelivr |
| Lenis smooth scroll | 1.0.42 | jsdelivr |
| GSAP | 3.12.5 | cdnjs |
| ScrollTrigger (plugin GSAP) | 3.12.5 | cdnjs |
| Google Fonts | Oswald, Inter, Cormorant Garamond | fonts.googleapis.com |

**Palette colori:**
- `--teal: #0FB8B0` — accent principale
- `--teal-dark: #097570`
- `--gold: #D4A640` — medaglie
- `--bg: #050D11` — background scuro
- `--text: #E2F2F0`

---

## Struttura sezioni HTML

```
1. #preloader       — intro screen con foto sfondo + logo + tagline + barra
2. nav#navbar       — sticky, hamburger mobile
3. section#home     — HERO: WebGL gradient + particles + foto hero-stage.jpg
4. section#chi-sono — Chi sono: reel strip 6 video verticali + testo + qualifiche
5. section#risultati — PALMARES: 2 stage panels cinematic + comp-strip foto
6. section#percorsi — 2 percorsi (Neofila / Trasformazione)
7. section#metodo   — 4 step metodo
8. #gallery         — VORTEX 3D: gallery-scroll-space (sticky scroll-driven)
9. section#contatti — form WhatsApp + info contatti
10. footer          — link rapidi
11. .wa-float       — bottone WhatsApp fisso
```

---

## Struttura sezioni HTML (aggiornata)

```
1. #preloader       — intro screen hero-stage.jpg + logo + tagline
2. nav#navbar       — sticky, hamburger mobile, logo CR SVG fallback
3. section#home     — HERO: WebGL gradient + particles + hero-stage.jpg (NO video)
4. section#chi-sono — Chi sono: foto portrait photo-6.jpg + testo
5. section#video-reel — VIDEO CAROUSEL spotlight: 6 video con prev/next/dots/autoplay
6. section#risultati — CREDENZIALI AGONISTICHE: foto + award list compact (NON egocentric)
7. section#percorsi — 2 percorsi (Neofila / Trasformazione)
8. section#metodo   — 4 step metodo
9. #gallery         — COVERFLOW 3D: scroll-driven con card centrale in risalto
10. section#contatti — form WhatsApp + info contatti
11. footer          — link rapidi, SVG logo aggiornato
```

## File immagini in `img/`

| File | Contenuto |
|---|---|
| `hero-stage.jpg` | ← foto PREFERITA di Cinzia. Back-pose sul palco Rimini. Usata in HERO + preloader |
| `hero-bg.jpg` | Background generico palestra (usato in body CSS su desktop) |
| `hero-cover.jpg` | Versione mobile del background |
| `photo-8.jpg` | IFBB Pugliesi 2025 — frontale con medaglia (1° posto) → Panel 1 palmares |
| `photo-9.jpg` | Panatta Rimini — posa laterale sul palco → comp-strip |
| `photo-10.jpg` | Rimini outdoor con targa/medaglia (foto 2° posto) → Panel 2 palmares |
| `photo-11.jpg` | Rimini — close-up trofeo → comp-strip |
| `gallery-1.jpg` → `gallery-5.jpg` | Foto lifestyle palestra — usate nel vortex gallery |
| `video-new-1.mp4` → `video-new-6.mp4` | Tutti i video WhatsApp da foto_cinzia — reel strip verticale |
| `logo.jpg` | **NON ESISTE ANCORA** — deve essere salvato dall'utente (logo con sfondo nero) |
| `video-hero.mp4` | Video hero (opzionale, se non trovato mostra hero-stage.jpg) |

> **IMPORTANTE:** `logo.jpg` non è ancora presente. Il codice gestisce l'assenza con `onerror` → mostra SVG fallback (monogramma CR con bilanciere in Cormorant Garamond).

---

## Logica scroll (critica — non toccare)

**Lenis config corretta (script.js):**
```javascript
lenis = new Lenis({
  duration: 0.9,
  easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
  smoothWheel: true,
  wheelMultiplier: 0.95,
  smoothTouch: false,     // mobile usa scroll nativo
  touchMultiplier: 1.8
});
function _lenisRaf(time) { lenis.raf(time); requestAnimationFrame(_lenisRaf); }
requestAnimationFrame(_lenisRaf);
lenis.on('scroll', function() { ScrollTrigger.update(); });
```

**Regola fondamentale:** NON usare `gsap.ticker.add` con Lenis — rompe lo scroll su PC.
Usare SEMPRE `requestAnimationFrame(_lenisRaf)`.

**CSS critico:** `html { scroll-behavior: auto; }` — NON mettere `smooth` (conflitto con Lenis).

---

## Vortex Gallery (logica CSS sticky)

**Perché CSS sticky e non GSAP pin:**
- GSAP `pin: true` in ScrollTrigger conflitto con Lenis → la gallery non scorreva
- Soluzione: `position: sticky` su `.gallery-sticky-wrap`, GSAP anima solo la rotazione

```html
<div class="gallery-scroll-space" id="gallery">   <!-- 340vh, crea spazio scroll -->
  <section class="gallery-sticky-wrap">           <!-- sticky top:0, height:100vh -->
    <div class="vortex-stage">
      <div class="vortex-ring" id="vortex-ring">  <!-- rotateY animato da GSAP -->
        <!-- 7 .vortex-item con data-phrase -->
      </div>
      <div class="vortex-label" id="vortex-label">DISCIPLINA</div>
    </div>
  </section>
</div>
```

**Frasi vortex:** DISCIPLINA, COSTANZA, TRASFORMAZIONE, FORZA, METODO, ECCELLENZA, RISPLENDI

---

## Preloader

Sequenza animazione (GSAP timeline):
1. Logo appare (scale da 0.88 a 1, opacity 0→1)
2. Parole "Scegliti. Costruisciti. Risplendi." entrano a stagger
3. Barra di caricamento si riempie (1.6s)
4. Tendina teal sale dal basso
5. Tutto vola in alto e preloader sparisce

Sfondo preloader: `img/hero-stage.jpg` con zoom lento (`preBgZoom` animation)

---

## Palmares — Stage Panels

- **Panel 1 (sinistra):** `photo-8.jpg` — IFBB Pugliesi 2025, 1° Posto (badge gold)
- **Panel 2 (destra, reverse):** `photo-10.jpg` — Panatta Rimini Contest, 2° Posto (badge silver)
- **Comp strip sotto:** photo-9, photo-10, photo-11

---

## Reel Strip (Chi Sono)

6 video verticali 9:16 affiancati, scorrevoli con touch/scroll orizzontale.
Dimensioni: desktop 200×355px, mobile 160×284px, xs 140×249px.
I video partono in autoplay con `muted loop playsinline`.
IntersectionObserver gestisce play/pause quando entrano/escono dalla viewport.

---

## Form contatti

Invia via WhatsApp `wa.me/393276956188` con il messaggio formattato:
- Nome, Cognome, Percorso scelto, Telefono, Email (facoltativa), Obiettivo

---

## Effetti visivi attivi

| Effetto | Tecnologia | Note |
|---|---|---|
| Gradient animato hero | Three.js WebGL fragment shader | teal/dark noise |
| Particelle flottanti | Canvas 2D | 80 desktop / 35 mobile |
| Grain film overlay | CSS SVG fractalNoise + `grainShift` | opacity 0.038 |
| Character split hero | GSAP stagger + rotateX | `.reveal-word` → `.char` |
| Custom cursor | CSS + requestAnimationFrame | nascosto su mobile |
| Velocity skew | GSAP + Lenis scroll velocity | solo su `h1[data-skew]` |
| Magnetic buttons | CSS transform mousemove | `.magnetic` class |
| 3D tilt cards | CSS perspective + mousemove | `.tilt-card` class |
| Clip-path reveal | GSAP + ScrollTrigger | `.reveal-clip` |
| Parallax hero photo | GSAP scrub y:80 | scroll trigger |
| Preloader curtain | GSAP timeline | tendina teal |
| Vortex 3D carousel | GSAP rotateY scrub + CSS sticky | NO pin GSAP |

---

## Problemi risolti nella sessione

1. **Scroll bloccato su PC** → rimosso `gsap.ticker.add`, usato RAF diretto + rimosso `html { scroll-behavior: smooth }`
2. **Gallery non funzionava** → rimosso `pin: true`, usato CSS sticky
3. **Testo vortex solo outline** → cambiato da `color: transparent; -webkit-text-stroke` a `color: var(--teal); opacity: .22`
4. **Video reel tagliati** → sostituito singolo video landscape con reel-strip 9:16
5. **Logo non visibile** → `mix-blend-mode: screen` su `.logo-img` + SVG fallback con Cormorant Garamond
6. **Foto gallery duplicate** → usate solo `gallery-1` → `gallery-5` + `hero-bg` + `hero-cover` per 7 uniche

---

## File da creare/salvare manualmente

- `C:\Users\39389\cinzia-coaching\img\logo.jpg` — logo CR con sfondo NERO (mix-blend-mode:screen lo renderà trasparente)

---

## Logo — istruzioni per inserirlo

Il file `img/logo.jpg` NON esiste ancora sul filesystem.
- Salva il logo con **sfondo NERO** (terza immagine inviata in chat) come `C:\Users\39389\cinzia-coaching\img\logo.jpg`
- Il CSS usa `mix-blend-mode: screen` → lo sfondo nero diventa trasparente, il rosa gold rimane visibile
- Il filtro CSS ora è solo `brightness(1.1) saturate(1.05)` — il rosa gold non viene alterato (rimosso hue-rotate che lo distorceva a teal)
- Se logo.jpg non è presente, compare l'SVG fallback con monogramma CR + bilanciere

## Prossimi miglioramenti possibili

- CSS Scroll-driven animations native (`animation-timeline: scroll()`)
- View Transitions API per navigazione fluida
- WebP conversion per le foto (performance)
- Lazy loading più aggressivo per i video
