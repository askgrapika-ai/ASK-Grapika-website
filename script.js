/* ======================================================
   ASK GRAPIKA — JAVASCRIPT
   Navbar scroll, mobile menu, scroll animations
   ====================================================== */

(function () {
  'use strict';

  // ── DOM References ──────────────────────────────────────
  const navbar    = document.getElementById('navbar');
  const burger    = document.getElementById('burger');
  const navLinks  = document.getElementById('navLinks');
  const allLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id], div[id]');

  // ── Navbar: Scroll Effect ───────────────────────────────
  function handleNavScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ── Mobile Burger Toggle ────────────────────────────────
  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu on link click
  allLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
    });
  });

  // ── Active Nav Link on Scroll ───────────────────────────
  function updateActiveLink() {
    let currentId = '';
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= 80) currentId = section.id;
    });
    allLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ── Scroll-triggered Animations (Intersection Observer) ─
  const animatedEls = document.querySelectorAll(
    '.animate-fade-up:not(.hero .animate-fade-up), ' +
    '.animate-slide-left, ' +
    '.animate-slide-right, ' +
    '.animate-scale-in'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  animatedEls.forEach(el => observer.observe(el));

  // ── Smooth Scroll for anchor links ─────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 64; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Tilt effect on service cards ───────────────────────
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
      card.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── Tilt effect on intro card ───────────────────────────
  const introCard = document.querySelector('.intro-card');
  if (introCard) {
    introCard.addEventListener('mousemove', (e) => {
      const rect = introCard.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 14;
      introCard.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-8px) scale(1.01)`;
    });
    introCard.addEventListener('mouseleave', () => {
      introCard.style.transform = '';
    });
  }

  // ── Parallax on Hero ─────────────────────────────────────
  const heroBgImg = document.querySelector('.hero-bg-img');
  if (heroBgImg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBgImg.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    }, { passive: true });
  }

  // ── Cursor glow effect ───────────────────────────────────
  const cursorGlow = document.createElement('div');
  cursorGlow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    background: radial-gradient(circle, rgba(255,87,34,0.07) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    opacity: 0;
  `;
  document.body.appendChild(cursorGlow);

  let cursorVisible = false;
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top  = e.clientY + 'px';
    if (!cursorVisible) {
      cursorGlow.style.opacity = '1';
      cursorVisible = true;
    }
  });
  document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
    cursorVisible = false;
  });

  // ── Interactive Design Playground ──────────────────────
  const workspace     = document.getElementById('playgroundWorkspace');
  const drawCanvas    = document.getElementById('drawCanvas');
  const toolbar       = document.getElementById('playgroundToolbar');
  const colorPicker   = document.getElementById('colorPicker');
  const colorPreview  = document.getElementById('colorPreview');
  const clearBtn      = document.getElementById('tool-clear');

  if (workspace && toolbar) {
    let activeTool   = 'square';
    let chosenColor  = '#FF7700';
    let useRandomColor = true;

    // ── Random vibrant color generator ──
    function randomColor() {
      const hue = Math.floor(Math.random() * 360);
      const sat = 65 + Math.floor(Math.random() * 30);
      const lit = 45 + Math.floor(Math.random() * 20);
      return `hsl(${hue}, ${sat}%, ${lit}%)`;
    }

    // ── Tool selection ──
    toolbar.addEventListener('click', (e) => {
      const btn = e.target.closest('.tool-btn[data-tool]');
      if (!btn) return;
      toolbar.querySelectorAll('.tool-btn[data-tool]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTool = btn.getAttribute('data-tool');
    });

    // ── Color picker ──
    if (colorPicker) {
      colorPicker.addEventListener('input', (e) => {
        chosenColor = e.target.value;
        useRandomColor = false;
        if (colorPreview) colorPreview.style.background = chosenColor;
      });
    }

    // ── Clear all ──
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        workspace.querySelectorAll('.pg-shape').forEach(s => s.remove());
        workspace.querySelectorAll('.pg-text').forEach(t => t.remove());
        if (drawCanvas) {
          const ctx = drawCanvas.getContext('2d');
          ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
        }
      });
    }

    // ══════════════════════════════════════════════════════
    //  DRAG-TO-CREATE SHAPES
    //  User presses → ghost preview appears at origin
    //  User drags   → preview grows based on distance
    //  User releases → shape is finalized & made draggable
    // ══════════════════════════════════════════════════════
    let isCreating  = false;
    let ghostEl     = null;
    let originX     = 0;
    let originY     = 0;
    let shapeColor  = '';

    function getShapeClass(tool) {
      return `pg-shape-${tool}`;
    }

    // Apply size to shape based on tool type
    function applyShapeSize(el, tool, w, h) {
      if (tool === 'circle') {
        const size = Math.max(w, h);
        el.style.width  = size + 'px';
        el.style.height = size + 'px';
      } else if (tool === 'square') {
        const size = Math.max(w, h);
        el.style.width  = size + 'px';
        el.style.height = size + 'px';
      } else {
        el.style.width  = w + 'px';
        el.style.height = h + 'px';
      }
    }

    // ── Pointer down on workspace → start creating ──
    workspace.addEventListener('pointerdown', (e) => {
      if (activeTool === 'pencil' || activeTool === 'text') return;
      if (e.target.closest('.pg-shape') || e.target.closest('.pg-text')) return;

      const rect = workspace.getBoundingClientRect();
      originX = e.clientX - rect.left;
      originY = e.clientY - rect.top;

      shapeColor = useRandomColor ? randomColor() : chosenColor;

      // Create a ghost preview element
      ghostEl = document.createElement('div');
      ghostEl.classList.add('pg-shape', getShapeClass(activeTool), 'pg-ghost');
      ghostEl.style.background = shapeColor;
      ghostEl.style.opacity = '0.5';
      ghostEl.style.left = originX + 'px';
      ghostEl.style.top  = originY + 'px';
      applyShapeSize(ghostEl, activeTool, 0, 0);
      workspace.appendChild(ghostEl);

      isCreating = true;
      workspace.setPointerCapture(e.pointerId);
    });

    // ── Pointer move → resize ghost preview ──
    workspace.addEventListener('pointermove', (e) => {
      if (!isCreating || !ghostEl) return;

      const rect = workspace.getBoundingClientRect();
      const curX = e.clientX - rect.left;
      const curY = e.clientY - rect.top;

      // Calculate width/height from drag distance
      const rawW = curX - originX;
      const rawH = curY - originY;

      // Support dragging in any direction
      const x = rawW < 0 ? originX + rawW : originX;
      const y = rawH < 0 ? originY + rawH : originY;
      const w = Math.abs(rawW);
      const h = Math.abs(rawH);

      ghostEl.style.left = x + 'px';
      ghostEl.style.top  = y + 'px';
      applyShapeSize(ghostEl, activeTool, w, h);
    });

    // ── Pointer up → finalize shape ──
    workspace.addEventListener('pointerup', (e) => {
      if (!isCreating || !ghostEl) return;
      isCreating = false;

      // Get final size
      const finalW = parseFloat(ghostEl.style.width)  || 0;
      const finalH = parseFloat(ghostEl.style.height) || 0;

      // Discard tiny accidental shapes (less than 10px)
      if (finalW < 10 && finalH < 10) {
        ghostEl.remove();
        ghostEl = null;
        return;
      }

      // Convert ghost into a real shape
      ghostEl.classList.remove('pg-ghost');
      ghostEl.style.opacity = '1';
      ghostEl.style.transition = 'opacity 0.2s ease';

      // Make it draggable
      makeDraggable(ghostEl);
      ghostEl = null;
    });

    // Cancel if pointer leaves workspace during creation
    workspace.addEventListener('pointerleave', () => {
      if (isCreating && ghostEl) {
        ghostEl.remove();
        ghostEl = null;
        isCreating = false;
      }
    });

    // ── Drag logic for finalized shapes ──
    function makeDraggable(el) {
      let isDragging = false;
      let startX, startY, origX, origY;

      el.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        isDragging = true;
        el.style.zIndex = 10;
        el.style.transition = 'box-shadow 0.2s ease';
        startX = e.clientX;
        startY = e.clientY;
        origX = parseInt(el.style.left) || 0;
        origY = parseInt(el.style.top) || 0;
        el.setPointerCapture(e.pointerId);
        e.stopPropagation();
      });

      el.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        el.style.left = (origX + dx) + 'px';
        el.style.top  = (origY + dy) + 'px';
      });

      el.addEventListener('pointerup', (e) => {
        isDragging = false;
        el.style.zIndex = 2;
        e.stopPropagation();
      });
    }

    // ── Freehand pencil drawing (canvas) ──
    let isDrawing = false;
    if (drawCanvas) {
      function resizeCanvas() {
        drawCanvas.width  = workspace.offsetWidth;
        drawCanvas.height = workspace.offsetHeight;
      }
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      const ctx = drawCanvas.getContext('2d');
      ctx.lineCap  = 'round';
      ctx.lineJoin = 'round';

      drawCanvas.addEventListener('pointerdown', (e) => {
        if (activeTool !== 'pencil') return;
        isDrawing = true;
        const rect = drawCanvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.strokeStyle = useRandomColor ? randomColor() : chosenColor;
        ctx.lineWidth = 3;
      });

      drawCanvas.addEventListener('pointermove', (e) => {
        if (!isDrawing || activeTool !== 'pencil') return;
        const rect = drawCanvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
      });

      drawCanvas.addEventListener('pointerup', () => { isDrawing = false; });
      drawCanvas.addEventListener('pointerleave', () => { isDrawing = false; });
    }

    // ══════════════════════════════════════════════════════
    //  TEXT TOOL
    //  Click on workspace → create editable text element
    //  Type text → click outside or press Escape to finalize
    // ══════════════════════════════════════════════════════
    let activeTextEl = null;

    function finalizeText(el) {
      if (!el) return;
      el.classList.remove('editing');
      el.contentEditable = 'false';
      el.style.cursor = 'grab';

      // Remove if empty
      if (el.textContent.trim() === '') {
        el.remove();
      } else {
        makeDraggable(el);
      }
      activeTextEl = null;
    }

    workspace.addEventListener('click', (e) => {
      if (activeTool !== 'text') return;
      if (e.target.closest('.pg-text')) return; // clicking existing text
      if (e.target.closest('.pg-shape')) return;

      // Finalize any active text first
      if (activeTextEl) finalizeText(activeTextEl);

      const rect = workspace.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const color = useRandomColor ? randomColor() : chosenColor;

      const textEl = document.createElement('div');
      textEl.classList.add('pg-text', 'editing');
      textEl.contentEditable = 'true';
      textEl.style.left = x + 'px';
      textEl.style.top  = y + 'px';
      textEl.style.color = color;
      textEl.setAttribute('data-placeholder', 'Type here...');
      workspace.appendChild(textEl);
      textEl.focus();
      activeTextEl = textEl;

      // Finalize on Escape or clicking outside
      textEl.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape') {
          ev.preventDefault();
          finalizeText(textEl);
        }
      });

      textEl.addEventListener('blur', () => {
        // Small delay to prevent race with click
        setTimeout(() => {
          if (activeTextEl === textEl) finalizeText(textEl);
        }, 150);
      });
    });
  }

  // ── Works Page — Panel-based Filter + Lightbox ──────────
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const bentoPanels  = document.querySelectorAll('.bento-panel');

  if (filterBtns.length > 0 && bentoPanels.length > 0) {

    // ── Panel switching ─────────────────────────────────────
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        bentoPanels.forEach(panel => {
          if (panel.getAttribute('data-panel') === filter) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        });
      });
    });

    // ── Click on "All Works" items to redirect to specific service ──
    const allWorksPanel = document.getElementById('panel-all');
    if (allWorksPanel) {
      const allWorksItems = allWorksPanel.querySelectorAll('.bento-item');
      allWorksItems.forEach(item => {
        item.addEventListener('click', () => {
          const target = item.getAttribute('data-target-panel');
          if (target) {
            const targetBtn = document.querySelector(`.filter-btn[data-filter="${target}"]`);
            if (targetBtn) {
              targetBtn.click();
              window.scrollTo({ top: document.querySelector('.works-filter-nav').offsetTop - 100, behavior: 'smooth' });
            }
          }
        });
      });
    }

    // ── Fullscreen Lightbox (service panels only) ───────────
    const lightbox     = document.getElementById('lightbox');
    const lightboxImg  = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');

    let currentImages  = [];
    let currentIndex   = 0;

    function openLightbox(imgSrc, images, index) {
      currentImages = images;
      currentIndex  = index;
      lightboxImg.src = imgSrc;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      updateCounter();
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => { lightboxImg.src = ''; }, 400);
    }

    function navigateLightbox(direction) {
      if (currentImages.length === 0) return;
      currentIndex = (currentIndex + direction + currentImages.length) % currentImages.length;
      lightboxImg.src = currentImages[currentIndex];
      updateCounter();
    }

    function updateCounter() {
      if (lightboxCounter) {
        lightboxCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
      }
    }

    if (lightbox) {
      // Click on bento items in SERVICE panels (not "all") → open lightbox
      bentoPanels.forEach(panel => {
        const panelName = panel.getAttribute('data-panel');
        if (panelName === 'all') return; // "All Works" panel: no lightbox

        const items = panel.querySelectorAll('.bento-item');
        items.forEach((item, idx) => {
          item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (!img) return;
            // Gather all images in this panel
            const allImgs = Array.from(panel.querySelectorAll('.bento-item img')).map(i => i.src);
            openLightbox(img.src, allImgs, idx);
          });
        });
      });

      lightboxClose.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });
      lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(-1); });
      lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(1); });

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft')  navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
      });
    }
  }

  console.log('%c ASK Grapika 🎨 ', 'background:#ff5722;color:#fff;font-size:14px;padding:4px 8px;border-radius:4px;');
  console.log('%c We Cook All Kind of Design Recipes ', 'color:#ffb300;font-style:italic;');

})();

