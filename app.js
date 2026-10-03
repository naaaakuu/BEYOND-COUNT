/**
 * BEYOND COUNT - Minimalist Cute Ancient Jain Aesthetic
 * Mobile-First Interactive Engine:
 * 1. Vessel Tab Switcher & Touch Handlers
 * 2. Countable: Cute Glossy Pink Balls Physics
 * 3. Uncountable: Soft Cotton Filaments ("Resha")
 * 4. Infinite: Shimmering Golden River Sand
 * 5. Lightbox Modal for Carbon Dating Diagram
 * 6. Peaceful Meditative Audio Drone
 */

// ============================================================================
// 1. VESSEL TABS & VIEW SWITCHER
// ============================================================================

function initVesselTabs() {
  const tabs = document.querySelectorAll('.vessel-tab-btn');
  const viewport = document.getElementById('containersViewport');
  const cards = document.querySelectorAll('.vessel-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-target');

      if (target === 'all') {
        viewport.classList.add('view-all-mode');
        cards.forEach(card => card.classList.add('active-card'));
      } else {
        viewport.classList.remove('view-all-mode');
        cards.forEach(card => {
          if (card.getAttribute('data-type') === target) {
            card.classList.add('active-card');
          } else {
            card.classList.remove('active-card');
          }
        });
      }

      // Re-initialize canvas sizes for visible cards
      setTimeout(() => {
        if (window.countableJarInstance) window.countableJarInstance.initSize();
        if (window.uncountableJarInstance) window.uncountableJarInstance.initSize();
        if (window.infiniteSandJarInstance) window.infiniteSandJarInstance.initSize();
      }, 50);
    });
  });
}

// ============================================================================
// 2. CONTAINER 1: COUNTABLE (CUTE PINK BALLS)
// ============================================================================

class CountableJar {
  constructor(canvasId, counterId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.counterEl = document.getElementById(counterId);

    this.balls = [];
    this.gravity = 0.35;
    this.bounce = 0.75;
    this.friction = 0.985;
    this.initSize();

    this.resetBalls(18);
    this.bindEvents();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initSize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = this.canvas.width = Math.floor(rect.width) || 190;
    this.height = this.canvas.height = Math.floor(rect.height) || 220;
  }

  resetBalls(count = 18) {
    this.balls = [];
    for (let i = 0; i < count; i++) {
      this.addBall(
        30 + Math.random() * (this.width - 60),
        25 + Math.random() * (this.height - 100),
        (Math.random() - 0.5) * 2.5,
        (Math.random() - 0.5) * 2.5,
        9 + Math.random() * 4
      );
    }
    this.updateCountDisplay();
  }

  addBall(x, y, vx = 0, vy = 0, r = 11) {
    const cutePinks = [
      { main: '#ff5c8a', highlight: '#ffb3c6', dark: '#cc2958' },
      { main: '#ff4071', highlight: '#ffa6bf', dark: '#b81947' },
      { main: '#ff7096', highlight: '#ffd0dc', dark: '#db3b68' },
      { main: '#f72585', highlight: '#fca3cc', dark: '#a31055' }
    ];
    const color = cutePinks[Math.floor(Math.random() * cutePinks.length)];

    this.balls.push({
      x: x || this.width / 2,
      y: y || 35,
      vx: vx,
      vy: vy,
      r: r,
      color: color,
      mass: r * 0.1
    });
    this.updateCountDisplay();
  }

  shake() {
    this.balls.forEach(b => {
      b.vx += (Math.random() - 0.5) * 18;
      b.vy -= (6 + Math.random() * 12);
    });
  }

  updateCountDisplay() {
    if (this.counterEl) {
      this.counterEl.textContent = `${this.balls.length} Pink Balls`;
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.initSize());

    // Click / touch to drop a new ball
    const handleAddTouch = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      this.addBall(x, y, (Math.random() - 0.5) * 3, -1);
    };

    this.canvas.addEventListener('click', handleAddTouch);
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleAddTouch(e);
    }, { passive: false });

    const shakeBtn = document.getElementById('shakeJarBtn');
    if (shakeBtn) shakeBtn.addEventListener('click', () => this.shake());

    const addBtn = document.getElementById('addBallBtn');
    if (addBtn) addBtn.addEventListener('click', () => {
      this.addBall(this.width / 2 + (Math.random() - 0.5) * 30, 30, (Math.random() - 0.5) * 3, 1);
    });

    const resetBtn = document.getElementById('resetBallsBtn');
    if (resetBtn) resetBtn.addEventListener('click', () => this.resetBalls(18));
  }

  updatePhysics() {
    const bottomLimit = this.height - 10;
    const leftLimit = 12;
    const rightLimit = this.width - 12;
    const topLimit = 14;

    for (let i = 0; i < this.balls.length; i++) {
      const b = this.balls[i];
      b.vy += this.gravity;
      b.vx *= this.friction;
      b.vy *= this.friction;

      b.x += b.vx;
      b.y += b.vy;

      if (b.y + b.r > bottomLimit) {
        b.y = bottomLimit - b.r;
        b.vy = -b.vy * this.bounce;
        b.vx *= 0.95;
      }
      if (b.y - b.r < topLimit) {
        b.y = topLimit + b.r;
        b.vy = -b.vy * this.bounce;
      }
      if (b.x - b.r < leftLimit) {
        b.x = leftLimit + b.r;
        b.vx = -b.vx * this.bounce;
      }
      if (b.x + b.r > rightLimit) {
        b.x = rightLimit - b.r;
        b.vx = -b.vx * this.bounce;
      }

      for (let j = i + 1; j < this.balls.length; j++) {
        const b2 = this.balls[j];
        const dx = b2.x - b.x;
        const dy = b2.y - b.y;
        const dist = Math.hypot(dx, dy);
        const minDist = b.r + b2.r;

        if (dist < minDist && dist > 0) {
          const overlap = 0.5 * (minDist - dist);
          const nx = dx / dist;
          const ny = dy / dist;

          b.x -= nx * overlap;
          b.y -= ny * overlap;
          b2.x += nx * overlap;
          b2.y += ny * overlap;

          const kx = b.vx - b2.vx;
          const ky = b.vy - b2.vy;
          const p = 2 * (nx * kx + ny * ky) / (b.mass + b2.mass);

          b.vx -= p * b2.mass * nx;
          b.vy -= p * b2.mass * ny;
          b2.vx += p * b.mass * nx;
          b2.vy += p * b.mass * ny;
        }
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (const b of this.balls) {
      // Soft shadow
      this.ctx.beginPath();
      this.ctx.ellipse(b.x, Math.min(this.height - 10, b.y + b.r * 0.8), b.r * 0.85, b.r * 0.3, 0, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(150, 80, 50, 0.1)';
      this.ctx.fill();

      // Glossy pink ball gradient
      const lightX = b.x - b.r * 0.35;
      const lightY = b.y - b.r * 0.35;
      const grad = this.ctx.createRadialGradient(lightX, lightY, b.r * 0.1, b.x, b.y, b.r);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.25, b.color.highlight);
      grad.addColorStop(0.75, b.color.main);
      grad.addColorStop(1, b.color.dark);

      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      this.ctx.fillStyle = grad;
      this.ctx.fill();

      // Specular shine dot
      this.ctx.beginPath();
      this.ctx.arc(lightX, lightY, b.r * 0.22, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      this.ctx.fill();
    }
  }

  animate() {
    this.updatePhysics();
    this.draw();
    requestAnimationFrame(this.animate);
  }
}

// ============================================================================
// 3. CONTAINER 2: UNCOUNTABLE (COTTON FIBERS - RESHA)
// ============================================================================

class UncountableJar {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.fibers = [];
    this.airForce = 0;
    this.time = 0;
    this.glowMode = false;
    this.initSize();

    this.generateFibers(140);
    this.bindEvents();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initSize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = this.canvas.width = Math.floor(rect.width) || 190;
    this.height = this.canvas.height = Math.floor(rect.height) || 220;
  }

  generateFibers(count = 140) {
    this.fibers = [];
    const centerX = this.width / 2;
    const centerY = this.height / 2 + 20;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.pow(Math.random(), 0.75) * (this.width * 0.38);
      let currX = centerX + Math.cos(angle) * radius;
      let currY = centerY + Math.sin(angle) * (radius * 0.8);

      const segments = 4 + Math.floor(Math.random() * 4);
      const points = [{ x: currX, y: currY }];
      let segAngle = angle + (Math.random() - 0.5);

      for (let s = 0; s < segments; s++) {
        segAngle += (Math.random() - 0.5) * 1.1;
        currX += Math.cos(segAngle) * (7 + Math.random() * 9);
        currY += Math.sin(segAngle) * (7 + Math.random() * 9);

        currX = Math.max(15, Math.min(this.width - 15, currX));
        currY = Math.max(20, Math.min(this.height - 15, currY));

        points.push({
          x: currX,
          y: currY,
          phase: Math.random() * Math.PI * 2,
          speed: 0.02 + Math.random() * 0.03
        });
      }

      this.fibers.push({
        points: points,
        width: 0.6 + Math.random() * 0.9,
        alpha: 0.3 + Math.random() * 0.5
      });
    }
  }

  puffAir() {
    this.airForce = 10.0;
  }

  toggleGlow() {
    this.glowMode = !this.glowMode;
  }

  bindEvents() {
    window.addEventListener('resize', () => this.initSize());

    const puffBtn = document.getElementById('puffCottonBtn');
    if (puffBtn) puffBtn.addEventListener('click', () => this.puffAir());

    const glowBtn = document.getElementById('glowCottonBtn');
    if (glowBtn) glowBtn.addEventListener('click', () => this.toggleGlow());

    this.canvas.addEventListener('click', () => this.puffAir());
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.puffAir();
    }, { passive: false });
  }

  draw() {
    this.time += 0.03;
    if (this.airForce > 0.05) this.airForce *= 0.94;
    else this.airForce = 0;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Warm soft cotton cloud background
    const bgGlow = this.ctx.createRadialGradient(
      this.width / 2, this.height / 2 + 10, 5,
      this.width / 2, this.height / 2 + 10, this.width * 0.45
    );
    if (this.glowMode) {
      bgGlow.addColorStop(0, 'rgba(59, 122, 87, 0.22)');
      bgGlow.addColorStop(1, 'transparent');
    } else {
      bgGlow.addColorStop(0, 'rgba(255, 250, 240, 0.7)');
      bgGlow.addColorStop(1, 'transparent');
    }
    this.ctx.fillStyle = bgGlow;
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.lineCap = 'round';

    for (const fiber of this.fibers) {
      this.ctx.beginPath();
      const p0 = fiber.points[0];
      this.ctx.moveTo(p0.x, p0.y);

      for (let i = 1; i < fiber.points.length; i++) {
        const pt = fiber.points[i];
        const driftX = Math.sin(this.time * pt.speed + pt.phase) * (1.5 + this.airForce * 1.5);
        const driftY = Math.cos(this.time * pt.speed + pt.phase) * (1.0 + this.airForce);

        const prev = fiber.points[i - 1];
        const midX = (prev.x + pt.x + driftX) / 2;
        const midY = (prev.y + pt.y + driftY) / 2;
        this.ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
      }

      this.ctx.lineWidth = fiber.width;
      if (this.glowMode) {
        this.ctx.strokeStyle = `rgba(59, 122, 87, ${fiber.alpha * 1.2})`;
      } else {
        this.ctx.strokeStyle = `rgba(180, 160, 140, ${fiber.alpha})`;
      }
      this.ctx.stroke();
    }
  }

  animate() {
    this.draw();
    requestAnimationFrame(this.animate);
  }
}

// ============================================================================
// 4. CONTAINER 3: INFINITE (STREAMING GOLDEN SAND)
// ============================================================================

class InfiniteSandJar {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.particles = [];
    this.time = 0;
    this.streamRate = 12;
    this.initSize();

    this.sandPalette = ['#e4b873', '#d4a055', '#f7d58b', '#c28c46', '#ffd97d', '#b87d35'];
    this.initSandPile();
    this.bindEvents();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initSize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = this.canvas.width = Math.floor(rect.width) || 190;
    this.height = this.canvas.height = Math.floor(rect.height) || 220;
  }

  initSandPile() {
    this.particles = [];
    for (let i = 0; i < 260; i++) {
      const spread = (Math.random() - 0.5);
      const x = this.width / 2 + spread * (this.width * 0.7);
      const peakY = this.height - 14 - (1 - Math.abs(spread)) * 40;
      const y = peakY + Math.random() * (this.height - peakY - 8);

      this.particles.push({
        x: x,
        y: y,
        vx: 0,
        vy: 0,
        size: 0.9 + Math.random() * 1.4,
        color: this.sandPalette[Math.floor(Math.random() * this.sandPalette.length)],
        isSettled: true,
        alpha: 0.7 + Math.random() * 0.3
      });
    }
  }

  spawnGrains() {
    for (let i = 0; i < this.streamRate; i++) {
      this.particles.push({
        x: this.width / 2 + (Math.random() - 0.5) * 10,
        y: 16 + Math.random() * 4,
        vx: (Math.random() - 0.5) * 0.5,
        vy: 2.5 + Math.random() * 2.5,
        size: 0.8 + Math.random() * 1.3,
        color: this.sandPalette[Math.floor(Math.random() * this.sandPalette.length)],
        isSettled: false,
        alpha: 0.8
      });
    }
  }

  stirSand() {
    this.particles.forEach(p => {
      p.isSettled = false;
      p.vx += (Math.random() - 0.5) * 12;
      p.vy -= (Math.random() * 10);
    });
  }

  bindEvents() {
    window.addEventListener('resize', () => this.initSize());

    const stirBtn = document.getElementById('stirSandBtn');
    if (stirBtn) stirBtn.addEventListener('click', () => this.stirSand());

    const verseBtn = document.getElementById('jainVerseBtn');
    if (verseBtn) {
      verseBtn.addEventListener('click', () => {
        alert(
          "॥ जैन अनन्त विचार ॥\n\n" +
          "\"Ananta (Infinite) has no beginning and no end.\"\n\n" +
          "In ancient Jain mathematics (Anuyogadvara Sutra, c. 500 BCE), infinity was categorized into:\n" +
          "1. Parita Ananta (Incompletely Infinite)\n" +
          "2. Yukta Ananta (Truly Infinite)\n" +
          "3. Ananta-Ananta (Infinitely Infinite)\n\n" +
          "Like the endless grains of sand along sacred rivers, reality unfolds beyond human counting."
        );
      });
    }

    this.canvas.addEventListener('click', () => this.stirSand());
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.stirSand();
    }, { passive: false });
  }

  update() {
    this.time += 0.05;
    this.spawnGrains();

    const bottomFloor = this.height - 10;
    const maxParticles = 600;

    if (this.particles.length > maxParticles) {
      this.particles.splice(0, this.particles.length - maxParticles);
    }

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (p.isSettled) continue;

      p.vy += 0.2;
      p.x += p.vx;
      p.y += p.vy;

      const dist = Math.abs(p.x - this.width / 2);
      const ground = bottomFloor - Math.max(0, 36 - dist * 0.35);

      if (p.y >= ground) {
        p.y = ground + (Math.random() * 3 - 1.5);
        p.isSettled = true;
        p.vx = 0;
        p.vy = 0;
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    this.ctx.globalAlpha = 1.0;

    // Golden stream trickle center
    this.ctx.strokeStyle = 'rgba(212, 160, 55, 0.5)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(this.width / 2, 18);
    this.ctx.lineTo(this.width / 2 + Math.sin(this.time * 2) * 1.5, this.height - 50);
    this.ctx.stroke();
  }

  animate() {
    this.update();
    this.draw();
    requestAnimationFrame(this.animate);
  }
}

// ============================================================================
// 5. LIGHTBOX MODAL FOR CARBON DATING DIAGRAM (EASY MOBILE VIEWING)
// ============================================================================

function initDiagramLightbox() {
  const modal = document.getElementById('diagramLightbox');
  const trigger = document.getElementById('diagramTrigger');
  const closeBtn = document.getElementById('lightboxCloseBtn');

  if (!modal || !trigger) return;

  const openModal = () => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  trigger.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

// ============================================================================
// 6. PEACEFUL JAIN MEDITATIVE DRONE (WEB AUDIO API)
// ============================================================================

class MeditativeAudio {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.gainNode = null;
    this.toggleBtn = document.getElementById('audioToggleBtn');
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggle());
    }
  }

  initAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    // Warm calming bell harmonics (C# Tanpura Sa & Pa)
    const tones = [138.59, 207.65, 277.18];
    tones.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = i === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      oscGain.gain.setValueAtTime(0.12 / (i + 1), this.ctx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(this.gainNode);
      osc.start();
    });
  }

  toggle() {
    if (!this.ctx) this.initAudio();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    if (!this.isPlaying) {
      this.gainNode.gain.setTargetAtTime(0.25, this.ctx.currentTime, 1.0);
      this.isPlaying = true;
      if (this.toggleBtn) {
        this.toggleBtn.classList.add('active');
        this.toggleBtn.innerHTML = `<span>🔔</span> Sound: On`;
      }
    } else {
      this.gainNode.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.5);
      this.isPlaying = false;
      if (this.toggleBtn) {
        this.toggleBtn.classList.remove('active');
        this.toggleBtn.innerHTML = `<span>🔕</span> Sound`;
      }
    }
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

window.addEventListener('DOMContentLoaded', () => {
  initVesselTabs();
  initDiagramLightbox();

  window.countableJarInstance = new CountableJar('countableCanvas', 'countableCountPill');
  window.uncountableJarInstance = new UncountableJar('uncountableCanvas');
  window.infiniteSandJarInstance = new InfiniteSandJar('infiniteCanvas');
  window.meditativeAudioInstance = new MeditativeAudio();
});

window.addEventListener('load', () => {
  if (window.countableJarInstance) window.countableJarInstance.initSize();
  if (window.uncountableJarInstance) window.uncountableJarInstance.initSize();
  if (window.infiniteSandJarInstance) window.infiniteSandJarInstance.initSize();
});
