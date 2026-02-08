// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

// Back to top smooth behavior is provided by CSS scroll-behavior.
// Theme toggle (light / dark / system)
const root = document.documentElement;
const themeBtn = document.getElementById('themeBtn');

function setTheme(t) {
  if (t === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', t);
  }
  localStorage.setItem('theme', t);
}

function initTheme() {
  const saved = localStorage.getItem('theme');
  if (!saved || saved === 'system') {
    setTheme('system');
  } else {
    setTheme(saved);
  }
}
initTheme();

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const current = localStorage.getItem('theme') || 'system';
    const next = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
    setTheme(next);
    themeBtn.title = `主题：${next}`;
  });
}

// Improve external link security
for (const a of document.querySelectorAll('a[target="_blank"]')) {
  a.rel = 'noreferrer noopener';
}

// Floating back-to-top button visibility
const floatingTop = document.getElementById('floating-top');
function updateFloatingTop() {
  if (!floatingTop) return;
  if (window.scrollY > 200) {
    floatingTop.classList.add('visible');
  } else {
    floatingTop.classList.remove('visible');
  }
}
updateFloatingTop();
window.addEventListener('scroll', updateFloatingTop);

// Research section: default collapsed; header toggles collapse/expand; clicking a card will expand it
const researchSection = document.getElementById('research');
if (researchSection) {
  const researchHeader = researchSection.querySelector('h2');
  const cards = researchSection.querySelector('.cards');

  if (cards && !cards.id) {
    cards.id = 'research-cards';
  }

  // Sync initial aria state with class
  if (researchHeader) {
    researchHeader.setAttribute('aria-controls', cards ? cards.id : 'research-cards');
    if (researchSection.classList.contains('collapsed')) {
      researchHeader.setAttribute('aria-expanded', 'false');
    } else {
      researchHeader.setAttribute('aria-expanded', 'true');
    }

    const toggleResearch = () => {
      const collapsed = researchSection.classList.toggle('collapsed');
      researchHeader.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    };

    researchHeader.addEventListener('click', toggleResearch);
    researchHeader.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleResearch(); }
    });

    // Clicking any card expands the section (but doesn't collapse)
    if (cards) {
      cards.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
          if (researchSection.classList.contains('collapsed')) {
            researchSection.classList.remove('collapsed');
            researchHeader.setAttribute('aria-expanded', 'true');
          }
        });
      });
    }
  }
}