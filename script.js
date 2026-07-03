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


const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
if (heroSlides.length > 1) {
  let heroIndex = 0;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const showHeroSlide = (nextIndex) => {
    heroSlides[heroIndex].classList.remove('is-active');
    heroIndex = nextIndex;
    heroSlides[heroIndex].classList.add('is-active');
  };
  if (!prefersReducedMotion) {
    setInterval(() => {
      const nextIndex = (heroIndex + 1) % heroSlides.length;
      showHeroSlide(nextIndex);
    }, 5500);
  }
}
