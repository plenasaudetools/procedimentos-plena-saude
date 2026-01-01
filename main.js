/* GSAP ScrollTrigger Logic */
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

  // 0. FLOATING HEADER LOGIC
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // LOGO CLICK TO TOP
  const logoLink = document.querySelector('.logo');
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 1. HORIZONTAL SCROLL FOR CLINICAL SECTION (Desktop Only)
  // 1. HORIZONTAL SCROLL FOR CLINICAL SECTION (Responsive)
  const raceContainer = document.querySelector(".clinical-track-wrapper");
  const race = document.querySelector(".clinical-track");

  if (raceContainer && race) {
    function getScrollAmount() {
      let raceWidth = race.scrollWidth;
      // Adjusted offset calculation for mobile vs desktop
      if (window.innerWidth <= 1024) {
        // Mobile offset
        return -(raceWidth - window.innerWidth + 20);
      }
      return -(raceWidth - window.innerWidth + 100);
    }

    // Determine scroll distance based on device to control speed feel
    const isMobile = window.innerWidth <= 1024;
    // Mobile needs MORE vertical scroll to cover the horizontal width comfortably
    const scrollDistance = isMobile ? "+=4500" : "+=3500";

    // Dynamic horizontal scroll with friction
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".clinical-section-pin",
        start: "top top",
        end: scrollDistance,
        pin: true,
        anticipatePin: 1, // Smooths out pinning transition
        scrub: 1, // Smooth interaction
        invalidateOnRefresh: true, // Recalculate on resize
      }
    });

    tl.to(race, {
      x: () => getScrollAmount(), // Function ensures recalculation if dimensions change
      ease: "power2.out", // Starts elegant/fast, ends with strong resistance (friction)
      duration: 1
    });

    // Sync Progress Bar (Universal)
    tl.to(".clinical-progress-fill-bar", {
      width: "100%",
      ease: "none"
    }, "<");
  }

  // Mobile Progress Bar Logic (Native Scroll)
  const trackWrapper = document.querySelector(".clinical-track-wrapper");
  const progressBar = document.querySelector(".clinical-progress-fill-bar");

  if (trackWrapper && progressBar) {
    trackWrapper.addEventListener("scroll", () => {
      const maxScroll = trackWrapper.scrollWidth - trackWrapper.clientWidth;
      if (maxScroll > 0) {
        const currentScroll = trackWrapper.scrollLeft;
        const progress = (currentScroll / maxScroll) * 100;
        progressBar.style.width = `${progress}%`;
      }
    });
  }

  // 2. TIMELINE ANIMATION for CYCLE SECTION (Scene 2)
  // Animation  // A. Main Vertical Line Filling Up
  gsap.to(".cycle-progress-fill", {
    height: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: ".cycle-steps-wrapper",
      start: "top 70%", // Start earlier
      end: "bottom 85%", // Ensure it finishes while visible
      scrub: true
    }
  });

  // Animation for individual steps lighting up
  const steps = document.querySelectorAll('.cycle-step-item');
  steps.forEach(step => {
    ScrollTrigger.create({
      trigger: step,
      start: "top 80%", // Light up sooner as they appear
      onEnter: () => step.classList.add('active'),
      onLeaveBack: () => step.classList.remove('active'),
    });
  });


  // 3. COMPLEMENTARY SECTION MOBILE INTERACTION
  const accItems = document.querySelectorAll('.acc-item');
  accItems.forEach(item => {
    item.addEventListener('click', () => {
      // If already active, toggle off? Or allow close. Let's allowing closing.
      const isActive = item.classList.contains('active');

      // Close all first (Accordion behavior)
      accItems.forEach(i => i.classList.remove('active'));

      // If it wasn't active, open it
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 4. FACIAL INTERACTION (Liquid Removed)
  const facialItems = document.querySelectorAll('.editorial-item');
  const facialBgs = document.querySelectorAll('.facial-bg-img');

  if (facialItems.length > 0) {
    facialItems.forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        // Standard State Management
        facialItems.forEach(i => i.classList.remove('mobile-active'));
        item.classList.add('mobile-active');

        // Image Swap logic
        facialBgs.forEach(bg => bg.classList.remove('active'));
        if (facialBgs[index]) {
          facialBgs[index].classList.add('active');
        }
      }); // Close item.addEventListener
    }); // Close facialItems.forEach
  }

  // 5. GLOBAL REVEAL ANIMATIONS (Staggered Fade Up)
  const rawElements = document.querySelectorAll("h2, h3, p:not(.hero-sub-text), .cta-group:not(.hero-footer-aligned .cta-group), .glass-card, .service-block, .footer-col");

  // Filter out sensitive sections to prevent layout breaks
  const revealElements = Array.from(rawElements).filter(el => {
    // Exclude Authority Section (Fix for broken layout)
    if (el.closest('.team-authority')) return false;
    // Exclude Editorial Items (Fix for entrance effect)
    if (el.classList.contains('editorial-item-title') || el.classList.contains('editorial-item-desc')) return false;
    return true;
  });

  // Use ScrollTrigger batch for better performance with many elements
  ScrollTrigger.batch(revealElements, {
    start: "top 85%",
    onEnter: batch => gsap.from(batch, {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
      overwrite: true
    }),
    // Optional: Only animate once
    once: true
  });

  // Specific Hero Animation (Load immediately)
  const heroTl = gsap.timeline();
  heroTl.from(".hero-title", { opacity: 0, y: 50, duration: 1, ease: "power3.out" })
    .from(".hero-sub-text", { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" }, "-=0.6")
    .from(".cta-explore-row", { opacity: 0, scale: 0.9, duration: 0.6, ease: "back.out(1.7)" }, "-=0.4");

}); // Close DOMContentLoaded

// LIGHTBOX LOGIC
function openLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  img.src = src;
  lightbox.classList.add('active');

  // Pause carousel animation when lightbox is open
  const track = document.querySelector('.atelier-track');
  if (track) track.style.animationPlayState = 'paused';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');

  // Resume carousel
  const track = document.querySelector('.atelier-track');
  if (track) track.style.animationPlayState = 'running';
}

// TECHNICAL LUXURY COOKIE MANAGEMENT
document.addEventListener('DOMContentLoaded', () => {
  const cookieContainer = document.getElementById('tech-cookie-consent');
  const btnConfig = document.getElementById('btn-tech-config');
  const btnSave = document.getElementById('btn-tech-save');
  const settingsPanel = document.getElementById('tech-cookie-settings');
  const switchAnalytics = document.getElementById('switch-analytics');
  const switchMarketing = document.getElementById('switch-marketing');

  // Check LocalStorage
  const userConsent = localStorage.getItem('plena_cookie_consent');

  if (!userConsent) {
    // GSAP Entrance
    gsap.to(cookieContainer, {
      y: 0,
      opacity: 1,
      duration: 1,
      delay: 1.5,
      ease: "power3.out"
    });
  } else {
    // Hide immediately if already consented
    cookieContainer.style.display = 'none';
  }

  // Toggle Settings Panel
  if (btnConfig && settingsPanel) {
    let isOpen = false;
    btnConfig.addEventListener('click', () => {
      isOpen = !isOpen;

      if (isOpen) {
        // Expand
        gsap.to(settingsPanel, {
          height: "auto",
          duration: 0.6,
          ease: "power2.out"
        });
        btnConfig.querySelector('.btn-text').textContent = "OCULTAR DADOS";
      } else {
        // Collapse
        gsap.to(settingsPanel, {
          height: 0,
          duration: 0.5,
          ease: "power2.in"
        });
        btnConfig.querySelector('.btn-text').textContent = "PERSONALIZAR DADOS";
      }
    });
  }

  // Switch Logic
  function toggleSwitch(btn) {
    const isPressed = btn.getAttribute('aria-pressed') === 'true';
    btn.setAttribute('aria-pressed', !isPressed);
  }

  if (switchAnalytics) switchAnalytics.addEventListener('click', () => toggleSwitch(switchAnalytics));
  if (switchMarketing) switchMarketing.addEventListener('click', () => toggleSwitch(switchMarketing));

  // Save / Accept Logic
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      // Loading State
      btnSave.classList.add('loading');

      // Simulate Processing
      setTimeout(() => {
        const preferences = {
          essential: true,
          analytics: switchAnalytics ? switchAnalytics.getAttribute('aria-pressed') === 'true' : true, // Default true if quick accept
          marketing: switchMarketing ? switchMarketing.getAttribute('aria-pressed') === 'true' : true,
          timestamp: new Date().toISOString()
        };

        saveConsent(preferences);

        // Exit Animation
        gsap.to(cookieContainer, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            cookieContainer.style.display = 'none';
          }
        });

      }, 800); // 800ms mock delay
    });
  }

  function saveConsent(data) {
    localStorage.setItem('plena_cookie_consent', JSON.stringify(data));
    // console.log("Consent Saved:", data);
  }
});

