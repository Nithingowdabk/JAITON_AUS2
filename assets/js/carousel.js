/**
 * JAITON TECHNOLOGIES — Carousel & Marquee Module
 * Handles auto-sliding testimonial card stack & continuous logo marquee
 */

document.addEventListener('DOMContentLoaded', () => {
  // Testimonials Slider Logic
  const track = document.querySelector('.testimonials__track');
  const slides = document.querySelectorAll('.card--testimonial');
  const dotsContainer = document.querySelector('.testimonials__dots');

  if (track && slides.length > 0) {
    let currentIndex = 0;
    let autoSlideTimer = null;

    const prevBtn = document.querySelector('.testimonial-arrow-btn.prev-btn');
    const nextBtn = document.querySelector('.testimonial-arrow-btn.next-btn');

    // Build pagination dots dynamically
    if (dotsContainer) dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `testimonials__dot ${idx === 0 ? 'is-active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial slide ${idx + 1}`);
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer?.appendChild(dot);
    });

    const dots = document.querySelectorAll('.testimonials__dot');

    const updateSliderPosition = () => {
      const slideWidth = slides[0].offsetWidth + 24; // Card width + gap
      const maxIndex = slides.length - 1;
      if (currentIndex > maxIndex) currentIndex = 0;
      if (currentIndex < 0) currentIndex = maxIndex;

      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      
      dots.forEach((dot, idx) => {
        dot.classList.toggle('is-active', idx === currentIndex);
      });
    };

    const goToSlide = (index) => {
      currentIndex = index;
      if (currentIndex >= slides.length) currentIndex = 0;
      if (currentIndex < 0) currentIndex = slides.length - 1;
      updateSliderPosition();
      resetTimer();
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSliderPosition();
    };

    const startTimer = () => {
      autoSlideTimer = setInterval(nextSlide, 5000);
    };

    const resetTimer = () => {
      clearInterval(autoSlideTimer);
      startTimer();
    };

    prevBtn?.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
    });

    nextBtn?.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
    });

    // Pause auto-sliding on hover
    track.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
    track.addEventListener('mouseleave', startTimer);

    // Touch / Swipe support
    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      clearInterval(autoSlideTimer);
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 40) {
        if (diff > 0) nextSlide();
        else goToSlide(currentIndex - 1);
      }
      isDragging = false;
      startTimer();
    });

    window.addEventListener('resize', updateSliderPosition);
    startTimer();
  }

  // Desktop Mouse Drag-to-Scroll for Industries cards
  const indScroll = document.querySelector('.industries__scroll');
  if (indScroll) {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    indScroll.addEventListener('mousedown', (e) => {
      isDown = true;
      indScroll.classList.add('is-dragging');
      startX = e.pageX - indScroll.offsetLeft;
      scrollLeft = indScroll.scrollLeft;
    });

    const stopDragging = () => {
      if (!isDown) return;
      isDown = false;
      indScroll.classList.remove('is-dragging');
    };

    indScroll.addEventListener('mouseleave', stopDragging);
    indScroll.addEventListener('mouseup', stopDragging);

    indScroll.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - indScroll.offsetLeft;
      const walk = (x - startX) * 1.8; // scroll speed factor
      indScroll.scrollLeft = scrollLeft - walk;
    });
  }

  // Duplicate client marquee items for seamless infinite scroll
  const marqueeTracks = document.querySelectorAll('.marquee-track');
  marqueeTracks.forEach((mTrack) => {
    const children = Array.from(mTrack.children);
    children.forEach((item) => {
      const clone = item.cloneNode(true);
      mTrack.appendChild(clone);
    });
  });
});
