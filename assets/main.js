document.documentElement.classList.add('js');
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav?.classList.contains('open')) {
    nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus();
  }
});
const search = document.querySelector('#publication-search');
const year = document.querySelector('#publication-year');
function filterPublications() {
  let count = 0;
  document.querySelectorAll('[data-publication]').forEach(item => {
    const match = item.textContent.toLowerCase().includes(search.value.toLowerCase().trim()) && (!year.value || item.dataset.year === year.value);
    item.hidden = !match; if (match) count++;
  });
  document.querySelector('#result-count').textContent = `${count} publication${count === 1 ? '' : 's'}`;
  document.querySelector('#no-results').hidden = count !== 0;
}
search?.addEventListener('input', filterPublications);
year?.addEventListener('change', filterPublications);

const photoCarousel = document.querySelector('[data-photo-carousel]');
if (photoCarousel) {
  const slides = Array.from(photoCarousel.querySelectorAll('.photo-slide'));
  const prev = photoCarousel.querySelector('.carousel-prev');
  const next = photoCarousel.querySelector('.carousel-next');
  let current = 0;
  let timer;

  const showSlide = index => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
  };

  const restartTimer = () => {
    window.clearInterval(timer);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      timer = window.setInterval(() => showSlide(current + 1), 7000);
    }
  };

  prev?.addEventListener('click', () => {
    showSlide(current - 1);
    restartTimer();
  });

  next?.addEventListener('click', () => {
    showSlide(current + 1);
    restartTimer();
  });

  showSlide(0);
  restartTimer();
}
