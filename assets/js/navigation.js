/**
 * JAITON TECHNOLOGIES — Navigation Module
 * Glass header scroll states, active link scroll spy, and mobile drawer menu
 */

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.site-nav');
  const hamburger = document.querySelector('.nav-hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu__link');
  const sections = document.querySelectorAll('section[id]');

  // Create mobile overlay element dynamically if not present
  let navOverlay = document.querySelector('.nav-overlay');
  if (!navOverlay) {
    navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);
  }

  // Handle header background & glass effect on scroll
  const handleScroll = () => {
    if (window.scrollY > 40) {
      nav?.classList.add('is-scrolled');
    } else {
      nav?.classList.remove('is-scrolled');
    }
    highlightActiveSection();
  };

  // Mobile Menu Toggle
  const toggleMobileMenu = (open) => {
    const shouldOpen = open !== undefined ? open : !navMenu?.classList.contains('is-open');
    hamburger?.classList.toggle('is-open', shouldOpen);
    navMenu?.classList.toggle('is-open', shouldOpen);
    navOverlay?.classList.toggle('is-visible', shouldOpen);
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  };

  hamburger?.addEventListener('click', () => toggleMobileMenu());
  navOverlay?.addEventListener('click', () => toggleMobileMenu(false));

  // Close mobile nav on link click
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      toggleMobileMenu(false);
    });
  });

  // Scroll Spy for Nav Links
  const highlightActiveSection = () => {
    const scrollY = window.pageYOffset;
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-menu__link[href*="${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((l) => l.classList.remove('is-active'));
        navLink?.classList.add('is-active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
});
