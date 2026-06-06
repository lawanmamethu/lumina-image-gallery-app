'use strict';

const GALLERY = [
  {
    id      : 1,
    src     : 'https://picsum.photos/seed/forest1/1200/900',
    thumb   : 'https://picsum.photos/seed/forest1/600/450',
    title   : 'Forest Dawn',
    subtitle: 'Morning light through ancient trees',
    category: 'nature',
  },
  {
    id      : 2,
    src     : 'https://picsum.photos/seed/bridge88/1200/900',
    thumb   : 'https://picsum.photos/seed/bridge88/600/450',
    title   : 'Span & Steel',
    subtitle: 'Engineering as poetry',
    category: 'architecture',
  },
  {
    id      : 3,
    src     : 'https://picsum.photos/seed/ocean22/1200/900',
    thumb   : 'https://picsum.photos/seed/ocean22/600/450',
    title   : 'Tide Memory',
    subtitle: 'Depth beyond the horizon',
    category: 'travel',
  },
  {
    id      : 4,
    src     : 'https://picsum.photos/seed/abstract44/1200/900',
    thumb   : 'https://picsum.photos/seed/abstract44/600/450',
    title   : 'Chromatic Drift',
    subtitle: 'Color without constraint',
    category: 'abstract',
  },
  {
    id      : 5,
    src     : 'https://picsum.photos/seed/mountain77/1200/900',
    thumb   : 'https://picsum.photos/seed/mountain77/600/450',
    title   : 'Summit Solitude',
    subtitle: 'Where the world falls silent',
    category: 'nature',
  },
  {
    id      : 6,
    src     : 'https://picsum.photos/seed/glass55/1200/900',
    thumb   : 'https://picsum.photos/seed/glass55/600/450',
    title   : 'Glass Horizon',
    subtitle: 'Transparency & reflection',
    category: 'architecture',
  },
  {
    id      : 7,
    src     : 'https://picsum.photos/seed/city11/1200/900',
    thumb   : 'https://picsum.photos/seed/city11/600/450',
    title   : 'Neon Meridian',
    subtitle: 'Urban pulse at midnight',
    category: 'travel',
  },
  {
    id      : 8,
    src     : 'https://picsum.photos/seed/wave33/1200/900',
    thumb   : 'https://picsum.photos/seed/wave33/600/450',
    title   : 'Liquid Geometry',
    subtitle: 'Texture in constant motion',
    category: 'abstract',
  },
  {
    id      : 9,
    src     : 'https://picsum.photos/seed/flora99/1200/900',
    thumb   : 'https://picsum.photos/seed/flora99/600/450',
    title   : 'Petal Whispers',
    subtitle: 'Flora & morning light',
    category: 'nature',
  },
  {
    id      : 10,
    src     : 'https://picsum.photos/seed/arch66/1200/900',
    thumb   : 'https://picsum.photos/seed/arch66/600/450',
    title   : 'Brutalist Grace',
    subtitle: 'Form following force',
    category: 'architecture',
  },
  {
    id      : 11,
    src     : 'https://picsum.photos/seed/desert50/1200/900',
    thumb   : 'https://picsum.photos/seed/desert50/600/450',
    title   : 'Dune Reverie',
    subtitle: 'Sand sculpted by wind',
    category: 'travel',
  },
  {
    id      : 12,
    src     : 'https://picsum.photos/seed/light30/1200/900',
    thumb   : 'https://picsum.photos/seed/light30/600/450',
    title   : 'Refraction Study',
    subtitle: 'Spectrum & void',
    category: 'abstract',
  },
];

/* STATE */
let currentFilter  = 'all';
let filteredImages = [...GALLERY];
let lbIndex        = 0;

/* DOM REFERENCES */
const galleryGrid  = document.getElementById('galleryGrid');
const galleryEmpty = document.getElementById('galleryEmpty');
const lightbox     = document.getElementById('lightbox');
const lbImgWrap    = document.getElementById('lbImgWrap');
const lbImageEl    = document.getElementById('lbImage');
const lbTitle      = document.getElementById('lbTitle');
const lbSubtitle   = document.getElementById('lbSubtitle');
const lbBadge      = document.getElementById('lbBadge');
const lbCounter    = document.getElementById('lbCounter');
const lbClose      = document.getElementById('lbClose');
const lbPrev       = document.getElementById('lbPrev');
const lbNext       = document.getElementById('lbNext');
const lbBackdrop   = document.getElementById('lbBackdrop');
const filterBtns   = document.querySelectorAll('.filter-btn');

/* RENDER GALLERY */
function renderGallery(filter = 'all') {
  galleryGrid.innerHTML = '';

  filteredImages = filter === 'all'
    ? [...GALLERY]
    : GALLERY.filter(item => item.category === filter);

  if (filteredImages.length === 0) {
    galleryEmpty.hidden = false;
    return;
  }

  galleryEmpty.hidden = true;

  filteredImages.forEach((item, index) => {
    const card = buildCard(item, index);
    galleryGrid.appendChild(card);
  });
}


function buildCard(item, index) {
  const article = document.createElement('article');
  article.className = 'card';
  article.style.animationDelay = `${index * 0.07}s`;
  article.setAttribute('role',       'button');
  article.setAttribute('tabindex',   '0');
  article.setAttribute('aria-label', `Open ${item.title} in full view`);

  article.innerHTML = `
    <img
      class="card-img"
      src="${item.thumb}"
      alt="${item.title}"
      loading="lazy"
    />
    <span class="card-badge" aria-hidden="true">${item.category}</span>
    <div class="card-expand" aria-hidden="true">
      <!-- Expand arrows icon -->
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M1 1h3M1 1v3M11 1h-3M11 1v3M1 11h3M1 11v-3M11 11h-3M11 11v-3"
          stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    </div>
    <div class="card-overlay">
      <h3 class="card-title">${item.title}</h3>
      <p  class="card-subtitle">${item.subtitle}</p>
    </div>
  `;

  // Fade in image once it has loaded
  const img = article.querySelector('.card-img');
  const onLoad = () => img.classList.add('loaded');
  img.addEventListener('load',  onLoad);
  img.addEventListener('error', onLoad);          // show even if broken
  if (img.complete) onLoad();

  // Open lightbox on click
  article.addEventListener('click', () => openLightbox(index));

  // Keyboard support: Enter or Space opens lightbox
  article.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(index);
    }
  });

  return article;
}

function updateCounts() {
  document.querySelectorAll('.badge[data-count]').forEach(el => {
    const cat  = el.dataset.count;
    const count = cat === 'all'
      ? GALLERY.length
      : GALLERY.filter(i => i.category === cat).length;
    el.textContent = count;
  });
}

/* FILTER EVENTS*/
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderGallery(currentFilter);
  });
});

/* LIGHTBOX — OPEN */
function openLightbox(index) {
  lbIndex = index;
  lightbox.hidden           = false;
  document.body.style.overflow = 'hidden';
  loadSlide();
}

/* LIGHTBOX — CLOSE */
function closeLightbox() {
  lightbox.hidden              = true;
  document.body.style.overflow = '';
}

/* LIGHTBOX — LOAD SLIDE*/
function loadSlide() {
  const item = filteredImages[lbIndex];
  if (!item) return;

  // Show spinner
  lbImgWrap.classList.add('loading');
  lbImageEl.style.opacity = '0';

  // Update text & navigation state immediately
  lbTitle.textContent    = item.title;
  lbSubtitle.textContent = item.subtitle;
  lbBadge.textContent    = item.category;
  lbCounter.textContent  = `${lbIndex + 1} / ${filteredImages.length}`;
  lbPrev.disabled        = lbIndex === 0;
  lbNext.disabled        = lbIndex === filteredImages.length - 1;

  // Preload full-resolution image
  const tmp   = new Image();
  tmp.onload  = () => showImage(item.src,   item.title);
  tmp.onerror = () => showImage(item.thumb, item.title); // fallback to thumbnail
  tmp.src     = item.src;
}

/* Helper: reveal image in lightbox */
function showImage(src, alt) {
  lbImageEl.src = src;
  lbImageEl.alt = alt;
  lbImgWrap.classList.remove('loading');
  // rAF ensures the browser paints the opacity: 0 state first
  requestAnimationFrame(() => {
    lbImageEl.style.opacity = '1';
  });
}

/* LIGHTBOX — NAVIGATE
   dir: -1 = prev, +1 = next */
function navigate(dir) {
  const next = lbIndex + dir;
  if (next < 0 || next >= filteredImages.length) return;
  lbIndex = next;
  loadSlide();
}

/* LIGHTBOX EVENT LISTENERS*/
lbClose.addEventListener('click',    closeLightbox);
lbBackdrop.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click',     () => navigate(-1));
lbNext.addEventListener('click',     () => navigate(1));

/* Keyboard navigation */
document.addEventListener('keydown', e => {
  if (lightbox.hidden) return;
  switch (e.key) {
    case 'Escape':     closeLightbox();  break;
    case 'ArrowLeft':  navigate(-1);     break;
    case 'ArrowRight': navigate(1);      break;
  }
});

/* Touch swipe for mobile lightbox navigation */
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

lightbox.addEventListener('touchend', e => {
  const delta = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(delta) > 50) navigate(delta > 0 ? 1 : -1);
}, { passive: true });

renderGallery();
updateCounts();