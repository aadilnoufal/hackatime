// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

function setupCurrentlyHacking() {
  const header = document.querySelector('.currently-hacking');
  // only if no existing event listener
  if (!header) { return }
  header.onclick = function() {
    const container = document.querySelector('.currently-hacking-container');
    if (container) {
      container.classList.toggle('visible');
    }
  }
}

function outta() {
  // we should figure out a better way of doing this rather than this shit ass way, but it works for now
  const modal = document.getElementById('logout-modal');
  const can = document.getElementById('cancel-logout');
  
  if (!modal || !can) return;
  modal.classList.remove('hidden');

  function logshow() {
    modal.classList.remove('pointer-events-none');
    modal.classList.remove('opacity-0');
    modal.querySelector('.bg-dark').classList.remove('scale-95');
    modal.querySelector('.bg-dark').classList.add('scale-100');
  }

  function logquit() {
    modal.classList.add('opacity-0');
    modal.querySelector('.bg-dark').classList.remove('scale-100');
    modal.querySelector('.bg-dark').classList.add('scale-95');
    setTimeout(() => {
      modal.classList.add('pointer-events-none');
    }, 300);
  }

  window.showLogout = logshow;

  can.addEventListener('click', logquit);

  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      logquit();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.classList.contains('pointer-events-none')) {
      logquit();
    }
  });
}

// Handle both initial page load and subsequent Turbo navigations
document.addEventListener('turbo:load', function() {
  setupCurrentlyHacking();
  outta();
});
document.addEventListener('turbo:render', function() {
  setupCurrentlyHacking();
  outta();
});
document.addEventListener('DOMContentLoaded', function() {
  setupCurrentlyHacking();
  outta();
});

// =============================
// Neon Homepage Enhancements
// =============================

function initFadeReveal() {
  const els = document.querySelectorAll('.fade-reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  els.forEach(el => io.observe(el));
}

// Light sparkle trail (performance conscious)
function initNeonHomeEnhancements() {
  initFadeReveal();
}

['turbo:load','turbo:render','DOMContentLoaded'].forEach(evt => {
  document.addEventListener(evt, initNeonHomeEnhancements);
});

// Rotating code snippet (workspace hero)
function initLiveSnippet() {
  const el = document.getElementById('live-snippet');
  if (!el) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Extract initial JSON (fallback if parse fails)
  let baseData = {};
  try { baseData = JSON.parse(el.textContent.trim()); } catch(e) {}

  function randomDelta(val) {
    if (!val) return val;
    // crude parse hours/min pattern
    return val.replace(/(\d+)(h?)/, (m,n,suffix) => `${Math.max(0, parseInt(n,10) + (Math.random()>0.5?1:-1))}${suffix}`);
  }

  function nextPayload() {
    const clone = { ...baseData };
    // Slight playful updates
    if (clone.today) clone.today = randomDelta(clone.today);
    if (clone.top_lang && Math.random() > 0.65) clone.top_lang = clone.top_lang; // keep stable mostly
    if (Array.isArray(clone.editors) && clone.editors.length > 1 && Math.random() > 0.5) clone.editors.reverse();
    if (clone.streak && Math.random() > 0.8) clone.streak = clone.streak + 1; // hypothetical increment visually
    return clone;
  }

  function update() {
    const payload = nextPayload();
    const json = JSON.stringify(payload, null, 0);
    if (!prefersReduced) {
      el.classList.add('snippet-fade');
      setTimeout(()=> {
        el.textContent = json;
        el.classList.remove('snippet-fade');
      }, 180);
    } else {
      el.textContent = json;
    }
  }

  if (!prefersReduced) {
    setInterval(update, 6200);
  }
}

['turbo:load','turbo:render','DOMContentLoaded'].forEach(evt => {
  document.addEventListener(evt, initLiveSnippet);
});

