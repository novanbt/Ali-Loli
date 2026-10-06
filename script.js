// Ali Ioli Spanish Restaurant - Interactive Controller
if (window.__ALI_IOLI_INIT) {
  // Already initialized
} else {
  window.__ALI_IOLI_INIT = true;
  document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll listener
  const header = document.querySelector('header');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('header-scrolled');
    } else {
      header?.classList.remove('header-scrolled');
    }

    if (window.scrollY > 400) {
      backToTop?.classList.add('visible');
    } else {
      backToTop?.classList.remove('visible');
    }

    updateScrollSpy();
  });

  // 2. Scroll Spy for active navigation links
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"], #mobile-drawer a[href^="#"]');

  function updateScrollSpy() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active', 'text-primary');
            link.classList.remove('text-on-surface-variant');
          } else {
            link.classList.remove('active', 'text-primary');
            if (!link.classList.contains('bg-primary')) {
              link.classList.add('text-on-surface-variant');
            }
          }
        });
      }
    });
  }

  // 3. Mobile Navigation Drawer
  const mobileToggleBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');
  const mobileNavLinks = document.querySelectorAll('#mobile-drawer a');

  function openMobileMenu() {
    mobileDrawer?.classList.add('open');
    mobileOverlay?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileDrawer?.classList.remove('open');
    mobileOverlay?.classList.add('hidden');
    document.body.style.overflow = '';
  }

  mobileToggleBtn?.addEventListener('click', openMobileMenu);
  mobileCloseBtn?.addEventListener('click', closeMobileMenu);
  mobileOverlay?.addEventListener('click', closeMobileMenu);
  mobileNavLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  // 4. Menu Category Filtering
  const filterButtons = document.querySelectorAll('.menu-filter-btn');
  const dishCards = document.querySelectorAll('.dish-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button active styling
      filterButtons.forEach(b => {
        b.classList.remove('bg-primary', 'text-on-primary', 'shadow-sm');
        b.classList.add('text-on-surface-variant');
      });
      btn.classList.add('bg-primary', 'text-on-primary', 'shadow-sm');
      btn.classList.remove('text-on-surface-variant');

      const filter = btn.getAttribute('data-filter');

      dishCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.classList.add('animate-fade-in');
        } else {
          card.style.display = 'none';
          card.classList.remove('animate-fade-in');
        }
      });
    });
  });

  // 5. Reservation Form Controls
  let selectedPartySize = '2 Guests';
  let selectedTimeSlot = '19:15';
  let selectedSeating = 'Main Dining Room';

  // Party Size Buttons
  const partyButtons = document.querySelectorAll('#party-size-group button');
  partyButtons.forEach(button => {
    button.addEventListener('click', function() {
      partyButtons.forEach(b => {
        b.classList.remove('bg-primary', 'text-on-primary');
        b.classList.add('bg-surface', 'text-on-surface');
      });
      this.classList.remove('bg-surface', 'text-on-surface');
      this.classList.add('bg-primary', 'text-on-primary');
      selectedPartySize = this.textContent.trim();
    });
  });

  // Date Quick Selector Buttons
  const dateInput = document.getElementById('reservation-date');
  const dateQuickButtons = document.querySelectorAll('.date-quick-btn');

  function formatDate(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Set default min date to today
  const today = new Date();
  if (dateInput) {
    dateInput.min = formatDate(today);
    dateInput.value = formatDate(today);
  }

  dateQuickButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const offset = this.getAttribute('data-date-offset');
      const targetDate = new Date();
      if (offset === 'today') {
        // Today
      } else if (offset === 'tomorrow') {
        targetDate.setDate(targetDate.getDate() + 1);
      } else if (offset === 'friday') {
        const day = targetDate.getDay();
        const diff = (5 + 7 - day) % 7 || 7;
        targetDate.setDate(targetDate.getDate() + diff);
      } else if (offset === 'saturday') {
        const day = targetDate.getDay();
        const diff = (6 + 7 - day) % 7 || 7;
        targetDate.setDate(targetDate.getDate() + diff);
      }
      if (dateInput) {
        dateInput.value = formatDate(targetDate);
      }
      dateQuickButtons.forEach(b => b.classList.remove('bg-primary-fixed', 'text-on-primary-fixed', 'font-semibold'));
      this.classList.add('bg-primary-fixed', 'text-on-primary-fixed', 'font-semibold');
    });
  });

  // Time Slot Selection
  const timeSlotButtons = document.querySelectorAll('#time-slots button');
  timeSlotButtons.forEach(button => {
    button.addEventListener('click', function() {
      timeSlotButtons.forEach(b => {
        b.classList.remove('bg-primary', 'text-on-primary');
        b.classList.add('bg-surface', 'text-on-surface');
      });
      this.classList.remove('bg-surface', 'text-on-surface');
      this.classList.add('bg-primary', 'text-on-primary');
      selectedTimeSlot = this.textContent.trim();
    });
  });

  // Seating radio change
  const seatingInputs = document.querySelectorAll('input[name="area"]');
  seatingInputs.forEach(input => {
    input.addEventListener('change', function() {
      if (this.checked) {
        selectedSeating = this.value;
      }
    });
  });

  // Form submission & custom confirmation voucher modal
  const reservationForm = document.getElementById('reservation-form');
  const confirmModal = document.getElementById('confirmation-modal');
  const closeConfirmModalBtn = document.getElementById('close-confirm-modal');

  reservationForm?.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('guest-name')?.value || 'Valued Guest';
    const phone = document.getElementById('guest-phone')?.value || 'Not provided';
    const dateVal = dateInput?.value || formatDate(new Date());

    // Generate random booking reference
    const refCode = 'AI-' + Math.floor(100000 + Math.random() * 900000);

    // Populate modal
    document.getElementById('modal-ref').textContent = refCode;
    document.getElementById('modal-name').textContent = name;
    document.getElementById('modal-phone').textContent = phone;
    document.getElementById('modal-party').textContent = selectedPartySize;
    document.getElementById('modal-date').textContent = new Date(dateVal + 'T00:00:00').toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    document.getElementById('modal-time').textContent = selectedTimeSlot;
    document.getElementById('modal-seating').textContent = selectedSeating;

    // Show modal
    confirmModal?.classList.remove('hidden');
    requestAnimationFrame(() => confirmModal?.classList.add('open'));
    showToast('Reservation request confirmed!');
  });

  closeConfirmModalBtn?.addEventListener('click', () => {
    confirmModal?.classList.remove('open');
    setTimeout(() => confirmModal?.classList.add('hidden'), 300);
  });

  // 6. Complete Menu Modal
  const menuModal = document.getElementById('full-menu-modal');
  const openMenuModalBtn = document.getElementById('open-menu-modal-btn');
  const closeMenuModalBtn = document.getElementById('close-menu-modal');

  openMenuModalBtn?.addEventListener('click', () => {
    menuModal?.classList.remove('hidden');
    requestAnimationFrame(() => menuModal?.classList.add('open'));
    document.body.style.overflow = 'hidden';
  });

  closeMenuModalBtn?.addEventListener('click', () => {
    menuModal?.classList.remove('open');
    setTimeout(() => menuModal?.classList.add('hidden'), 300);
    document.body.style.overflow = '';
  });

  // 7. Lightbox for Gallery
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeLightboxBtn = document.getElementById('close-lightbox');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('p')?.textContent || img?.alt || 'Ali Ioli Experience';
      if (img && lightboxImg && lightboxCaption) {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = caption;
        lightbox?.classList.remove('hidden');
        requestAnimationFrame(() => lightbox?.classList.add('open'));
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    lightbox?.classList.remove('open');
    setTimeout(() => lightbox?.classList.add('hidden'), 300);
    document.body.style.overflow = '';
  }

  closeLightboxBtn?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      confirmModal?.classList.remove('open');
      setTimeout(() => confirmModal?.classList.add('hidden'), 300);
      menuModal?.classList.remove('open');
      setTimeout(() => menuModal?.classList.add('hidden'), 300);
      closeLightbox();
      closeMobileMenu();
      document.body.style.overflow = '';
    }
  });

  // 8. Back to Top Click
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 9. Toast Notification Helper
  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    if (toast && toastMsg) {
      toastMsg.textContent = message;
      toast.classList.remove('hidden');
      requestAnimationFrame(() => toast.classList.add('show'));
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.classList.add('hidden'), 300);
      }, 4000);
    }
  }

  // Quick Book a Table from Nav / Hero links
  document.querySelectorAll('a[href="#reservations"]').forEach(link => {
    link.addEventListener('click', () => {
      const nameInput = document.getElementById('guest-name');
      setTimeout(() => {
        nameInput?.focus();
      }, 600);
    });
  });
});
}
