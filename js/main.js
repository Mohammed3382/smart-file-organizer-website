/* ============================================================
   Smart File Organizer — Website Scripts
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // -------------------------------------------------------
  // Theme toggle (dark / light)
  // -------------------------------------------------------
  var themeToggle = document.getElementById('themeToggle');
  var root = document.documentElement;

  var savedTheme = localStorage.getItem('sfo-theme') || 'dark';
  root.setAttribute('data-theme', savedTheme);
  updateThemedImages(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('sfo-theme', next);
      updateThemedImages(next);
    });
  }

  function updateThemedImages(theme) {
    var images = document.querySelectorAll('.themed-img');
    images.forEach(function (img) {
      var src = theme === 'dark' ? img.getAttribute('data-dark') : img.getAttribute('data-light');
      if (src && img.src !== src) {
        img.src = src;
      }
    });
  }

  // -------------------------------------------------------
  // Navbar scroll effect
  // -------------------------------------------------------
  var navbar = document.getElementById('navbar');

  function updateNavbar() {
    if (window.scrollY > 16) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // -------------------------------------------------------
  // Mobile menu toggle
  // -------------------------------------------------------
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // -------------------------------------------------------
  // Smooth scroll for same-page anchor links
  // -------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = navbar ? navbar.offsetHeight + 16 : 80;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // -------------------------------------------------------
  // FAQ accordion
  // -------------------------------------------------------
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = this.closest('.faq-item');
      var wasOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item').forEach(function (el) {
        el.classList.remove('open');
      });

      if (!wasOpen) {
        item.classList.add('open');
      }
    });
  });

  // -------------------------------------------------------
  // Scroll-triggered fade-in animations
  // -------------------------------------------------------
  var animatedElements = document.querySelectorAll(
    '.feature-card, .showcase-block, .story-value-card, .download-box, .faq-item, .feedback-channel'
  );

  animatedElements.forEach(function (el) {
    el.classList.add('fade-in');
  });

  function checkVisibility() {
    var windowHeight = window.innerHeight;
    animatedElements.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < windowHeight - 60) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', checkVisibility, { passive: true });
  checkVisibility();

  // -------------------------------------------------------
  // Feedback form
  // -------------------------------------------------------
  var feedbackForm = document.getElementById('feedbackForm');
  var feedbackSuccess = document.getElementById('feedbackSuccess');
  var feedbackReset = document.getElementById('feedbackReset');

  if (feedbackForm) {
    feedbackForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Collect form data
      var formData = new FormData(feedbackForm);
      var data = {};
      formData.forEach(function (value, key) {
        data[key] = value;
      });

      // For now, create a GitHub issue via mailto fallback
      // since we don't have a form backend yet
      var subject = encodeURIComponent('[Feedback] ' + (data.subject || 'User Feedback'));
      var body = encodeURIComponent(
        'Type: ' + (data.type || 'general') + '\n' +
        'Name: ' + (data.name || 'Anonymous') + '\n' +
        'Email: ' + (data.email || 'Not provided') + '\n\n' +
        (data.message || '')
      );

      // Open email with pre-filled data
      window.location.href = 'mailto:mohdbibo22@gmail.com?subject=' + subject + '&body=' + body;

      // Show success state
      feedbackForm.hidden = true;
      feedbackSuccess.hidden = false;
    });
  }

  if (feedbackReset) {
    feedbackReset.addEventListener('click', function () {
      feedbackForm.reset();
      feedbackForm.hidden = false;
      feedbackSuccess.hidden = true;
    });
  }

  // -------------------------------------------------------
  // Active nav link highlighting (index page only)
  // -------------------------------------------------------
  var sections = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.navbar-links a:not(.btn-download-nav)');

  if (sections.length > 1) {
    function highlightNav() {
      var scrollPos = window.scrollY + (navbar ? navbar.offsetHeight : 60) + 100;

      sections.forEach(function (section) {
        var top = section.offsetTop;
        var height = section.offsetHeight;
        var id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navAnchors.forEach(function (a) { a.style.color = ''; });
          var active = document.querySelector('.navbar-links a[href="#' + id + '"]');
          if (active) {
            active.style.color = 'var(--text)';
          }
        }
      });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });
  }

});
