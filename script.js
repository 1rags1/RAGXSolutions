document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = `${index * 0.08}s`;
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

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