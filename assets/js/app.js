/**
 * JAITON TECHNOLOGIES — Main Application Entry Point
 * Coordinates application initialization, interactive form states & global utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Jaiton Technologies Enterprise Application Initialized');

  // Contact Form Submission Handler (UI Simulation)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing Request...';

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Strategy Session Requested!';
        submitBtn.style.background = '#22C55E';

        setTimeout(() => {
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
        }, 4000);
      }, 1500);
    });
  }

  // Newsletter Form Handler
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input && input.value) {
        alert('Thank you for subscribing to Jaiton Enterprise Insights.');
        input.value = '';
      }
    });
  }
});
