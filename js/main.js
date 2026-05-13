// Promed Medical Logistics — main.js

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Scroll-triggered nav shadow
  const nav = document.querySelector('.nav');
  if (nav) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 20) {
        nav.style.boxShadow = '0 2px 12px rgba(10, 37, 64, 0.08)';
      } else {
        nav.style.boxShadow = 'none';
      }
      lastScroll = currentScroll;
    });
  }

  // Intersection observer for scroll-fade animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Apply to service cards and similar
  document.querySelectorAll('.service-card, .process-step, .coverage-stat, .tech-feature').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.05}s, transform 0.6s ease ${i * 0.05}s`;
    fadeObserver.observe(el);
  });

  // Form submission (placeholder — replace with real endpoint)
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(quoteForm);
      const data = Object.fromEntries(formData);

      // Show success message
      const successMsg = document.getElementById('formSuccess');
      if (successMsg) {
        quoteForm.style.display = 'none';
        successMsg.style.display = 'block';
      }

      console.log('Quote request:', data);
      // In production: send to your backend / Formspree / Netlify Forms / etc.
    });
  }

  // FAQ accordion (for technology/services pages)
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        item.classList.toggle('open');
      });
    }
  });
});
