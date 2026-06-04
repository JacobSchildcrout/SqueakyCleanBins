// =====================================================
// Wheelie Clean Bins — shared scripts
// =====================================================

// ===== Reveal animations on load =====
document.querySelectorAll('.reveal').forEach(el => {
  requestAnimationFrame(() => el.classList.add('in'));
});

// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      navToggle.classList.remove('open');
    });
  });
}

// ===== FAQ accordion =====
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
});

// ===== Gallery filters =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.pair').forEach(item => {
      const show = filter === 'all' || item.dataset.cat === filter;
      item.classList.toggle('hidden', !show);
    });
  });
});

// ===== Before/After slider (gallery) =====
document.querySelectorAll('.ba-slider').forEach(slider => {
  const handle = slider.querySelector('.ba-handle');
  const before = slider.querySelector('.ba-before');
  if (!handle || !before) return;

  let dragging = false;
  const setPos = (pct) => {
    pct = Math.max(0, Math.min(100, pct));
    before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left = pct + '%';
  };

  const onMove = (clientX) => {
    const rect = slider.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(pct);
  };

  slider.addEventListener('mousedown', (e) => { dragging = true; onMove(e.clientX); });
  window.addEventListener('mousemove', (e) => { if (dragging) onMove(e.clientX); });
  window.addEventListener('mouseup', () => { dragging = false; });

  slider.addEventListener('touchstart', (e) => { onMove(e.touches[0].clientX); }, { passive: true });
  slider.addEventListener('touchmove', (e) => { onMove(e.touches[0].clientX); }, { passive: true });
});

// =====================================================
// FORMSPREE form handler
// Used on quote-bins.html and quote-power-washing.html
// =====================================================
document.querySelectorAll('form.formspree-form').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const thanksBox = document.getElementById(form.dataset.thanksId);
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending…';
    }

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        // Hide the form, show the thank-you box
        form.style.display = 'none';
        if (thanksBox) {
          thanksBox.classList.add('show');
          thanksBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        form.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Something went wrong sending your request. Please call (972) 992-8409 instead.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    } catch (err) {
      alert('Network error. Please call (972) 992-8409 to schedule.');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }
  });
});
