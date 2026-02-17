/**
 * Ahmed Yehia — Portfolio JavaScript
 * Features:
 *  - Sticky navbar with scroll shadow
 *  - Active nav-link highlighting based on scroll position
 *  - Hamburger mobile menu toggle
 *  - Skill-bar animated fill-in on scroll (IntersectionObserver)
 *  - Project filter tabs
 *  - Contact form front-end simulation
 *  - Back-to-top button visibility
 *  - Smooth entry animations for cards (IntersectionObserver)
 */

/* ══════════════════════════════════════════
   1. Utility helpers
═══════════════════════════════════════════ */

/** Throttle a callback to fire at most once per `limit` ms */
function throttle(fn, limit = 100) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= limit) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

/* ══════════════════════════════════════════
   2. Navbar — scroll shadow & active links
═══════════════════════════════════════════ */

const header   = document.getElementById('header');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

/**
 * Mark the nav link whose section is currently in the viewport.
 * We pick the section whose top edge is closest to (but above or at)
 * the middle of the visible window.
 */
function highlightActiveLink() {
  const scrollY      = window.scrollY;
  const windowHeight = window.innerHeight;

  /* Add scroll shadow to header */
  header.classList.toggle('scrolled', scrollY > 20);

  /* Find the section currently centred in view */
  let activeSectionId = '';

  sections.forEach(section => {
    const sectionTop    = section.offsetTop - 90;   /* 90px offset for navbar */
    const sectionBottom = sectionTop + section.offsetHeight;

    if (scrollY >= sectionTop && scrollY < sectionBottom) {
      activeSectionId = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    const href = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', href === activeSectionId);
  });
}

window.addEventListener('scroll', throttle(highlightActiveLink, 80));
highlightActiveLink(); /* run once on load */

/* ══════════════════════════════════════════
   3. Mobile hamburger menu
═══════════════════════════════════════════ */

const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});

/* Close menu when a link is clicked */
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* Close menu on outside click */
document.addEventListener('click', e => {
  if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
  }
});

/* ══════════════════════════════════════════
   4. Skill-bar animation (IntersectionObserver)
═══════════════════════════════════════════ */

const skillBarFills = document.querySelectorAll('.skill-bar-fill');

const skillBarObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill      = entry.target;
        const targetPct = fill.getAttribute('data-width') || '0';
        /* Slight delay so the user sees the animation */
        setTimeout(() => {
          fill.style.width = targetPct + '%';
        }, 200);
        skillBarObserver.unobserve(fill); /* animate only once */
      }
    });
  },
  { threshold: 0.15 }
);

skillBarFills.forEach(fill => skillBarObserver.observe(fill));

/* ══════════════════════════════════════════
   5. Project filter tabs
═══════════════════════════════════════════ */

const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    /* Update active button */
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const show     = filter === 'all' || category === filter;

      if (show) {
        card.classList.remove('hidden');
        /* Re-trigger hover effect by re-attaching to DOM flow */
        card.style.animation = 'fadeIn .35s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ══════════════════════════════════════════
   6. Contact form — front-end simulation
═══════════════════════════════════════════ */

const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const name    = contactForm.querySelector('[name="name"]').value.trim();
    const email   = contactForm.querySelector('[name="email"]').value.trim();
    const message = contactForm.querySelector('[name="message"]').value.trim();

    /* Simple validation */
    if (!name || !email || !message) {
      shakeBadInputs(contactForm);
      return;
    }

    /* Simulate submission delay */
    const submitBtn = contactForm.querySelector('[type="submit"]');
    submitBtn.disabled  = true;
    submitBtn.textContent = 'Sending…';

    setTimeout(() => {
      formSuccess.style.display = 'block';
      contactForm.reset();
      submitBtn.disabled    = false;
      submitBtn.innerHTML   = 'Send Message <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';

      /* Hide success message after 5 s */
      setTimeout(() => {
        formSuccess.style.display = 'none';
      }, 5000);
    }, 1200);
  });
}

/** Shake invalid / empty required fields */
function shakeBadInputs(form) {
  const required = form.querySelectorAll('[required]');
  required.forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = '#f87171';
      field.style.animation   = 'shake .4s ease';
      setTimeout(() => {
        field.style.animation = '';
      }, 400);
    }
  });
}

/* Inject shake keyframe dynamically */
(function injectShake() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(6px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
})();

/* ══════════════════════════════════════════
   7. Back-to-top button
═══════════════════════════════════════════ */

const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', throttle(() => {
  backToTopBtn.classList.toggle('visible', window.scrollY > 400);
}, 100));

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ══════════════════════════════════════════
   8. Fade-in animations for cards / sections
      using IntersectionObserver
═══════════════════════════════════════════ */

/** Elements to animate on first appearance */
const animatables = document.querySelectorAll(
  '.timeline-content, .exp-card, .service-card, .project-card, .skill-category, .about-grid, .contact-grid'
);

/* Inject base CSS for animatable elements */
(function injectFadeCSS() {
  const style = document.createElement('style');
  style.textContent = `
    .anim-target {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity .6s ease, transform .6s ease;
    }
    .anim-target.anim-visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);
})();

/* Apply the class that makes them invisible initially */
animatables.forEach((el, i) => {
  el.classList.add('anim-target');
  /* Stagger delay based on DOM index within parent */
  el.style.transitionDelay = `${(i % 6) * 0.07}s`;
});

const entryObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-visible');
        entryObserver.unobserve(entry.target); /* fire only once */
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

animatables.forEach(el => entryObserver.observe(el));

/* ══════════════════════════════════════════
   9. Smooth-scroll for anchor links
      (belt & suspenders alongside CSS)
═══════════════════════════════════════════ */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});
