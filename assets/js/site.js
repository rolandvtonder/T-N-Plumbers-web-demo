/* ============================================================
   T&N PLUMBERS — site.js
   Plain ES2018, no dependencies, no build step.
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- 1. Footer year ---------- */
  var yr = $('#yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- 2. Sticky nav ---------- */
  var nav = $('#nav');
  function onScroll() {
    if (nav) nav.classList.toggle('is-stuck', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- 3. Mobile drawer ---------- */
  var burger = $('#burger');
  var drawer = $('#drawer');
  function setDrawer(open) {
    if (!burger || !drawer) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    drawer.classList.toggle('is-open', open);
  }
  if (burger) {
    burger.addEventListener('click', function () {
      setDrawer(burger.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (drawer) {
    $$('a', drawer).forEach(function (a) {
      a.addEventListener('click', function () { setDrawer(false); });
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && burger && burger.getAttribute('aria-expanded') === 'true') {
      setDrawer(false);
      burger.focus();
    }
  });

  /* ---------- 4. Reveal on scroll ---------- */
  var revealables = $$('.rv');
  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          revObs.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { revObs.observe(el); });
  }

  /* ---------- 5. Process timeline ---------- */
  var steps = $$('.step');
  if (reduced || !('IntersectionObserver' in window)) {
    steps.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var stepObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          stepObs.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -18% 0px', threshold: 0.2 });
    steps.forEach(function (el) { stepObs.observe(el); });
  }

  /* ---------- 6. Scroll-spy nav ---------- */
  var navLinks = $$('.nav__links a');
  var sections = navLinks
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + en.target.id;
          if (on) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- 7. Services hover-swap ---------- */
  var SERVICES = [
    { t: 'Blocked drains & sewer lines',
      d: 'Sinks, showers, toilets, gullies and main sewer lines cleared with the right machine for the job — then we check what caused it so it does not come straight back.' },
    { t: 'Burst geysers & hot water',
      d: 'Burst or leaking geysers, no hot water, element and thermostat replacements. We deal with the swap, the drip tray, the overflow and the safety valves.' },
    { t: 'Leak detection & pipe repair',
      d: 'Damp patches, a water meter that keeps ticking, or a pipe already flooding. We trace it, open up only what we have to, and repair or re-run the line properly.' },
    { t: 'Bathroom renovations',
      d: 'Full strip-outs and refits — new suites, tiling, waste rerouting and finishes. Plenty of our customers have had us back to do their second bathroom.' },
    { t: 'Taps, toilets & basins',
      d: 'Dripping mixers, running toilets, cracked cisterns and new basin installs. The small jobs get exactly the same care as the big ones.' },
    { t: 'Maintenance & call-outs',
      d: 'Homes, rentals, offices and body corporates. Regular checks, and a number that gets answered when something goes wrong on a Sunday afternoon.' }
  ];

  var WHATSAPP = '27638044660';

  function waLink(text) {
    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text);
  }

  var svcItems = $$('.svc__item');
  var svcMedia = $$('.svc__media li');
  var svcBody  = $('#svcBody');
  var svcIndex = 0;

  function setService(i) {
    if (i === svcIndex || !svcBody || !SERVICES[i]) return;
    svcIndex = i;

    svcItems.forEach(function (el, n) { el.classList.toggle('is-active', n === i); });
    svcMedia.forEach(function (el, n) { el.classList.toggle('is-on', n === i); });

    var href = waLink('Hi T&N Plumbers. I would like to book: ' + SERVICES[i].t);
    svcBody.innerHTML =
      '<h3>' + SERVICES[i].t + '</h3>' +
      '<p>' + SERVICES[i].d + '</p>' +
      '<a class="btn btn--wa" target="_blank" rel="noopener" href="' + href + '">' +
      '<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1a13 13 0 0 1-6.9-6c-.5-.8-1-1.9-1-2.9 0-1 .5-1.5.8-1.8.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6a9 9 0 0 0 4 3.5c.3.1.5.1.7-.1l.8-1c.2-.2.4-.2.6-.1l2 1c.2.1.4.2.4.3.1.2.1.6 0 1z"/></svg>' +
      'Book on WhatsApp</a>';
  }

  svcItems.forEach(function (el, i) {
    var btn = $('.svc__btn', el);
    if (!btn) return;
    // pointer: swap on hover (desktop). touch/keyboard: swap on click/focus.
    el.addEventListener('mouseenter', function () {
      if (window.matchMedia('(hover: hover)').matches) setService(i);
    });
    btn.addEventListener('focus', function () { setService(i); });
    btn.addEventListener('click', function () { setService(i); });
  });

  /* ---------- 8. About tabs (ARIA tab pattern) ---------- */
  var tabs   = $$('.tabs [role="tab"]');
  var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });

  function selectTab(i, focus) {
    tabs.forEach(function (t, n) {
      var on = n === i;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (panels[n]) panels[n].hidden = !on;
    });
    if (focus && tabs[i]) tabs[i].focus();
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(i); });
    t.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') n = 0;
      else if (e.key === 'End') n = tabs.length - 1;
      if (n !== null) { e.preventDefault(); selectTab(n, true); }
    });
  });

  /* ---------- 9. Before / after comparison ---------- */
  $$('.cmp').forEach(function (cmp) {
    var input = $('input[type="range"]', cmp);
    if (!input) return;
    var apply = function () { cmp.style.setProperty('--pos', input.value + '%'); };
    apply();
    input.addEventListener('input', apply);

    // dragging anywhere on the image, not just the native thumb
    var dragging = false;
    function fromClientX(x) {
      var r = cmp.getBoundingClientRect();
      var pct = ((x - r.left) / r.width) * 100;
      input.value = String(Math.max(0, Math.min(100, pct)));
      apply();
    }
    cmp.addEventListener('pointerdown', function (e) {
      dragging = true;
      cmp.setPointerCapture(e.pointerId);
      fromClientX(e.clientX);
    });
    cmp.addEventListener('pointermove', function (e) {
      if (dragging) fromClientX(e.clientX);
    });
    cmp.addEventListener('pointerup', function (e) {
      dragging = false;
      if (cmp.hasPointerCapture(e.pointerId)) cmp.releasePointerCapture(e.pointerId);
    });
    cmp.addEventListener('pointercancel', function () { dragging = false; });
  });

  /* ---------- 10. Reviews rail ---------- */
  var rail = $('#revRail');
  function railStep() {
    var card = rail && rail.firstElementChild;
    if (!card) return 320;
    return card.getBoundingClientRect().width + 24;
  }
  var prev = $('#revPrev'), next = $('#revNext');
  if (prev) prev.addEventListener('click', function () {
    rail.scrollBy({ left: -railStep(), behavior: reduced ? 'auto' : 'smooth' });
  });
  if (next) next.addEventListener('click', function () {
    rail.scrollBy({ left: railStep(), behavior: reduced ? 'auto' : 'smooth' });
  });

  /* ---------- 11. Seamless marquee ---------- */
  var strip = $('#strip');
  if (strip && !reduced) {
    strip.innerHTML += strip.innerHTML;   // duplicate for a clean -50% loop
    $$('svg', strip).forEach(function (s) { s.setAttribute('aria-hidden', 'true'); });
  }

  /* ---------- 12. Hero parallax (pointer only) ---------- */
  var stack = $('.hero__stack');
  if (stack && !reduced && window.matchMedia('(hover: hover)').matches) {
    var cards = $$('.pcard', stack);
    var depth = [16, -12, 22];
    var raf = null, tx = 0, ty = 0;

    stack.addEventListener('pointermove', function (e) {
      var r = stack.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(paint);
    });
    stack.addEventListener('pointerleave', function () {
      tx = 0; ty = 0;
      if (!raf) raf = requestAnimationFrame(paint);
    });
    function paint() {
      raf = null;
      cards.forEach(function (c, i) {
        var d = depth[i % depth.length];
        c.style.transform =
          'rotate(var(--rot,0deg)) translate3d(' + (tx * d).toFixed(2) + 'px,' + (ty * d).toFixed(2) + 'px,0)';
      });
    }
  }
})();
