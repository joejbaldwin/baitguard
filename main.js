/* BaitGuard landing page — no dependencies */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Hero image rotator ----------
     Drop images into assets/hero/ named hero-1.jpg, hero-2.jpg, … (up to 8).
     Any that exist are picked up automatically; missing ones are skipped. */
  const HERO_DIR = 'assets/hero/';
  const HERO_MAX = 8;
  const ROTATE_MS = 6000;

  const rotator = $('[data-hero-rotator]');
  const dotsEl = $('[data-rotator-dots]');

  const probe = (src) => new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

  (async () => {
    const found = [];
    for (let i = 1; i <= HERO_MAX; i++) {
      const img = await probe(`${HERO_DIR}hero-${i}.jpg`);
      if (!img) break;
      img.alt = '';
      img.decoding = 'async';
      found.push(img);
      if (found.length === 1) { rotator.appendChild(img); start(found); }
      else rotator.appendChild(img);
      renderDots(found.length);
    }
  })();

  let idx = 0, timer = null, imgs = [];
  function start(list) {
    imgs = list;
    rotator.classList.add('has-images');
    requestAnimationFrame(() => show(0));
  }
  function show(i) {
    idx = i;
    imgs.forEach((img, n) => img.classList.toggle('is-active', n === i));
    $$('span', dotsEl).forEach((d, n) => {
      d.classList.remove('is-active');
      if (n === i) { void d.offsetWidth; d.classList.add('is-active'); }
    });
    clearTimeout(timer);
    if (imgs.length > 1 && !reduceMotion) timer = setTimeout(() => show((idx + 1) % imgs.length), ROTATE_MS);
  }
  function renderDots(n) {
    dotsEl.style.setProperty('--rot-ms', `${ROTATE_MS}ms`);
    if (n < 2) { dotsEl.innerHTML = ''; return; }
    dotsEl.innerHTML = Array.from({ length: n }, () => '<span></span>').join('');
    $$('span', dotsEl)[idx]?.classList.add('is-active');
    if (!timer && !reduceMotion) show(idx);
  }

  /* ---------- Header ---------- */
  const header = $('[data-header]');
  const toggle = $('[data-nav-toggle]');
  const menu = $('[data-mobile-menu]');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
  };
  toggle.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); } });

  // Highlight current section in nav
  const navLinks = $$('.nav-links a');
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === `#${en.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['how', 'simulations', 'teams', 'about'].forEach((id) => sectionObs.observe(document.getElementById(id)));

  /* ---------- Toast ---------- */
  const toastEl = $('[data-toast]');
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 3600);
  };
  $$('[data-signin]').forEach((b) => b.addEventListener('click', () => {
    setMenu(false);
    toast('Accounts arrive with the beta. Until then, the demo needs no sign-up.');
  }));
  $$('[data-soon]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); toast('This page is coming soon.'); }));

  /* ---------- Scroll reveal ---------- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); revealObs.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
  $$('[data-reveal]').forEach((el) => revealObs.observe(el));

  /* ---------- Scroll-linked motion (rAF throttled) ---------- */
  const heroPhoto = rotator;
  const howSteps = $('.how-steps');
  const finalEl = $('[data-final]');
  let ticking = false;

  function onScroll() {
    const y = scrollY;
    const vh = innerHeight;
    header.classList.toggle('is-scrolled', y > 8);

    if (!reduceMotion) {
      // Gentle parallax on hero photo
      if (innerWidth < 960) heroPhoto.style.translate = '';
      else if (y < vh * 1.2) heroPhoto.style.translate = `0 ${Math.round(y * 0.08)}px`;

      // Final CTA mark breathes as it centres
      const fr = finalEl.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, 1 - Math.abs(fr.top + fr.height / 2 - vh / 2) / vh));
      finalEl.style.setProperty('--mark-scale', (0.85 + p * 0.25).toFixed(3));
    }

    // How-it-works progress rail
    const hr = howSteps.getBoundingClientRect();
    const prog = Math.min(1, Math.max(0, (vh * 0.5 - hr.top) / hr.height));
    howSteps.style.setProperty('--how-progress', prog.toFixed(3));
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- How it works: sticky panes ---------- */
  const steps = $$('.how-step');
  const panes = $$('.how-pane');
  // Mobile: clone each pane under its step
  $$('[data-mobile-pane]').forEach((slot) => {
    const pane = $(`.how-pane[data-pane="${slot.dataset.mobilePane}"]`);
    slot.appendChild(pane.cloneNode(true));
  });
  const stepObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const n = en.target.dataset.step;
      steps.forEach((s) => s.classList.toggle('is-active', s === en.target));
      panes.forEach((p) => p.classList.toggle('is-active', p.dataset.pane === n));
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  steps.forEach((s) => stepObs.observe(s));

  /* ---------- Simulation cards: reveal red flags ---------- */
  $$('[data-reveal-flags]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.sim-card');
      const open = card.classList.toggle('is-revealed');
      btn.setAttribute('aria-expanded', String(open));
      btn.firstChild.textContent = open ? 'Hide the red flags ' : 'Reveal the red flags ';
    });
  });

  /* ---------- Interactive demo ---------- */
  const OUTCOMES = {
    follow: {
      screen: 'site',
      badge: ['bad', 'You took the bait'],
      title: 'That link opened a convincing fake.',
      body: 'The page asks for a tiny “redelivery fee”. The £1.45 isn\'t the point: your card details are. In a real scam, a call from your “bank” often follows, using what you typed to sound legitimate.',
      todo: 'Never pay or confirm details through a link in a text. If you\'re expecting a parcel, open the courier\'s official app or type their web address yourself.',
    },
    investigate: {
      screen: 'info',
      badge: ['mid', 'Good instinct'],
      title: 'You checked before you clicked.',
      body: 'A closer look gives it away: it came from a personal mobile number, and the link swaps a lowercase “l” for a capital “I” to imitate the real courier.',
      todo: 'Now finish the job: report it as junk and delete it. Check any real delivery on the courier\'s official site, never through the message.',
    },
    report: {
      screen: 'report',
      badge: ['good', 'Safe choice'],
      title: 'Reported and removed.',
      body: 'You didn\'t engage, so the scammer gains nothing. Reporting also helps mobile networks block the sender for everyone else.',
      todo: 'Exactly right. If you are waiting for a delivery, check its status on the courier\'s own app or website.',
    },
  };

  const win = $('[data-sim-window]');
  const decide = $('[data-decide]');
  const fb = $('[data-feedback]');
  const stepLabel = $('[data-sim-step]');
  const flagList = $('[data-flag-list]');

  function setScreen(name) {
    $$('.screen', win).forEach((s) => s.classList.toggle('is-active', s.dataset.screen === name));
  }

  function choose(key) {
    const o = OUTCOMES[key];
    setScreen(o.screen);
    const badge = $('[data-outcome]', fb);
    badge.className = `outcome ${o.badge[0]}`;
    badge.textContent = o.badge[1];
    $('[data-fb-title]', fb).textContent = o.title;
    $('[data-fb-body]', fb).textContent = o.body;
    $('[data-fb-do]', fb).textContent = o.todo;
    decide.hidden = true;
    fb.hidden = false;
    flagList.classList.remove('is-in');
    requestAnimationFrame(() => requestAnimationFrame(() => flagList.classList.add('is-in')));
    win.classList.add('is-marked');
    stepLabel.textContent = 'Step 2 of 2 · Debrief';
    $('[data-fb-title]', fb).setAttribute('tabindex', '-1');
    $('[data-fb-title]', fb).focus({ preventScroll: true });
    if (innerWidth < 960) fb.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  function reset() {
    setScreen('messages');
    fb.hidden = true;
    decide.hidden = false;
    win.classList.remove('is-marked');
    stepLabel.textContent = 'Step 1 of 2 · Decide';
    $('.choice', decide).focus({ preventScroll: true });
  }

  $$('[data-choice]').forEach((b) => b.addEventListener('click', () => choose(b.dataset.choice)));
  $$('[data-choice-trigger]').forEach((b) => b.addEventListener('click', () => {
    if (!fb.hidden) return;
    choose(b.dataset.choiceTrigger);
  }));
  $('[data-reset]').addEventListener('click', reset);

  // Keyboard shortcuts A / B / C while the demo is on screen and undecided
  let demoVisible = false;
  new IntersectionObserver(([en]) => { demoVisible = en.isIntersecting; }, { threshold: 0.4 }).observe(win);
  document.addEventListener('keydown', (e) => {
    if (!demoVisible || fb.hidden === false || e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) return;
    const map = { a: 'follow', b: 'investigate', c: 'report' };
    const k = map[e.key.toLowerCase()];
    if (k) choose(k);
  });

  // Hover / focus a warning sign to highlight it on the phone
  $$('[data-flag-target]').forEach((b) => {
    let restore = null;
    const on = () => {
      const active = $('.screen.is-active', win).dataset.screen;
      if (active !== 'messages') { restore = active; setScreen('messages'); }
      $$(`.flag[data-flag="${b.dataset.flagTarget}"]`, win).forEach((f) => f.classList.add('is-hot'));
    };
    const off = () => {
      $$('.flag.is-hot', win).forEach((f) => f.classList.remove('is-hot'));
      if (restore && !fb.hidden) setScreen(restore);
      restore = null;
    };
    b.addEventListener('mouseenter', on);
    b.addEventListener('focus', on);
    b.addEventListener('mouseleave', off);
    b.addEventListener('blur', off);
    b.addEventListener('click', on);
  });
})();
