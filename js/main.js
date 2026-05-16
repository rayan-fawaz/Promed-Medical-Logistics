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

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function clearFieldErrors(form) {
    form.querySelectorAll('.field-error').forEach((el) => {
      el.textContent = '';
      el.classList.remove('is-visible');
    });
    form.querySelectorAll('.input-invalid').forEach((el) => {
      el.classList.remove('input-invalid');
    });
  }

  function showFieldError(inputId, message) {
    const input = document.getElementById(inputId);
    const err = document.getElementById(`${inputId}-error`);
    if (input) input.classList.add('input-invalid');
    if (err) {
      err.textContent = message;
      err.classList.add('is-visible');
    }
  }

  function isNetlifyFormsHost() {
    if (location.protocol === 'file:') return false;
    const h = location.hostname;
    return h !== 'localhost' && h !== '127.0.0.1';
  }

  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    const successMsg = document.getElementById('formSuccess');
    const networkErr = document.getElementById('formNetworkError');
    const submitBtn = quoteForm.querySelector('button[type="submit"]');

    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFieldErrors(quoteForm);
      const localNote = document.getElementById('formLocalNote');
      if (localNote) localNote.style.display = 'none';
      if (networkErr) {
        networkErr.textContent = '';
        networkErr.classList.remove('is-visible');
      }

      const fullName = (document.getElementById('full_name')?.value ?? '').trim();
      const email = (document.getElementById('email')?.value ?? '').trim();
      const phone = (document.getElementById('phone')?.value ?? '').trim();
      const serviceInterest = document.getElementById('service_interest')?.value ?? '';

      let ok = true;
      if (!fullName) {
        showFieldError('full_name', 'Please enter your name.');
        ok = false;
      }
      if (!email) {
        showFieldError('email', 'Please enter your email address.');
        ok = false;
      } else if (!EMAIL_RE.test(email)) {
        showFieldError('email', 'Please enter a valid email address.');
        ok = false;
      }
      if (!phone) {
        showFieldError('phone', 'Please enter your phone number.');
        ok = false;
      }
      if (!serviceInterest) {
        showFieldError('service_interest', 'Please select a service.');
        ok = false;
      }

      if (!ok) return;

      if (!isNetlifyFormsHost()) {
        if (successMsg) {
          quoteForm.style.display = 'none';
          successMsg.style.display = 'block';
        }
        if (localNote) localNote.style.display = 'block';
        return;
      }

      if (submitBtn) submitBtn.disabled = true;

      try {
        const body = new URLSearchParams(new FormData(quoteForm)).toString();
        const formAction = quoteForm.getAttribute('action') || '/';
        const res = await fetch(formAction, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body
        });

        if (!res.ok) throw new Error('Network error');

        if (successMsg) {
          quoteForm.style.display = 'none';
          successMsg.style.display = 'block';
        }
        if (localNote) localNote.style.display = 'none';
      } catch {
        if (networkErr) {
          networkErr.textContent =
            'Something went wrong. Please email promedmedicallogistics@gmail.com or call 613-862-6108.';
          networkErr.classList.add('is-visible');
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
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
