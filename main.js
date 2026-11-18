document.getElementById('year').textContent = new Date().getFullYear();
const toggle = document.getElementById('themeToggle');
const icon = toggle.querySelector('.toggle-icon');
const label = toggle.querySelector('.toggle-label');
const html = document.documentElement;

function updateNairobiClock() {
  try {
    const options = { timeZone: 'Africa/Nairobi', hour: '2-digit', minute: '2-digit', hour12: true };
    const timeStr = new Intl.DateTimeFormat('en-US', options).format(new Date());
    const el = document.getElementById('nairobiClock');
    if (el) el.textContent = `Nairobi, Kenya · ${timeStr} EAT`;
  } catch(e) {}
}
updateNairobiClock();
setInterval(updateNairobiClock, 30000);

const saved = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const themeColorMeta = document.getElementById('themeColorMeta');

function updateThemeColor(isDark) {
  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', isDark ? '#111318' : '#f5f2eb');
  }
}

if (saved === 'dark' || (!saved && prefersDark)) {
  html.setAttribute('data-theme', 'dark');
  icon.textContent = '☽';
  label.textContent = 'DARK';
  updateThemeColor(true);
} else {
  updateThemeColor(false);
}

toggle.addEventListener('click', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  if (isDark) {
    html.removeAttribute('data-theme');
    icon.textContent = '☀︎';
    label.textContent = 'LIGHT';
    localStorage.setItem('theme', 'light');
    updateThemeColor(false);
  } else {
    html.setAttribute('data-theme', 'dark');
    icon.textContent = '☽';
    label.textContent = 'DARK';
    localStorage.setItem('theme', 'dark');
    updateThemeColor(true);
  }
});

// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ── ACTIVE NAV ON SCROLL ──
const sections = document.querySelectorAll('section[id], .hero');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id || 'home';
      navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── BACK TO TOP ──
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 600);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── SCROLL REVEAL ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── SCROLL PROGRESS ──
const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress() {
  if (!scrollProgress) return;
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const scrollHeight = doc.scrollHeight - doc.clientHeight;
  const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  scrollProgress.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

// ── DRAW ON SCROLL (sketch strokes) ──
(function initDrawOnScroll() {
  const prefersReducedMotionDraw = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const drawSelectors = [
    '.meta-icon .sketch',
    '.projects-pin .sketch',
    '.sig-mark .sketch',
    '.pipeline-viz .pipe-line'
  ];
  const drawEls = document.querySelectorAll(drawSelectors.join(','));
  drawEls.forEach(el => {
    try {
      const len = el.getTotalLength ? el.getTotalLength() : 200;
      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = len;
      el.classList.add('draw-target');
      if (prefersReducedMotionDraw) {
        el.style.strokeDashoffset = '0';
        el.classList.add('drawn');
      }
    } catch (e) {
      el.style.strokeDashoffset = '0';
    }
  });
  if (!prefersReducedMotionDraw) {
    const drawObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.strokeDashoffset = '0';
          e.target.classList.add('drawn');
          drawObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.35 });
    drawEls.forEach(el => {
      if (!el.classList.contains('drawn')) drawObserver.observe(el);
    });
  }
})();

// ── STAT COUNT-UP ──
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function animateCount(el) {
  const target = parseInt(el.dataset.count || '0', 10);
  const suffix = el.dataset.suffix || '';
  if (prefersReducedMotion || isNaN(target)) {
    el.textContent = target + suffix;
    return;
  }
  const duration = 900;
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const val = Math.round(target * eased);
    el.textContent = val + suffix;
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      statObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.stat-num[data-count]').forEach(el => statObserver.observe(el));

// ── TOAST + CLIPBOARD + MICRO-INTERACTIONS ──
const toastEl = document.getElementById('toast');
let toastTimer;
function showToast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1800);
}
async function copyText(text, msg) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    showToast(msg || 'Copied');
    return true;
  } catch (e) {
    showToast('Copy failed');
    return false;
  }
}

document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
  a.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const email = (a.getAttribute('href') || '').replace('mailto:', '');
    copyText(email, 'Email copied: ' + email);
  });
});

if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.hero-cta .btn').forEach(btn => {
    btn.classList.add('magnetic');
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.12;
      const y = (e.clientY - r.top - r.height / 2) * 0.18;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    btn.addEventListener('blur', () => { btn.style.transform = ''; });
  });
}

function drawSchematic(panel) {
  if (!panel || prefersReducedMotion) return;
  const strokes = panel.querySelectorAll('.case-schematic svg path, .case-schematic svg line, .case-schematic svg rect, .case-schematic svg circle');
  strokes.forEach((el, i) => {
    try {
      const len = el.getTotalLength ? el.getTotalLength() : 120;
      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = len;
      el.style.transition = 'stroke-dashoffset 0.9s ease';
      void el.getBoundingClientRect();
      setTimeout(() => { el.style.strokeDashoffset = '0'; }, 40 + i * 18);
    } catch (e) {}
  });
}

// ── PROJECT CASE STUDIES ──
document.querySelectorAll('.case-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.project-card');
    if (!card) return;
    const panel = card.querySelector('.case-study');
    const open = card.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (panel) panel.hidden = !open;
    btn.innerHTML = (open ? '<span class="caret">▸</span> Hide case study' : '<span class="caret">▸</span> Case study');
    if (open) drawSchematic(panel);
  });
});

// ── COMMAND PALETTE (⌘K / Ctrl+K) ──
(function initCommandPalette() {
  const overlay = document.getElementById('cmdkOverlay');
  const input = document.getElementById('cmdkInput');
  const list = document.getElementById('cmdkList');
  if (!overlay || !input || !list) return;

  const actions = [
    { label: 'About', meta: 'Section', run: () => location.hash = '#about' },
    { label: 'Experience', meta: 'Section', run: () => location.hash = '#experience' },
    { label: 'Skills', meta: 'Section', run: () => location.hash = '#skills' },
    { label: 'Projects & Case Studies', meta: 'Section', run: () => location.hash = '#projects' },
    { label: 'Contact', meta: 'Section', run: () => location.hash = '#contact' },
    { label: 'Copy email — sgatharikih@gmail.com', meta: 'Action', run: () => copyText('sgatharikih@gmail.com', 'Email copied: sgatharikih@gmail.com') },
    { label: 'LinkedIn', meta: 'Link', run: () => window.open('https://linkedin.com/in/gatharikih', '_blank', 'noopener') },
    { label: 'GitHub', meta: 'Link', run: () => window.open('https://github.com/Gatharikih', '_blank', 'noopener') },
    { label: 'Blog (Hashnode)', meta: 'Link', run: () => window.open('https://hashnode.com/@gatharikih', '_blank', 'noopener') },
    { label: 'Download Résumé (PDF)', meta: 'Link', run: () => window.open('https://raw.githubusercontent.com/Gatharikih/Gatharikih.github.io/master/NGIGI%20SIMON%20GATHARIKI%20CV.pdf', '_blank', 'noopener') },
    { label: 'Toggle light/dark theme', meta: 'Action', run: () => document.getElementById('themeToggle') && document.getElementById('themeToggle').click() },
    { label: 'Back to top', meta: 'Action', run: () => window.scrollTo({ top: 0, behavior: 'smooth' }) }
  ];

  let filtered = actions.slice();
  let activeIndex = 0;
  let lastFocus = null;

  function render() {
    list.innerHTML = '';
    if (!filtered.length) {
      list.innerHTML = '<div class="cmdk-empty">No matches. Try "projects", "cv", or "theme".</div>';
      return;
    }
    filtered.forEach((a, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cmdk-item' + (i === activeIndex ? ' active' : '');
      btn.setAttribute('role', 'option');
      btn.setAttribute('tabindex', i === activeIndex ? '0' : '-1');
      btn.innerHTML = `<span>${a.label}</span><small>${a.meta}</small>`;
      btn.addEventListener('mouseenter', () => { activeIndex = i; render(); });
      btn.addEventListener('click', () => { a.run(); close(); });
      list.appendChild(btn);
    });
  }

  function open() {
    lastFocus = document.activeElement;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    input.value = '';
    filtered = actions.slice();
    activeIndex = 0;
    render();
    setTimeout(() => input.focus(), 0);
  }

  function close() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    if (lastFocus && typeof lastFocus.focus === 'function') {
      try { lastFocus.focus(); } catch (e) {}
    }
  }

  function isOpen() { return overlay.classList.contains('open'); }

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    filtered = actions.filter(a => (a.label + ' ' + a.meta).toLowerCase().includes(q));
    activeIndex = 0;
    render();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  function trapFocus(e) {
    if (!isOpen() || e.key !== 'Tab') return;
    const focusables = overlay.querySelectorAll('input, button, [href], [tabindex]:not([tabindex="-1"])');
    const els = Array.from(focusables).filter(el => !el.disabled && el.offsetParent !== null);
    if (!els.length) return;
    const first = els[0], last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  document.addEventListener('keydown', (e) => {
    const modK = (e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey);
    if (modK) {
      e.preventDefault();
      isOpen() ? close() : open();
      return;
    }
    if (!isOpen()) return;
    if (e.key === 'Tab') { trapFocus(e); return; }
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); if (filtered.length) { activeIndex = (activeIndex + 1) % filtered.length; render(); list.querySelectorAll('.cmdk-item')[activeIndex]?.scrollIntoView({ block: 'nearest' }); } }
    if (e.key === 'ArrowUp') { e.preventDefault(); if (filtered.length) { activeIndex = (activeIndex - 1 + filtered.length) % filtered.length; render(); list.querySelectorAll('.cmdk-item')[activeIndex]?.scrollIntoView({ block: 'nearest' }); } }
    if (e.key === 'Enter') { e.preventDefault(); if (filtered[activeIndex]) { filtered[activeIndex].run(); close(); } }
  });
})();
