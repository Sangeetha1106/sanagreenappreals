(function () {
  "use strict";
  var WA = "919150621506";

  // Mark JS as ready for smooth transitions
  document.documentElement.classList.add("js-ready");

  // Top reading scroll progress bar
  var progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  progressBar.setAttribute("aria-hidden", "true");
  document.body.prepend(progressBar);

  function updateScrollProgress() {
    var winScroll = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var pct = docHeight > 0 ? Math.min(100, Math.max(0, (winScroll / docHeight) * 100)) : 0;
    progressBar.style.width = pct + "%";
  }
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  updateScrollProgress();

  // Sticky header state
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 12);
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu with drawer & accessibility
  var menuBtn = document.querySelector(".menu-btn");
  var siteNav = document.getElementById("site-nav");

  if (menuBtn && siteNav) {
    function toggleNav(open) {
      var isOpen = typeof open === "boolean" ? open : !siteNav.classList.contains("open");
      siteNav.classList.toggle("open", isOpen);
      menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      var useTag = menuBtn.querySelector("use");
      if (useTag) {
        useTag.setAttribute("href", isOpen ? "#i-x" : "#i-menu");
      }
    }

    menuBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleNav();
    });

    // Close when clicking a link
    siteNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        toggleNav(false);
      }
    });

    // Close when clicking outside
    document.addEventListener("click", function (e) {
      if (siteNav.classList.contains("open") && !siteNav.contains(e.target) && !menuBtn.contains(e.target)) {
        toggleNav(false);
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && siteNav.classList.contains("open")) {
        toggleNav(false);
        menuBtn.focus();
      }
    });
  }

  // Smooth & 100% reliable scroll reveal
  var revealElements = document.querySelectorAll(".reveal");

  function revealAll() {
    revealElements.forEach(function (el) {
      el.classList.add("in");
    });
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, {
      rootMargin: "250px 0px 250px 0px", // Pre-trigger well before entering viewport
      threshold: 0
    });

    revealElements.forEach(function (el) {
      io.observe(el);
    });

    // Scroll listener backup check
    window.addEventListener("scroll", function () {
      revealElements.forEach(function (el) {
        if (!el.classList.contains("in")) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight + 250) {
            el.classList.add("in");
            io.unobserve(el);
          }
        }
      });
    }, { passive: true });

    // Fast fallback safety timer: ensure everything is visible smoothly within 500ms
    setTimeout(revealAll, 500);
  } else {
    revealAll();
  }

  // Interactive Product filter tabs
  var chips = document.querySelectorAll(".chip[data-filter]");
  var catalogItems = document.querySelectorAll(".item");

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) {
        c.setAttribute("aria-pressed", "false");
      });
      chip.setAttribute("aria-pressed", "true");
      var filterVal = chip.getAttribute("data-filter");

      catalogItems.forEach(function (item) {
        var match = filterVal === "all" || item.getAttribute("data-cat") === filterVal;
        if (match) {
          item.hidden = false;
          item.style.animation = "none";
          void item.offsetWidth; // Trigger reflow for re-animation
          item.style.animation = "heroTextIn 0.35s ease both";
        } else {
          item.hidden = true;
        }
      });
    });
  });

  // Direct Enquiry form -> WhatsApp
  var form = document.getElementById("enquiry-form");
  if (form) {
    var params = new URLSearchParams(window.location.search);
    if (params.get("product") && form.product) {
      form.product.value = params.get("product");
    }

    function buildEnquiryText() {
      var d = new FormData(form);
      var lines = [
        "Hello Sana Green Apparels,",
        "I would like to make an enquiry.",
        "",
        "Name: " + (d.get("name") || "-"),
        "Phone: " + (d.get("phone") || "-"),
        "Product: " + (d.get("product") || "-"),
        "Approx. quantity: " + (d.get("qty") || "-"),
        "Details: " + (d.get("message") || "-")
      ];
      return lines.join("\n");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(buildEnquiryText()), "_blank", "noopener");
    });

    var mailBtn = document.getElementById("send-mail");
    if (mailBtn) {
      mailBtn.addEventListener("click", function () {
        if (!form.reportValidity()) return;
        window.location.href = "mailto:sanagreenapparels@gmail.com?subject=" + encodeURIComponent("Enquiry — Sana Green Apparels") + "&body=" + encodeURIComponent(buildEnquiryText());
      });
    }
  }

  // Dynamic footer year
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
