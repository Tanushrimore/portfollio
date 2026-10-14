/**
 * Portfolio JavaScript
 * Features:
 * - Theme Switcher (Light / Dark mode with localStorage persistence)
 * - Mobile Navigation Menu Toggle
 * - Active Navigation Link Tracking (IntersectionObserver)
 * - Project Filter by Category
 * - Contact Form Validation & Simulated Submission
 * - Copy Email to Clipboard with Toast Tooltip
 * - Dynamic Footer Copyright Year
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initActiveNavTracking();
  initProjectFiltering();
  initContactForm();
  initCopyEmail();
  initDynamicYear();
});

/* ==========================================================================
   1. Theme Switcher (Light Mode default as requested)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or default to 'light'
  const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
    });
  }
}

/* ==========================================================================
   2. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!mobileBtn || !mobileNav) return;

  function toggleMenu() {
    const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
    mobileBtn.setAttribute('aria-expanded', String(!isExpanded));
    mobileNav.setAttribute('aria-hidden', String(isExpanded));
    mobileNav.classList.toggle('open', !isExpanded);
  }

  function closeMenu() {
    mobileBtn.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    mobileNav.classList.remove('open');
  }

  mobileBtn.addEventListener('click', toggleMenu);

  // Close drawer on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close when clicking outside header
  document.addEventListener('click', (e) => {
    const header = document.getElementById('header');
    if (header && !header.contains(e.target) && mobileNav.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   3. Active Navigation Link Tracking (Scroll Spy)
   ========================================================================== */
function initActiveNavTracking() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   4. Project Category Filtering
   ========================================================================== */
function initProjectFiltering() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   5. Interactive Contact Form with Validation
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const feedbackBox = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Name check
    const nameError = document.getElementById('name-error');
    if (!nameInput.value.trim()) {
      nameError.classList.add('visible');
      isValid = false;
    } else {
      nameError.classList.remove('visible');
    }

    // Email check
    const emailError = document.getElementById('email-error');
    if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
      emailError.classList.add('visible');
      isValid = false;
    } else {
      emailError.classList.remove('visible');
    }

    // Message check
    const messageError = document.getElementById('message-error');
    if (!messageInput.value.trim()) {
      messageError.classList.add('visible');
      isValid = false;
    } else {
      messageError.classList.remove('visible');
    }

    if (!isValid) return;

    // Simulate sending
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending Message...</span>';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      feedbackBox.className = 'form-feedback success';
      feedbackBox.textContent = `Thank you, ${nameInput.value.trim()}! Your message has been sent successfully. I will get back to you shortly.`;
      
      form.reset();

      // Clear success feedback after 6 seconds
      setTimeout(() => {
        feedbackBox.style.display = 'none';
        feedbackBox.className = 'form-feedback';
      }, 6000);
    }, 1000);
  });
}

/* ==========================================================================
   6. Copy Email with Toast Feedback
   ========================================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const emailElem = document.getElementById('email-address');
  const tooltip = document.getElementById('copy-tooltip');

  if (!copyBtn || !emailElem || !tooltip) return;

  copyBtn.addEventListener('click', async () => {
    const emailToCopy = emailElem.textContent.trim();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailToCopy);
      } else {
        // Fallback for non-https contexts
        const tempInput = document.createElement('input');
        tempInput.value = emailToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      tooltip.classList.add('show');
      setTimeout(() => {
        tooltip.classList.remove('show');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy email: ', err);
    }
  });
}

/* ==========================================================================
   7. Dynamic Footer Year
   ========================================================================== */
function initDynamicYear() {
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
}
