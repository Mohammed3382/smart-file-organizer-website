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
  // Active nav link highlighting
  // -------------------------------------------------------
  var allNavLinks = document.querySelectorAll('.navbar-links a');
  var sections = document.querySelectorAll('section[id]');

  function clearNavActive() {
    allNavLinks.forEach(function (a) {
      a.classList.remove('nav-active');
    });
  }

  // On scroll, highlight the nav link matching the visible section
  if (sections.length > 1) {
    function highlightNav() {
      var scrollPos = window.scrollY + (navbar ? navbar.offsetHeight : 60) + 120;
      var found = false;

      // Walk sections bottom-up so deeper sections win
      for (var i = sections.length - 1; i >= 0; i--) {
        var section = sections[i];
        var top = section.offsetTop;
        var bottom = top + section.offsetHeight;
        var id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < bottom) {
          clearNavActive();
          var match = document.querySelector('.navbar-links a[href="#' + id + '"]');
          if (match) {
            match.classList.add('nav-active');
          }
          found = true;
          break;
        }
      }

      // If scrolled past all sections or at top, clear everything
      if (!found) {
        clearNavActive();
      }
    }

    window.addEventListener('scroll', highlightNav, { passive: true });
    highlightNav();
  }

  // -------------------------------------------------------
  // Feedback form — real submission via FormSubmit.co
  // -------------------------------------------------------
  var feedbackForm = document.getElementById('feedbackForm');
  var feedbackSuccess = document.getElementById('feedbackSuccess');
  var feedbackReset = document.getElementById('feedbackReset');

  if (feedbackForm) {
    feedbackForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = feedbackForm.querySelector('.feedback-submit');
      var originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" class="spin"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="2" stroke-dasharray="30 14" stroke-linecap="round"/></svg> Sending...';

      var formData = new FormData(feedbackForm);

      fetch(feedbackForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(function (response) {
        if (response.ok) {
          feedbackForm.hidden = true;
          feedbackSuccess.hidden = false;
        } else {
          throw new Error('Submission failed');
        }
      })
      .catch(function () {
        // Fallback: open mailto with pre-filled data
        var data = {};
        formData.forEach(function (value, key) {
          if (!key.startsWith('_')) data[key] = value;
        });
        var subject = encodeURIComponent('[Feedback] ' + (data.subject || 'User Feedback'));
        var body = encodeURIComponent(
          'Type: ' + (data.type || 'general') + '\n' +
          'Name: ' + (data.name || 'Anonymous') + '\n' +
          'Email: ' + (data.email || 'Not provided') + '\n\n' +
          (data.message || '')
        );
        window.location.href = 'mailto:mohdbibo22@gmail.com?subject=' + subject + '&body=' + body;
        feedbackForm.hidden = true;
        feedbackSuccess.hidden = false;
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      });
    });
  }

  if (feedbackReset) {
    feedbackReset.addEventListener('click', function () {
      feedbackForm.reset();
      feedbackForm.hidden = false;
      feedbackSuccess.hidden = true;
    });
  }

});
