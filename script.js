// ===== Scroll-triggered animations =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });
document.querySelectorAll('.content').forEach(el => observer.observe(el));

// ===== Parallax background scroll =====
const parallaxElements = document.querySelectorAll('.parallax');
window.addEventListener('scroll', () => {
  parallaxElements.forEach(el => {
    let offset = window.scrollY;
    el.style.backgroundPositionY = offset * 0.5 + 'px';
  });
});

// ===== Navbar show/hide =====
const navbar = document.getElementById('navbar');
const scrollSection = document.getElementById('scrollSection');
window.addEventListener('scroll', () => {
  if (window.scrollY >= scrollSection.offsetTop) {
    navbar.classList.add('show');
  } else {
    navbar.classList.remove('show');
  }
});

// ===== Floating background elements =====
const totalElements = 30;
for (let i = 0; i < totalElements; i++) {
  const el = document.createElement('div');
  el.classList.add('background-element');
  el.style.width = 5 + Math.random() * 15 + 'px';
  el.style.height = el.style.width;
  el.style.top = Math.random() * 100 + 'vh';
  el.style.left = Math.random() * 100 + 'vw';
  el.style.animationDuration = 5 + Math.random() * 10 + 's';
  el.style.animationDelay = Math.random() * 5 + 's';
  document.body.appendChild(el);
}
