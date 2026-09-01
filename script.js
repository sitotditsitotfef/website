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
      container.addEventListener('click', () => {
        const img = container.querySelector('.project-img');
        const card = container.closest('.project-card');
        const title = card ? card.querySelector('.project-title')?.textContent : '';
        const desc = card ? card.querySelector('.project-desc')?.textContent : '';

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
});
