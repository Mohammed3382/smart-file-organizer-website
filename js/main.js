/* ============================================================
   Smart File Organizer — Website Scripts
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // -------------------------------------------------------
  // Theme toggle (dark / light)
  // -------------------------------------------------------
  var themeToggle = document.getElementById('themeToggle');
  var root = document.documentElement;

  // Load saved preference or default to dark
  var savedTheme = localStorage.getItem('sfo-theme') || 'dark';
  root.setAttribute('data-theme', savedTheme);
  updateThemedImages(savedTheme);

  themeToggle.addEventListener('click', function () {
    var current = root.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('sfo-theme', next);
    updateThemedImages(next);
  });

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

  if (navToggle) {
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
  // Smooth scroll for anchor links
  // -------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = navbar.offsetHeight + 16;
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
    '.feature-card, .showcase-block, .story-value-card, .download-box, .faq-item'
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
  var sections = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.navbar-links a:not(.btn)');

  function highlightNav() {
    var scrollPos = window.scrollY + navbar.offsetHeight + 100;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navAnchors.forEach(function (a) { a.style.color = ''; });
        var active = document.querySelector('.navbar-links a[href="#' + id + '"]');
        if (active && !active.classList.contains('btn')) {
          active.style.color = 'var(--text)';
        }
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

});
