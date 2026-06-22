document.getElementById('year').textContent = new Date().getFullYear();

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => nav.classList.toggle('is-open'));
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('is-open')));
}

const revealTargets = document.querySelectorAll('.section, .service-card, .metric');
revealTargets.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.12 });

revealTargets.forEach(el => observer.observe(el));
