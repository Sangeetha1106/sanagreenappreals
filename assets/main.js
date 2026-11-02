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

  // Interactive Product filter tabs with URL parameter support
  var chips = document.querySelectorAll(".chip[data-filter]");
  var catalogItems = document.querySelectorAll(".item");

  function applyCategoryFilter(filterVal) {
    chips.forEach(function (c) {
      var isActive = c.getAttribute("data-filter") === filterVal;
      c.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    catalogItems.forEach(function (item) {
      var itemCat = item.getAttribute("data-cat");
      var match = filterVal === "all" || itemCat === filterVal;
      if (match) {
        item.hidden = false;
        item.style.animation = "none";
        void item.offsetWidth; // Trigger reflow for re-animation
        item.style.animation = "heroTextIn 0.35s ease both";
      } else {
        item.hidden = true;
      }
    });
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var filterVal = chip.getAttribute("data-filter");
      applyCategoryFilter(filterVal);
    });
  });

  // Check URL param for initial category filter on products page
  var urlParams = new URLSearchParams(window.location.search);
  var initialCat = urlParams.get("category") || urlParams.get("cat");
  if (initialCat) {
    var matchedChip = document.querySelector('.chip[data-filter="' + initialCat + '"]');
    if (matchedChip) {
      applyCategoryFilter(initialCat);
      setTimeout(function () {
        var catalogEl = document.querySelector(".catalog") || document.querySelector(".filters");
        if (catalogEl) {
          catalogEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 200);
    }
  }

  // Product Details Modal
  var modalBackdrop = document.getElementById("product-modal");
  var modalCloseBtn = document.getElementById("modal-close");
  var modalTitle = document.getElementById("modal-title");
  var modalCat = document.getElementById("modal-category");
  var modalImg = document.getElementById("modal-img");
  var modalDesc = document.getElementById("modal-desc");
  var modalFabric = document.getElementById("modal-fabric");
  var modalColors = document.getElementById("modal-colors");
  var modalSizes = document.getElementById("modal-sizes");
  var modalMoq = document.getElementById("modal-moq");
  var modalWaBtn = document.getElementById("modal-wa-btn");
  var modalMailBtn = document.getElementById("modal-mail-btn");

  function openProductModal(btn) {
    if (!modalBackdrop) return;
    var title = btn.getAttribute("data-title") || "Garment Product";
    var cat = btn.getAttribute("data-cat-name") || "Apparel";
    var img = btn.getAttribute("data-img") || "assets/collection.jpg";
    var desc = btn.getAttribute("data-desc") || "";
    var fabric = btn.getAttribute("data-fabric") || "100% Cotton / Custom blend";
    var colors = btn.getAttribute("data-colors") || "Assorted buyer shades";
    var sizes = btn.getAttribute("data-sizes") || "S, M, L, XL, XXL";
    var moq = btn.getAttribute("data-moq") || "Bulk & custom batches on request";

    if (modalTitle) modalTitle.textContent = title;
    if (modalCat) modalCat.textContent = cat;
    if (modalImg) {
      modalImg.src = img;
      modalImg.alt = title;
    }
    if (modalDesc) modalDesc.textContent = desc;
    if (modalFabric) modalFabric.textContent = fabric;
    if (modalColors) modalColors.textContent = colors;
    if (modalSizes) modalSizes.textContent = sizes;
    if (modalMoq) modalMoq.textContent = moq;

    var waMsg = "Hello Sana Green Apparels, I would like to enquire about bulk order for: " + title + " (" + cat + ").\nFabric: " + fabric + "\nCould you share pricing and turnaround details?";
    if (modalWaBtn) {
      modalWaBtn.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(waMsg);
    }
    if (modalMailBtn) {
      modalMailBtn.href = "mailto:sanagreenapparels@gmail.com?subject=" + encodeURIComponent("Bulk Enquiry: " + title) + "&body=" + encodeURIComponent(waMsg);
    }

    modalBackdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeProductModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove("active");
    document.body.style.overflow = "";
  }

  document.addEventListener("click", function (e) {
    var detailBtn = e.target.closest("[data-detail-trigger]");
    if (detailBtn) {
      e.preventDefault();
      openProductModal(detailBtn);
    }
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeProductModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", function (e) {
      if (e.target === modalBackdrop) {
        closeProductModal();
      }
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modalBackdrop && modalBackdrop.classList.contains("active")) {
      closeProductModal();
    }
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

  // 3-Image Full-Width Hero Slider
  var slider = document.getElementById("hero-slider");
  if (slider) {
    var slides = slider.querySelectorAll(".hero-slide");
    var dots = slider.querySelectorAll(".slider-dots .dot");
    var prevBtn = document.getElementById("slider-prev");
    var nextBtn = document.getElementById("slider-next");
    var currentIndex = 0;
    var slideInterval = null;
    var autoPlayDelay = 5000; // 5-second automatic slide rotation

    function goToSlide(index) {
      if (!slides.length) return;
      if (index >= slides.length) {
        currentIndex = 0; // Loop back to Slide 1
      } else if (index < 0) {
        currentIndex = slides.length - 1; // Loop back to Slide 3
      } else {
        currentIndex = index;
      }

      slides.forEach(function (slide, idx) {
        var isActive = idx === currentIndex;
        slide.classList.toggle("active", isActive);
        slide.setAttribute("aria-hidden", isActive ? "false" : "true");
      });

      dots.forEach(function (dot, idx) {
        var isActive = idx === currentIndex;
        dot.classList.toggle("active", isActive);
        dot.setAttribute("aria-selected", isActive ? "true" : "false");
      });
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    function startAutoPlay() {
      stopAutoPlay();
      slideInterval = setInterval(nextSlide, autoPlayDelay);
    }

    function stopAutoPlay() {
      if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
      }
    }

    // Manual controls: next / prev arrows
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        nextSlide();
        startAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        prevSlide();
        startAutoPlay();
      });
    }

    // Manual controls: pagination dots
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var targetIndex = parseInt(dot.getAttribute("data-index"), 10);
        if (!isNaN(targetIndex)) {
          goToSlide(targetIndex);
          startAutoPlay();
        }
      });
    });

    // Pause autoplay on mouse hover, resume on leave
    slider.addEventListener("mouseenter", stopAutoPlay);
    slider.addEventListener("mouseleave", startAutoPlay);

    // Keyboard navigation (ArrowLeft & ArrowRight)
    slider.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        prevSlide();
        startAutoPlay();
      } else if (e.key === "ArrowRight") {
        nextSlide();
        startAutoPlay();
      }
    });

    // Touch swipe support for mobile & tablet
    var touchStartX = 0;
    var touchEndX = 0;
    slider.addEventListener("touchstart", function (e) {
      if (e.touches && e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
      }
    }, { passive: true });

    slider.addEventListener("touchend", function (e) {
      if (e.changedTouches && e.changedTouches.length > 0) {
        touchEndX = e.changedTouches[0].clientX;
        var diffX = touchStartX - touchEndX;
        if (Math.abs(diffX) > 40) {
          if (diffX > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
          startAutoPlay();
        }
      }
    }, { passive: true });

    // Initialize first slide and start autoplay loop
    goToSlide(0);
    startAutoPlay();
  }

  // Dynamic footer year
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();


