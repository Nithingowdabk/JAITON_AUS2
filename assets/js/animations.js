/**
 * JAITON TECHNOLOGIES — Animations & Scroll Observer
 * Handles scroll reveal animations, numeric counter increments, process timeline fills, and card stacking
 */

document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for Scroll Reveals
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.05
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        
        // Trigger counter animation if element has counter logic
        if (entry.target.classList.contains('counter-trigger')) {
          animateCounters(entry.target);
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach((el) => scrollObserver.observe(el));

  // Fallback: Make elements visible immediately if already in top viewport
  setTimeout(() => {
    animateElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('is-visible');
      }
    });
  }, 100);

  // Counter Incrementation Logic
  function animateCounters(container) {
    const counters = container.querySelectorAll('[data-target]');
    counters.forEach((counter) => {
      const target = +counter.getAttribute('data-target');
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000; // ms
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        // Ease out quadratic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(easeProgress * target);

        counter.textContent = `${prefix}${currentValue.toLocaleString()}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  }

  // Observe counters
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters(entry.target.parentElement || entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.stat-counter-group, .about__counters').forEach((el) => {
    counterObserver.observe(el);
  });

  // Delivery Process Timeline Active Step Observer
  const timelineSteps = document.querySelectorAll('.timeline-step');
  if (timelineSteps.length > 0) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-active');
        }
      });
    }, { threshold: 0.5 });

    timelineSteps.forEach((step) => timelineObserver.observe(step));
  }

  // Sticky Stacking Cards parallax scale effect for Case Studies
  const caseCards = document.querySelectorAll('.card--case-study');
  if (caseCards.length > 1) {
    const handleStackingCards = () => {
      caseCards.forEach((card, index) => {
        const nextCard = caseCards[index + 1];
        if (nextCard) {
          const rect = nextCard.getBoundingClientRect();
          const cardTop = card.getBoundingClientRect().top;
          
          // Trigger scale down when next card overlaps
          if (rect.top <= cardTop + 240) {
            const progress = Math.max(0, Math.min(1, (cardTop + 240 - rect.top) / 300));
            const scale = 1 - progress * 0.05;
            const opacity = 1 - progress * 0.25;
            card.style.transform = `scale(${scale})`;
            card.style.opacity = `${opacity}`;
          } else {
            card.style.transform = `scale(1)`;
            card.style.opacity = `1`;
          }
        }
      });
    };

    window.addEventListener('scroll', handleStackingCards, { passive: true });
    handleStackingCards();
  }
});
