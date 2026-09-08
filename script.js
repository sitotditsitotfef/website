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

  // 3. Visionneuse / Lightbox avec navigation multi-photos (défilement)
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxActionNext = document.getElementById('lightboxActionNext');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxActions = document.getElementById('lightboxActions');

  let currentGallery = [];
  let currentGalleryIndex = 0;
  let currentCardContainer = null;

  const updateLightboxContent = () => {
    if (currentGallery.length === 0) return;
    const item = currentGallery[currentGalleryIndex];
    if (!item) return;

    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt || 'Aperçu du projet';
    if (lightboxTitle) lightboxTitle.textContent = item.title || 'Projet Sitôt Dit Si Tôt Fef';
    if (lightboxDesc) lightboxDesc.textContent = item.desc || '';

    const hasMultiple = currentGallery.length > 1;
    if (lightboxCounter) {
      lightboxCounter.textContent = hasMultiple ? `Photo ${currentGalleryIndex + 1} sur ${currentGallery.length}` : '';
      lightboxCounter.style.display = hasMultiple ? 'inline-block' : 'none';
    }
    if (lightboxPrev) lightboxPrev.style.display = hasMultiple ? 'flex' : 'none';
    if (lightboxNext) lightboxNext.style.display = hasMultiple ? 'flex' : 'none';
    if (lightboxActions) lightboxActions.style.display = hasMultiple ? 'flex' : 'none';

    // Synchronisation avec la carte du projet sur la page
    if (currentCardContainer && currentCardContainer.classList.contains('photo-switcher')) {
      const switcherImgs = currentCardContainer.querySelectorAll('.switcher-img');
      const badge = currentCardContainer.querySelector('.photo-switcher-badge');
      const counterBadge = currentCardContainer.querySelector('.photo-counter-badge');
      const dots = currentCardContainer.querySelectorAll('.switcher-dot');
      const switchBtnText = currentCardContainer.querySelector('.photo-switch-btn .switch-btn-text');

      switcherImgs.forEach((img, idx) => {
        img.classList.toggle('active', idx === currentGalleryIndex);
      });
      if (badge && item.dataTitle) badge.textContent = item.dataTitle;
      if (counterBadge) counterBadge.textContent = `${currentGalleryIndex + 1} / ${switcherImgs.length}`;
      const miniCounter = currentCardContainer.querySelector('.mini-counter-text');
      if (miniCounter) {
        miniCounter.textContent = `${currentGalleryIndex + 1} / ${switcherImgs.length}`;
      }
      if (dots) {
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentGalleryIndex);
        });
      }
      const nextItem = currentGallery[(currentGalleryIndex + 1) % currentGallery.length];
      if (switchBtnText && nextItem && nextItem.dataTitle) {
        switchBtnText.textContent = nextItem.dataTitle;
      }
    }
  };

  const lightboxGoTo = (index) => {
    if (currentGallery.length <= 1) return;
    currentGalleryIndex = (index + currentGallery.length) % currentGallery.length;
    updateLightboxContent();
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (lightboxModal && lightboxImg) {
    document.querySelectorAll('.project-img-container').forEach(container => {
      container.addEventListener('click', (e) => {
        // Ne pas déclencher la lightbox si clic sur les boutons de navigation de la carte
        if (e.target.closest('.photo-switch-btn') || 
            e.target.closest('.photo-switcher-dots') || 
            e.target.closest('.photo-mini-arrow') || 
            e.target.closest('.photo-mini-counter')) {
          return;
        }

        currentCardContainer = container;
        currentGallery = [];
        currentGalleryIndex = 0;

        const card = container.closest('.project-card');
        const cardTitle = card?.querySelector('.project-title')?.textContent?.trim() || 'Projet';
        const cardDesc = card?.querySelector('.project-desc')?.textContent?.trim() || '';

        // Cas 1 : Conteneur multi-photos (photo-switcher)
        const switcherImgs = container.querySelectorAll('.switcher-img');
        if (switcherImgs.length > 0) {
          switcherImgs.forEach((img, idx) => {
            const itemTitle = img.dataset.title ? `${cardTitle} • ${img.dataset.title}` : cardTitle;
            const itemDesc = img.dataset.desc || cardDesc;
            currentGallery.push({
              src: img.src,
              alt: img.alt,
              title: itemTitle,
              desc: itemDesc,
              dataTitle: img.dataset.title || ''
            });
            if (img.classList.contains('active')) {
              currentGalleryIndex = idx;
            }
          });
        } 
        // Cas 2 : Carte Avant / Après
        else if (card && card.querySelector('.before-after-grid')) {
          const baItems = card.querySelectorAll('.before-after-item');
          baItems.forEach((item, idx) => {
            const img = item.querySelector('img');
            const state = item.querySelector('.badge-state')?.textContent?.trim() || '';
            if (img) {
              currentGallery.push({
                src: img.src,
                alt: img.alt,
                title: state ? `${cardTitle} (${state})` : cardTitle,
                desc: cardDesc
              });
              if (item === container) {
                currentGalleryIndex = idx;
              }
            }
          });
        }
        // Cas 3 : Image standard
        else {
          const img = container.querySelector('.project-img') || container.querySelector('img');
          if (img) {
            currentGallery.push({
              src: img.src,
              alt: img.alt,
              title: cardTitle,
              desc: cardDesc
            });
          }
        }

        if (currentGallery.length > 0) {
          updateLightboxContent();
          lightboxModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        lightboxGoTo(currentGalleryIndex - 1);
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        lightboxGoTo(currentGalleryIndex + 1);
      });
    }

    if (lightboxActionNext) {
      lightboxActionNext.addEventListener('click', (e) => {
        e.stopPropagation();
        lightboxGoTo(currentGalleryIndex + 1);
      });
    }

    // Clic direct sur l'image dans la visionneuse pour passer à la suivante
    lightboxImg.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentGallery.length > 1) {
        lightboxGoTo(currentGalleryIndex + 1);
      }
    });

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!lightboxModal.classList.contains('active')) return;
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        lightboxGoTo(currentGalleryIndex + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        lightboxGoTo(currentGalleryIndex - 1);
      }
    });

    // Support tactile swipe dans la visionneuse
    let touchStartX = 0;
    let touchEndX = 0;

    lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) {
          lightboxGoTo(currentGalleryIndex + 1);
        } else {
          lightboxGoTo(currentGalleryIndex - 1);
        }
      }
    }, { passive: true });
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
          currentGallery = [{
            src: chosenImg.src,
            alt: chosenImg.alt || 'Aperçu du projet',
            title: title || 'Projet Sitôt Dit Si Tôt Fef',
            desc: desc || ''
          }];
          currentGalleryIndex = 0;
          currentCardContainer = comp;
          updateLightboxContent();
          lightboxModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    }
  });

  // 8. Alternance de photos avec bouton interactif, flèches & puces
  const photoSwitchers = document.querySelectorAll('.photo-switcher');
  photoSwitchers.forEach(switcher => {
    const images = switcher.querySelectorAll('.switcher-img');
    const switchBtn = switcher.querySelector('.photo-switch-btn');
    const prevBtn = switcher.querySelector('.photo-switch-prev');
    const nextBtn = switcher.querySelector('.photo-switch-next');
    const miniPrev = switcher.querySelector('.photo-mini-arrow.prev');
    const miniNext = switcher.querySelector('.photo-mini-arrow.next');
    const miniCounter = switcher.querySelector('.mini-counter-text');
    const switchBtnText = switchBtn ? switchBtn.querySelector('.switch-btn-text') : null;
    const badge = switcher.querySelector('.photo-switcher-badge');
    const counterBadge = switcher.querySelector('.photo-counter-badge');
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

      if (counterBadge) {
        counterBadge.textContent = `${currentIndex + 1} / ${images.length}`;
      }

      if (miniCounter) {
        miniCounter.textContent = `${currentIndex + 1} / ${images.length}`;
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

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        showPhoto(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        showPhoto(currentIndex + 1);
      });
    }

    // Petits boutons flèches discrets sur la carte
    if (miniPrev) {
      miniPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const activeIdx = Array.from(images).findIndex(img => img.classList.contains('active'));
        const target = activeIdx !== -1 ? activeIdx - 1 : currentIndex - 1;
        showPhoto(target);
      });
    }

    if (miniNext) {
      miniNext.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const activeIdx = Array.from(images).findIndex(img => img.classList.contains('active'));
        const target = activeIdx !== -1 ? activeIdx + 1 : currentIndex + 1;
        showPhoto(target);
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        showPhoto(idx);
      });
    });

    // Support du glissement tactile (swipe) sur mobile
    let touchStartX = 0;
    let touchEndX = 0;

    switcher.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    switcher.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        const activeIdx = Array.from(images).findIndex(img => img.classList.contains('active'));
        const baseIdx = activeIdx !== -1 ? activeIdx : currentIndex;
        if (diff < 0) {
          showPhoto(baseIdx + 1);
        } else {
          showPhoto(baseIdx - 1);
        }
      }
    }, { passive: true });
  });
});

