// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Tools panel: click a label to preview its image on the right
const toolLabels = document.querySelectorAll('.tool-label');
const previewImg = document.getElementById('toolsPreviewImg');

function showToolPreview(label) {
  const imageUrl = label.dataset.image;
  const altText = label.dataset.alt || '';

  if (imageUrl) {
    previewImg.src = imageUrl;
    previewImg.alt = altText;
    previewImg.hidden = false;
  } else {
    // No image for this tool — leave the preview blank
    previewImg.src = '';
    previewImg.alt = '';
    previewImg.hidden = true;
  }
}

function clearToolPreview() {
  previewImg.src = '';
  previewImg.alt = '';
  previewImg.hidden = true;
}

if (toolLabels.length && previewImg) {
  toolLabels.forEach(label => {
    label.addEventListener('click', () => {
      const alreadyActive = label.classList.contains('active');

      toolLabels.forEach(l => {
        l.classList.remove('active');
        l.setAttribute('aria-pressed', 'false');
      });

      if (alreadyActive) {
        clearToolPreview();
        return;
      }

      label.classList.add('active');
      label.setAttribute('aria-pressed', 'true');
      showToolPreview(label);
    });
  });

  // Default open: whichever label is marked active in the HTML (PropertyMe)
  const defaultLabel = document.querySelector('.tool-label.active') || toolLabels[0];
  showToolPreview(defaultLabel);
}

// Scroll reveal for ledger entries
const revealEls = document.querySelectorAll('[data-reveal]');

if ('IntersectionObserver' in window && revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
} else {
  // Fallback: no IO support, just show everything
  revealEls.forEach(el => el.classList.add('in-view'));
}