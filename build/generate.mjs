import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { icon } from './icons.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const LANGS = ['ru', 'kz', 'en'];
const PAGE_KEYS = ['home', 'rooms', 'business', 'gallery', 'contacts'];

const content = {};
for (const lang of LANGS) {
  content[lang] = JSON.parse(readFileSync(path.join(__dirname, `content.${lang}.json`), 'utf-8'));
}

function crossHref(lang, pageKey) {
  const c = content[lang];
  return `/${lang}/${c.slugs[pageKey]}`;
}

function waHref(number, text) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

function escAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

const SEGMENT_ICONS = ['family', 'briefcase', 'users', 'gift'];
const TRUST_ICONS = ['receipt', 'building', 'doc', 'shield'];
const B2B_ICONS = ['building', 'food', 'sound', 'sport', 'bed', 'transfer'];

function langSwitchAnchors(lang, pageKey) {
  return LANGS.map((l) => {
    const c = content[l];
    const current = l === lang ? 'true' : 'false';
    return `<a href="${crossHref(l, pageKey)}" data-lang-link data-lang="${l}" aria-current="${current}">${c.langNames[l]}</a>`;
  }).join('');
}

function renderHead(lang, pageKey, c) {
  const page = c.pages[pageKey];
  const alternates = LANGS.map((l) => {
    const hreflang = l === 'kz' ? 'kk' : l;
    return `<link rel="alternate" hreflang="${hreflang}" href="${crossHref(l, pageKey)}">`;
  }).join('\n  ');
  return `<meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${page.title}</title>
  <meta name="description" content="${escAttr(page.description)}">
  <link rel="canonical" href="${crossHref(lang, pageKey)}">
  ${alternates}
  <link rel="alternate" hreflang="x-default" href="${crossHref('ru', pageKey)}">
  <link rel="icon" href="/assets/img/logo.png" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="/assets/css/style.css">`;
}

function renderHeader(lang, pageKey, c) {
  const navLinks = PAGE_KEYS.map((key) => {
    const current = key === pageKey ? ' aria-current="page"' : '';
    return `<a href="/${lang}/${c.slugs[key]}"${current}>${c.nav[key]}</a>`;
  }).join('\n        ');

  return `<header class="site-header">
    <div class="container site-header__inner">
      <a href="/${lang}/${c.slugs.home}" class="brand">
        <img src="/assets/img/logo.png" alt="Tau-Turan Resort" width="38" height="38">
        <span class="brand__name">Tau-Turan<span>Resort</span></span>
      </a>
      <nav class="main-nav" aria-label="Main">
        ${navLinks}
      </nav>
      <div class="header-actions">
        <div class="lang-switch" role="group" aria-label="Language">${langSwitchAnchors(lang, pageKey)}</div>
        <div class="lang-switch-mobile" role="group" aria-label="Language">${langSwitchAnchors(lang, pageKey)}</div>
        <button type="button" class="burger" data-burger aria-expanded="false" aria-label="Menu" aria-controls="mobile-nav">
          <span></span>
        </button>
      </div>
    </div>
  </header>`;
}

function renderMobileNav(lang, pageKey, c) {
  const navLinks = PAGE_KEYS.map((key) => {
    const current = key === pageKey ? ' aria-current="page"' : '';
    return `<a href="/${lang}/${c.slugs[key]}"${current}>${c.nav[key]}</a>`;
  }).join('\n      ');
  return `<div class="mobile-nav" id="mobile-nav" data-mobile-nav data-open="false">
    <div class="mobile-nav__scrim" data-mobile-scrim></div>
    <div class="mobile-nav__panel" role="dialog" aria-modal="true" aria-label="Menu">
      <div class="mobile-nav__top">
        <div class="lang-switch-mobile" role="group" aria-label="Language">${langSwitchAnchors(lang, pageKey)}</div>
        <button type="button" class="mobile-nav__close" data-mobile-close aria-label="Close menu"></button>
      </div>
      <nav class="mobile-nav__links" aria-label="Mobile">
      ${navLinks}
      </nav>
      <div class="mobile-nav__foot">
        <a class="btn btn-primary btn-block" href="${waHref(c.whatsapp.booking, c.waFab.label)}" target="_blank" rel="noopener">${icon('whatsapp', {size: 18})} ${c.waFab.label}</a>
      </div>
    </div>
  </div>`;
}

function renderFooter(lang, pageKey, c) {
  const navLinks = PAGE_KEYS.map((key) => `<a href="/${lang}/${c.slugs[key]}">${c.nav[key]}</a>`).join('\n          ');
  return `<footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">
            <img src="/assets/img/logo.png" alt="Tau-Turan Resort" width="34" height="34">
            <span>Tau-Turan Resort</span>
          </div>
          <p style="max-width:34ch">${c.footer.about}</p>
          <div class="footer-lang">${langSwitchAnchors(lang, pageKey)}</div>
        </div>
        <div class="footer-col">
          <h5>${c.footer.navTitle}</h5>
          ${navLinks}
        </div>
        <div class="footer-col">
          <h5>${c.footer.contactsTitle}</h5>
          <a href="${waHref(c.whatsapp.booking, c.waFab.label)}" target="_blank" rel="noopener">WhatsApp: ${c.whatsapp.bookingDisplay}</a>
          <a href="mailto:${c.email}">${c.email}</a>
          <p>${c.footer.address}</p>
          <p>${c.footer.hours}</p>
          <a href="${c.instagram.main}" target="_blank" rel="noopener">Instagram →</a>
        </div>
        <div class="footer-col">
          <h5>${c.footer.campTitle}</h5>
          <p>${c.footer.campText}</p>
          <a href="${c.campSite}" target="_blank" rel="noopener">${c.footer.campLink}</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} Tau-Turan Resort. ${c.footer.rights}</span>
        <span>${c.tagline}</span>
      </div>
    </div>
  </footer>`;
}

function renderWaFab(c) {
  return `<a class="wa-fab" href="${waHref(c.whatsapp.general, c.waFab.label)}" target="_blank" rel="noopener" aria-label="${escAttr(c.waFab.label)}">
    ${icon('whatsapp', {size: 26})}
    <span class="wa-fab__label">${c.waFab.label}</span>
  </a>`;
}

function scripts() {
  return `<script src="/assets/js/main.js" defer></script>
  <script src="/assets/js/carousel.js" defer></script>
  <script src="/assets/js/calculator.js" defer></script>
  <script src="/assets/js/forms.js" defer></script>
  <script src="/assets/js/gallery-filter.js" defer></script>
  <script src="/assets/js/i18n.js" defer></script>`;
}

function carousel(id, slidesHtml, opts = {}) {
  const autoplay = opts.autoplay === false ? ' data-autoplay="false"' : '';
  const interval = opts.interval ? ` data-interval="${opts.interval}"` : '';
  const navInside = opts.navInside ? ' carousel--nav-inside' : '';
  return `<div class="carousel${navInside}" data-carousel${autoplay}${interval} id="${id}">
    <div class="carousel__viewport" data-viewport>
      <div class="carousel__track" data-track>
        ${slidesHtml}
      </div>
    </div>
    <button class="carousel__arrow carousel__arrow--prev" data-prev aria-label="Previous">${icon('arrowLeft', {size: 20})}</button>
    <button class="carousel__arrow carousel__arrow--next" data-next aria-label="Next">${icon('arrowRight', {size: 20})}</button>
  </div>`;
}

function blockCta(text, label, href, waNumber) {
  const isWa = !!waNumber;
  const linkHref = isWa ? waHref(waNumber, label) : href;
  const target = isWa ? ' target="_blank" rel="noopener"' : '';
  return `<div class="block-cta reveal">
    <div class="block-cta__text"><strong>${text.title}</strong>${text.body ? `<span>${text.body}</span>` : ''}</div>
    <a class="btn btn-primary" href="${linkHref}"${target}>${label}</a>
  </div>`;
}

// ---------- HOME ----------
function renderHome(lang, c) {
  const p = c.pages.home;
  const segments = p.segments.items.map((s, i) => `
        <div class="segment-card reveal">
          <div class="segment-card__icon">${icon(SEGMENT_ICONS[i])}</div>
          <h3>${s.title}</h3>
          <p>${s.text}</p>
          <a href="/${lang}/${s.href}">${s.label}</a>
        </div>`).join('');

  const typeOptions = p.calculator.types.map((t) => `<option value="${t.value}" data-high="${t.high}" data-low="${t.low}">${t.label}</option>`).join('');
  const seasonOptions = p.calculator.seasons.map((s) => `<option value="${s.value}">${s.label}</option>`).join('');

  const trustItems = p.trust.items.map((t, i) => `
        <div class="trust-item reveal">
          <div class="trust-item__icon">${icon(TRUST_ICONS[i], {size: 18})}</div>
          <div><h4>${t.title}</h4><p>${t.text}</p></div>
        </div>`).join('');

  const galleryImgs = ['placeholder-01.jpg','placeholder-03.jpg','placeholder-05.jpg','placeholder-07.jpg','placeholder-09.jpg','placeholder-02.jpg'];
  const galleryTeaser = galleryImgs.map((img) => `
        <div class="carousel__slide">
          <div class="gallery-slide"><img src="/assets/img/${img}" alt="Tau-Turan" loading="lazy" width="300" height="375"></div>
        </div>`).join('');

  const testiTeaser = p.testimonialsTeaser.items.map((t) => `
        <div class="carousel__slide">
          <div class="testi-slide">
            <p>“${t.text}”</p>
            <div class="testi-slide__who">
              <div class="testi-slide__avatar">${t.name.charAt(0)}</div>
              <div><strong>${t.name}</strong><span>${t.role}</span></div>
            </div>
          </div>
        </div>`).join('');

  return `<section class="hero">
    <div class="container hero__grid">
      <div>
        <p class="eyebrow hero__eyebrow">${p.hero.eyebrow}</p>
        <h1>${p.hero.h1}</h1>
        <p class="lead">${p.hero.lead}</p>
        <div class="cta-row">
          <a class="btn btn-primary" href="/${lang}/${c.slugs.contacts}">${p.hero.ctaPrimary.label}</a>
          <a class="btn btn-ghost" href="${p.hero.ctaSecondary.href}">${p.hero.ctaSecondary.label}</a>
        </div>
      </div>
      <div class="hero__video-card">
        <video src="/assets/video/hero-welcome-ru.mp4" poster="/assets/img/hero-welcome-poster.jpg" muted loop playsinline autoplay preload="metadata"></video>
        <div class="hero__video-card__tag"><span class="pulse-dot"></span><span>${p.hero.videoTag}</span></div>
      </div>
    </div>
  </section>

  <section class="section" id="segments">
    <div class="container">
      <div class="head-row reveal">
        <div><p class="eyebrow">${p.segments.subtitle}</p><h2>${p.segments.title}</h2></div>
      </div>
      <div class="segment-grid">${segments}</div>
    </div>
  </section>

  <section class="section section--stone" id="calculator">
    <div class="container">
      <div class="head-row reveal">
        <div><p class="eyebrow">${p.calculator.eyebrow}</p><h2>${p.calculator.title}</h2><p>${p.calculator.subtitle}</p></div>
      </div>
      <div class="calc reveal" data-calculator data-wa-number="${c.whatsapp.booking}" data-msg-intro="${escAttr(p.calculator.msgIntro)}" data-msg-total="${escAttr(p.calculator.msgTotal)}">
        <div class="calc__grid">
          <div class="field">
            <label>${p.calculator.typeLabel}</label>
            <select data-field="type">${typeOptions}</select>
          </div>
          <div class="field">
            <label>${p.calculator.seasonLabel}</label>
            <select data-field="season">${seasonOptions}</select>
          </div>
          <div class="field">
            <label>${p.calculator.nightsLabel}</label>
            <input type="number" min="1" value="2" data-field="nights">
          </div>
          <div class="field">
            <label>${p.calculator.guestsLabel}</label>
            <input type="number" min="1" value="2" data-field="guests">
          </div>
        </div>
        <div class="calc__result">
          <div>
            <div class="mono calc__result-price" data-result-price>0 ₸</div>
            <div class="calc__result-note">${p.calculator.resultLabel}. ${p.calculator.resultNote}</div>
          </div>
          <a class="btn btn-primary" data-wa-send href="#" target="_blank" rel="noopener">${icon('whatsapp',{size:18})} ${p.calculator.waButton}</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="head-row reveal"><div><h2>${p.trust.title}</h2></div></div>
      <div class="trust-grid">${trustItems}</div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="container">
      <div class="head-row reveal">
        <div><h2>${p.galleryTeaser.title}</h2><p>${p.galleryTeaser.subtitle}</p></div>
        <a class="btn btn-outline btn-sm" href="/${lang}/${c.slugs.gallery}">${p.galleryTeaser.more}</a>
      </div>
      ${carousel('home-gallery-teaser', galleryTeaser)}
    </div>
  </section>

  <section class="section section--tight section--stone">
    <div class="container">
      <div class="head-row reveal">
        <div><h2>${p.testimonialsTeaser.title}</h2><p>${p.testimonialsTeaser.subtitle}</p></div>
        <a class="btn btn-outline btn-sm" href="/${lang}/${c.slugs.gallery}#testimonials">${p.testimonialsTeaser.more}</a>
      </div>
      ${carousel('home-testi-teaser', testiTeaser)}
    </div>
  </section>

  <section class="section section--alpine">
    <div class="container" style="text-align:center">
      <h2 class="reveal">${p.finalCta.title}</h2>
      <p class="reveal" style="max-width:50ch;margin-inline:auto">${p.finalCta.text}</p>
      <div class="reveal" style="margin-top:20px"><a class="btn btn-primary" href="/${lang}/${c.slugs.contacts}">${p.finalCta.ctaLabel}</a></div>
    </div>
  </section>`;
}

// ---------- ROOMS ----------
function renderRooms(lang, c) {
  const p = c.pages.rooms;
  const roomCards = p.rooms.items.map((r) => `
        <div class="room-card reveal">
          <div class="room-card__media"><img src="/assets/img/${r.img}" alt="${escAttr(r.name)}" loading="lazy" width="400" height="300"></div>
          <div class="room-card__body">
            <h3>${r.name}</h3>
            <div class="room-card__meta"><span>${r.capacity}</span></div>
            <p>${r.desc}</p>
            <div class="room-card__price"><span class="mono">${r.priceFrom} ₸</span><small>/ ${p.rates.subtitle.split(',')[0].toLowerCase()}</small></div>
          </div>
        </div>`).join('');

  const rateRows = p.rates.rows.map((row) => `
          <tr>${row.map((cell, i) => `<td${i > 0 ? ' class="mono"' : ''}>${cell}${i>0?' ₸':''}</td>`).join('')}</tr>`).join('');
  const rateHeaders = p.rates.headers.map((h) => `<th>${h}</th>`).join('');

  const infraItems = p.infra.items.map((it) => `
        <div class="infra-item reveal">
          <div class="infra-item__icon">${icon(it.icon, {size:22})}</div>
          <h4>${it.title}</h4>
        </div>`).join('');

  return `<section class="hero" style="padding-bottom:56px">
    <div class="container">
      <p class="eyebrow hero__eyebrow reveal">${p.hero.eyebrow}</p>
      <h1 class="reveal">${p.hero.h1}</h1>
      <p class="lead reveal">${p.hero.lead}</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="head-row reveal"><h2>${p.rooms.title}</h2></div>
      <div class="room-grid">${roomCards}</div>
    </div>
  </section>

  <section class="section section--stone">
    <div class="container">
      <div class="head-row reveal"><div><h2>${p.rates.title}</h2><p>${p.rates.subtitle}</p></div></div>
      <div class="table-wrap reveal">
        <table class="rates">
          <thead><tr>${rateHeaders}</tr></thead>
          <tbody>${rateRows}</tbody>
        </table>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="head-row reveal"><h2>${p.infra.title}</h2></div>
      <div class="infra-grid">${infraItems}</div>
      ${blockCta({title: p.cta.title, body: p.cta.text}, p.cta.label, null, c.whatsapp.booking)}
    </div>
  </section>`;
}

// ---------- BUSINESS ----------
function renderBusiness(lang, c) {
  const p = c.pages.business;
  const caps = p.capabilities.items.map((it, i) => `
        <div class="b2b-item reveal">
          <h4>${icon(B2B_ICONS[i], {size:20})} ${it.title}</h4>
          <p>${it.text}</p>
        </div>`).join('');

  const trustItems = p.b2bTrust.items.map((t, i) => `
        <div class="trust-item reveal">
          <div class="trust-item__icon">${icon(TRUST_ICONS[i], {size:18})}</div>
          <div><h4>${t.title}</h4><p>${t.text}</p></div>
        </div>`).join('');

  const formatOptions = ['Семинар', 'Тимбилдинг', 'Конференция', 'Корпоратив'].map((f) => `<option>${f}</option>`).join('');

  return `<section class="hero" style="padding-bottom:56px">
    <div class="container">
      <p class="eyebrow hero__eyebrow reveal">${p.hero.eyebrow}</p>
      <h1 class="reveal">${p.hero.h1}</h1>
      <p class="lead reveal">${p.hero.lead}</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="head-row reveal"><h2>${p.capabilities.title}</h2></div>
      <div class="b2b-grid">${caps}</div>
    </div>
  </section>

  <section class="section section--fir">
    <div class="container">
      <div class="pdf-card reveal">
        <div class="pdf-card__icon">${icon('doc', {size:28})}</div>
        <div class="pdf-card__text"><strong>${p.pdf.title}</strong><span>${p.pdf.text}</span></div>
        <a class="btn btn-primary" href="/assets/${p.pdf.href.replace(/^assets\//,'')}" download>${p.pdf.button}</a>
      </div>
    </div>
  </section>

  <section class="section section--stone">
    <div class="container">
      <div class="head-row reveal"><h2>${p.b2bTrust.title}</h2></div>
      <div class="trust-grid">${trustItems}</div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="head-row reveal"><div><h2>${p.form.title}</h2><p>${p.form.subtitle}</p></div></div>
      <div class="form-card reveal">
        <form data-wa-form data-wa-number="${c.whatsapp.business}" data-wa-title="${escAttr(p.form.waTitle)}">
          <div class="form-grid">
            <div class="field"><label>${p.form.company}</label><input type="text" data-field required></div>
            <div class="field"><label>${p.form.contactPerson}</label><input type="text" data-field required></div>
            <div class="field"><label>${p.form.phone}</label><input type="tel" data-field required></div>
            <div class="field"><label>${p.form.guests}</label><input type="number" min="1" data-field></div>
            <div class="field field--full"><label>${p.form.format}</label><select data-field>${formatOptions}</select></div>
            <div class="field field--full"><label>${p.form.comment}</label><textarea data-field></textarea></div>
          </div>
          <div style="margin-top:20px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
            <button type="submit" class="btn btn-primary">${icon('whatsapp',{size:18})} ${p.form.submit}</button>
            <span data-form-success hidden style="font-size:.85rem;color:var(--fir);font-weight:600">${icon('check',{size:16})} ${p.form.success}</span>
          </div>
        </form>
      </div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="container">
      ${blockCta({title: p.cta.title, body: p.cta.text}, p.cta.label, null, c.whatsapp.business)}
    </div>
  </section>`;
}

// ---------- GALLERY ----------
function galleryImagesFor(cat) {
  const map = {
    winter: ['placeholder-01.jpg','placeholder-04.jpg','placeholder-08.jpg'],
    summer: ['placeholder-02.jpg','placeholder-06.jpg','placeholder-09.jpg'],
    rooms: ['placeholder-07.jpg','placeholder-01.jpg','placeholder-02.jpg'],
    activities: ['placeholder-03.jpg','placeholder-05.jpg','placeholder-10.jpg'],
  };
  return map[cat];
}

function renderGallery(lang, c) {
  const p = c.pages.gallery;
  const filterKeys = ['winter', 'summer', 'rooms', 'activities'];
  const tabs = filterKeys.map((k, i) => `<button type="button" data-filter="${k}" aria-pressed="${i === 0}">${p.filters[k]}</button>`).join('');
  const panels = filterKeys.map((k, i) => {
    const imgs = galleryImagesFor(k).map((img) => `
          <div class="carousel__slide"><div class="gallery-slide"><img src="/assets/img/${img}" alt="${escAttr(p.filters[k])}" loading="lazy" width="300" height="375"><span class="gallery-slide__tag">${p.filters[k]}</span></div></div>`).join('');
    return `<div data-filter-panel="${k}" data-filter-group="gallery-filter" ${i === 0 ? '' : 'hidden'}>
        ${carousel('gallery-' + k, imgs)}
      </div>`;
  }).join('');

  const t = p.testimonials;
  const tabButtons = ['video', 'written', 'audio', 'geo'].map((k, i) => `<button type="button" data-filter="${k}" aria-pressed="${i === 0}">${t.tabs[k]}</button>`).join('');

  const videoSlides = t.video.map((v) => `
        <div class="carousel__slide">
          <div class="testi-slide--video" data-video-testi data-video-src="/assets/video/hero-welcome-ru.mp4">
            <img src="/assets/img/${v.poster}" alt="${escAttr(v.name)}" loading="lazy" width="200" height="356">
            <span class="testi-slide--video__play" data-play>${icon('play', {size: 20})}</span>
            <span class="testi-slide--video__meta"><strong>${v.name}</strong><span>${v.role}</span></span>
          </div>
        </div>`).join('');

  const writtenSlides = t.written.map((w) => `
        <div class="carousel__slide">
          <div class="testi-slide">
            <p>“${w.text}”</p>
            <div class="testi-slide__who">
              <div class="testi-slide__avatar">${w.name.charAt(0)}</div>
              <div><strong>${w.name}</strong><span>${w.role}</span></div>
            </div>
          </div>
        </div>`).join('');

  const audioSlides = t.audio.map((a) => `
        <div class="carousel__slide">
          <div class="testi-slide testi-slide--audio">
            <div class="testi-slide__who">
              <div class="testi-slide__avatar">${a.name.charAt(0)}</div>
              <div><strong>${a.name}</strong><span>${a.role} · ${a.date}</span></div>
            </div>
            <div class="audio-player" data-audio-player>
              <audio src="/${a.src}" preload="metadata"></audio>
              <button type="button" data-audio-toggle aria-label="Play/Pause">
                <span data-icon-play>${icon('play', {size: 14})}</span>
                <span data-icon-pause style="display:none">${icon('pause', {size: 14})}</span>
              </button>
              <div class="audio-player__bar" data-audio-bar><div class="audio-player__bar-fill" data-audio-fill></div></div>
              <span class="audio-player__time" data-audio-time>0:00</span>
            </div>
          </div>
        </div>`).join('');

  const geoSlides = t.geo.map((g) => `
        <div class="carousel__slide">
          <div class="testi-slide testi-slide--map">
            <div class="stars" aria-label="${g.rating}/5">${'★'.repeat(g.rating)}${'☆'.repeat(5 - g.rating)}</div>
            <p>“${g.text}”</p>
            <a class="btn btn-outline btn-sm" href="${g.href}" target="_blank" rel="noopener">2GIS →</a>
          </div>
        </div>`).join('');

  return `<section class="hero" style="padding-bottom:56px">
    <div class="container">
      <p class="eyebrow hero__eyebrow reveal">${p.hero.eyebrow}</p>
      <h1 class="reveal">${p.hero.h1}</h1>
      <p class="lead reveal">${p.hero.lead}</p>
    </div>
  </section>

  <section class="section section--tight">
    <div class="container">
      <div class="filter-tabs reveal" data-filter-tabs="gallery-filter">${tabs}</div>
      ${panels}
      <div class="reveal" style="margin-top:28px;text-align:center">
        <a class="btn btn-outline" href="${p.instagramCta.href}" target="_blank" rel="noopener">${icon('instagram',{size:18})} ${p.instagramCta.label}</a>
      </div>
    </div>
  </section>

  <section class="section section--stone" id="testimonials">
    <div class="container">
      <div class="head-row reveal"><div><h2>${t.title}</h2><p>${t.subtitle}</p></div></div>

      <div class="filter-tabs reveal" data-filter-tabs="testi-filter">${tabButtons}</div>

      <div data-filter-panel="video" data-filter-group="testi-filter">
        ${carousel('testi-video', videoSlides)}
      </div>
      <div data-filter-panel="written" data-filter-group="testi-filter" hidden>
        ${carousel('testi-written', writtenSlides)}
      </div>
      <div data-filter-panel="audio" data-filter-group="testi-filter" hidden>
        ${carousel('testi-audio', audioSlides, {autoplay: false})}
      </div>
      <div data-filter-panel="geo" data-filter-group="testi-filter" hidden>
        ${carousel('testi-geo', geoSlides)}
      </div>
    </div>
  </section>

  <section class="section section--alpine">
    <div class="container" style="text-align:center">
      <h2 class="reveal">${p.cta.title}</h2>
      <p class="reveal">${p.cta.text}</p>
      <div class="reveal" style="margin-top:16px"><a class="btn btn-primary" href="/${lang}/${c.slugs.contacts}">${p.cta.label}</a></div>
    </div>
  </section>`;
}

// ---------- CONTACTS ----------
function renderContacts(lang, c) {
  const p = c.pages.contacts;
  const cardIcons = ['phone', 'briefcase', 'mail', 'clock'];
  const cards = p.contactCards.map((card, i) => {
    let waLine = '';
    if (card.waKey) {
      const display = c.whatsapp[card.waKey + 'Display'];
      const number = c.whatsapp[card.waKey];
      waLine = `<a class="wa-link" href="${waHref(number, c.waFab.label)}" target="_blank" rel="noopener">${icon('whatsapp',{size:16})} ${display}</a>`;
    }
    return `<div class="contact-card reveal">
          <div class="contact-card__icon">${icon(cardIcons[i], {size:20})}</div>
          <div><h4>${card.title}</h4><p>${card.text}</p>${waLine}</div>
        </div>`;
  }).join('');

  const formatOptions = p.form.formats.map((f) => `<option>${f}</option>`).join('');
  const mapQuery = encodeURIComponent('Tau-Turan, Besagash, Talgar district, Almaty region');

  return `<section class="hero" style="padding-bottom:56px">
    <div class="container">
      <p class="eyebrow hero__eyebrow reveal">${p.hero.eyebrow}</p>
      <h1 class="reveal">${p.hero.h1}</h1>
      <p class="lead reveal">${p.hero.lead}</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="contact-grid">
        <div>
          <div class="trust-grid" style="grid-template-columns:1fr">${cards}</div>
        </div>
        <div>
          <h3 class="reveal">${p.map.title}</h3>
          <p class="reveal">${p.map.text}</p>
          <div class="map-frame reveal">
            <iframe src="https://www.google.com/maps?q=${mapQuery}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Map"></iframe>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--stone">
    <div class="container">
      <div class="head-row reveal"><div><h2>${p.form.title}</h2><p>${p.form.subtitle}</p></div></div>
      <div class="form-card reveal">
        <form data-wa-form data-wa-number="${c.whatsapp.booking}" data-wa-title="${escAttr(p.form.waTitle)}">
          <div class="form-grid">
            <div class="field"><label>${p.form.name}</label><input type="text" data-field required></div>
            <div class="field"><label>${p.form.phone}</label><input type="tel" data-field required></div>
            <div class="field"><label>${p.form.date}</label><input type="date" data-field></div>
            <div class="field"><label>${p.form.format}</label><select data-field>${formatOptions}</select></div>
            <div class="field field--full"><label>${p.form.guests}</label><input type="number" min="1" data-field></div>
            <div class="field field--full"><label>${p.form.comment}</label><textarea data-field></textarea></div>
          </div>
          <div style="margin-top:20px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
            <button type="submit" class="btn btn-primary">${icon('whatsapp',{size:18})} ${p.form.submit}</button>
            <span data-form-success hidden style="font-size:.85rem;color:var(--fir);font-weight:600">${icon('check',{size:16})} ${p.form.success}</span>
          </div>
        </form>
      </div>
      <p class="form-note reveal">${p.legal.title}: ${p.legal.text}</p>
    </div>
  </section>`;
}

const RENDERERS = {
  home: renderHome,
  rooms: renderRooms,
  business: renderBusiness,
  gallery: renderGallery,
  contacts: renderContacts,
};

function assemble(lang, pageKey) {
  const c = content[lang];
  const body = RENDERERS[pageKey](lang, c);
  const htmlLang = c.htmlLang;
  return `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
${renderHead(lang, pageKey, c)}
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${renderHeader(lang, pageKey, c)}
  ${renderMobileNav(lang, pageKey, c)}
  <main id="main" data-page-root>
  ${body}
  </main>
  ${renderFooter(lang, pageKey, c)}
  ${renderWaFab(c)}
  ${scripts()}
</body>
</html>`;
}

for (const lang of LANGS) {
  const outDir = path.join(DIST, lang);
  mkdirSync(outDir, { recursive: true });
  for (const pageKey of PAGE_KEYS) {
    const html = assemble(lang, pageKey);
    const slug = content[lang].slugs[pageKey];
    writeFileSync(path.join(outDir, slug), html, 'utf-8');
    console.log(`wrote ${lang}/${slug}`);
  }
}

// root redirect to default language
mkdirSync(DIST, { recursive: true });
writeFileSync(path.join(DIST, 'index.html'), `<!DOCTYPE html>
<html lang="ru"><head><meta charset="UTF-8"><meta http-equiv="refresh" content="0; url=/ru/index.html">
<title>Tau-Turan Resort</title></head>
<body><p>Redirecting to <a href="/ru/index.html">/ru/index.html</a>...</p></body></html>`, 'utf-8');
console.log('wrote root redirect index.html');
