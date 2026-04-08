// SMOOTH SCROLL FOR INTERNAL LINKS
// Uses a manual animation so it still works when the OS/browser turns off
// programmatic smooth scrolling (e.g. Windows "Reduce motion" / accessibility).
function getScrollTargetY(el) {
  const navbar = document.querySelector('.navbar');
  const headerOffset = navbar ? navbar.offsetHeight + 12 : 0;
  return el.getBoundingClientRect().top + window.scrollY - headerOffset;
}

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function smoothScrollToElement(el) {
  const y = getScrollTargetY(el);
  if (prefersReducedMotion()) {
    window.scrollTo(0, y);
    return;
  }

  const startY = window.scrollY;
  const distance = y - startY;
  const duration = Math.min(900, Math.max(350, Math.abs(distance) * 0.45));
  let startTime = null;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function step(now) {
    if (startTime === null) startTime = now;
    const t = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, startY + distance * easeOutCubic(t));
    if (t < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener(
    'click',
    function (e) {
      const targetId = this.getAttribute('href');
      const target = targetId ? document.querySelector(targetId) : null;

      if (target) {
        e.preventDefault();
        smoothScrollToElement(target);
      }
    },
    { passive: false }
  );
});


// SCROLL ANIMATIONS
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = `${index * 0.08}s`;
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


// NAVBAR EFFECT
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.style.background = "rgba(15,15,15,0.95)";
    navbar.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
  } else {
    navbar.style.background = "rgba(15,15,15,0.85)";
    navbar.style.borderBottom = "1px solid rgba(255,255,255,0.08)";
  }
});


// MOBILE MENU
const toggle = document.getElementById('menuToggle');
const nav = document.getElementById('navMenu');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    toggle.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove('active');
      toggle.classList.remove('open');
    }
  });

  document.querySelectorAll('#navMenu a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      toggle.classList.remove('open');
    });
  });
}

// CONTACT FORM
const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactStatus');

if (contactForm && contactStatus) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const payload = {
      subject: String(formData.get('subject') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      message: String(formData.get('message') || '').trim()
    };

    if (!payload.subject || !payload.email || !payload.message) {
      contactStatus.textContent = 'Please fill out all fields before sending.';
      contactStatus.className = 'contact-status error';
      return;
    }

    contactStatus.textContent = 'Sending...';
    contactStatus.className = 'contact-status';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      contactStatus.textContent = 'Message sent successfully. We will reply soon.';
      contactStatus.className = 'contact-status success';
      contactForm.reset();
    } catch (error) {
      contactStatus.textContent = 'Could not send message right now. Please try again shortly.';
      contactStatus.className = 'contact-status error';
    }
  });
}
