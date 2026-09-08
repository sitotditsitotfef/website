// ==========================================================================
// SITÔT DIT SI TÔT FEF - SCRIPT INTERACTION
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Menu Mobile Toggle
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const header = document.querySelector('.site-header');

  if (mobileBtn && header) {
    mobileBtn.addEventListener('click', () => {
      header.classList.toggle('mobile-nav-active');
      const isExpanded = header.classList.contains('mobile-nav-active');
      mobileBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('mobile-nav-active');
      });
    });
  }

  // 2. Filtres des Projets
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Active state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (filterValue === 'all' || cardCategory === filterValue) {
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

  // 3. Visionneuse / Lightbox pour les images
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightboxModal && lightboxImg) {
    document.querySelectorAll('.project-img-container').forEach(container => {
      container.addEventListener('click', (e) => {
        // Ne pas déclencher la lightbox si clic sur le bouton d'alternance ou les puces
        if (e.target.closest('.photo-switch-btn') || e.target.closest('.photo-switcher-dots')) {
          return;
        }
        const img = container.querySelector('.switcher-img.active') || container.querySelector('.project-img');
        const card = container.closest('.project-card');
        const title = (img && img.dataset.title) ? `${card?.querySelector('.project-title')?.textContent || 'Projet'} - ${img.dataset.title}` : (card ? card.querySelector('.project-title')?.textContent : '');
        const desc = (img && img.dataset.desc) ? img.dataset.desc : (card ? card.querySelector('.project-desc')?.textContent : '');

        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt || 'Aperçu du projet';
          if (lightboxTitle) lightboxTitle.textContent = title || 'Projet Sitôt Dit Si Tôt Fef';
          if (lightboxDesc) lightboxDesc.textContent = desc || '';
          lightboxModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // 4. Interaction formulaire de contact
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('nom')?.value || '';
      const phone = document.getElementById('telephone')?.value || '';
      const message = document.getElementById('message')?.value || '';

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Ouverture de votre messagerie...';
      submitBtn.style.opacity = '0.7';

      // Création du mailto
      const subject = encodeURIComponent(`Demande de projet - ${name}`);
      const body = encodeURIComponent(`Bonjour Félix,\n\nMon nom : ${name}\nTéléphone : ${phone}\n\nMon projet / besoin :\n${message}\n\nMerci d'avance pour votre retour !`);
      
      setTimeout(() => {
        window.location.href = `mailto:sitotditsitotfef@gmail.com?subject=${subject}&body=${body}`;
        submitBtn.textContent = 'Message prêt !';
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.opacity = '1';
        }, 3000);
      }, 500);
    });
  }

  // 5. Onglets Qui suis-je (Présentation / Diplôme / Valeurs)
  const tabBtns = document.querySelectorAll('.about-tab-btn');
  const tabPanes = document.querySelectorAll('.about-tab-pane');

  if (tabBtns.length > 0 && tabPanes.length > 0) {
    const activateTab = (targetId) => {
      tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === targetId);
      });
      tabPanes.forEach(pane => {
        pane.classList.toggle('active', pane.id === targetId);
      });
    };

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        activateTab(target);
      });
    });

    // Support des ancres d'URL directes (ex: qui-suis-je.html#diplome)
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) {
      activateTab(hash);
    }
  }

  // 6. Carrousel interactif Avant / Après (défilement flèches, boutons & swipe)
  const carousels = document.querySelectorAll('.before-after-carousel');
  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    const pills = carousel.querySelectorAll('.carousel-pill');
    let currentIndex = 0;

    const goToSlide = (index) => {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      currentIndex = index;

      if (track) {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
      }

      pills.forEach((pill, i) => {
        pill.classList.toggle('active', i === currentIndex);
      });

      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentIndex);
      });
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(currentIndex + 1);
      });
    }

    pills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const targetIndex = parseInt(pill.getAttribute('data-slide'), 10);
        goToSlide(targetIndex);
      });
    });

    // Support du glissement tactile (swipe) sur smartphone
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(currentIndex - 1);
        }
      }
    }, { passive: true });
  });

  // 7. Comparateur interactif d'images Avant / Après (effet glisser)
  const comparisons = document.querySelectorAll('.image-comparison');
  comparisons.forEach(comp => {
    let isDragging = false;

    const setPositionFromClientX = (clientX) => {
      const rect = comp.getBoundingClientRect();
      const x = clientX - rect.left;
      let percent = (x / rect.width) * 100;
      if (percent < 0) percent = 0;
      if (percent > 100) percent = 100;
      comp.style.setProperty('--position', `${percent.toFixed(2)}%`);
    };

    comp.addEventListener('pointerdown', (e) => {
      // Ne pas déclencher le glissement si clic sur le bouton zoom ou un badge
      if (e.target.closest('.comparison-zoom-btn') || e.target.closest('.comparison-badge')) {
        return;
      }
      isDragging = true;
      comp.classList.add('dragging');
      try {
        comp.setPointerCapture(e.pointerId);
      } catch (err) {}
      setPositionFromClientX(e.clientX);
    });

    comp.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      setPositionFromClientX(e.clientX);
    });

    const endDrag = (e) => {
      if (!isDragging) return;
      isDragging = false;
      comp.classList.remove('dragging');
      try {
        comp.releasePointerCapture(e.pointerId);
      } catch (err) {}
    };

    comp.addEventListener('pointerup', endDrag);
    comp.addEventListener('pointercancel', endDrag);

    // Clics sur les badges pour basculer rapidement d'une vue à l'autre
    const badges = comp.querySelectorAll('.comparison-badge');
    badges.forEach(badge => {
      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const target = badge.getAttribute('data-target');
        if (target !== null) {
          comp.classList.remove('dragging');
          comp.style.setProperty('--position', `${target}%`);
        }
      });
    });

    // Zoom dans la lightbox depuis le bouton loupe
    const zoomBtn = comp.querySelector('.comparison-zoom-btn');
    if (zoomBtn && lightboxModal && lightboxImg) {
      zoomBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const currentPosStr = comp.style.getPropertyValue('--position') || '50%';
        const currentPos = parseFloat(currentPosStr);
        const imgOverlay = comp.querySelector('.comparison-img-overlay');
        const imgBase = comp.querySelector('.comparison-img-base');
        const chosenImg = (currentPos >= 50 && imgOverlay) ? imgOverlay : (imgBase || imgOverlay);
        const card = comp.closest('.project-card');
        const title = card ? card.querySelector('.project-title')?.textContent : '';
        const desc = card ? card.querySelector('.project-desc')?.textContent : '';

        if (chosenImg) {
          lightboxImg.src = chosenImg.src;
          lightboxImg.alt = chosenImg.alt || 'Aperçu du projet';
          if (lightboxTitle) lightboxTitle.textContent = title || 'Projet Sitôt Dit Si Tôt Fef';
          if (lightboxDesc) lightboxDesc.textContent = desc || '';
          lightboxModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    }
  });

  // 8. Alternance de photos avec bouton interactif
  const photoSwitchers = document.querySelectorAll('.photo-switcher');
  photoSwitchers.forEach(switcher => {
    const images = switcher.querySelectorAll('.switcher-img');
    const switchBtn = switcher.querySelector('.photo-switch-btn');
    const switchBtnText = switchBtn ? switchBtn.querySelector('.switch-btn-text') : null;
    const badge = switcher.querySelector('.photo-switcher-badge');
    const dots = switcher.querySelectorAll('.switcher-dot');

    if (images.length < 2) return;

    let currentIndex = 0;

    const showPhoto = (index) => {
      currentIndex = (index + images.length) % images.length;
      images.forEach((img, idx) => {
        img.classList.toggle('active', idx === currentIndex);
      });

      const activeImg = images[currentIndex];
      const nextImg = images[(currentIndex + 1) % images.length];

      if (badge && activeImg.dataset.title) {
        badge.textContent = activeImg.dataset.title;
      }

      if (switchBtnText && nextImg.dataset.title) {
        switchBtnText.textContent = nextImg.dataset.title;
      }

      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    };

    if (switchBtn) {
      switchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        showPhoto(currentIndex + 1);
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        showPhoto(idx);
      });
    });
  });
});

