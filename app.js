/**
 * BEYOND COUNT - Ancient Indian Science Exhibition
 * Core Physics Engines for Transparent Containers:
 * 1. Countable: Pink Balls Physics & Collision
 * 2. Uncountable: Cotton Fibers ("Resha") Fluid Filaments
 * 3. Infinite: Shimmering Sand & Cosmic Dust Dynamic Stream
 * Plus Web Audio Ambient Drone
 */

// ============================================================================
// 1. CONTAINER 1: COUNTABLE (GLOSSY PINK BALLS)
// ============================================================================

class CountableJar {
  constructor(canvasId, counterId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.counterEl = document.getElementById(counterId);

    this.balls = [];
    this.gravity = 0.38;
    this.bounce = 0.72;
    this.friction = 0.985;
    this.initSize();

    // Spawn initial set of countable pink balls
    this.resetBalls(24);

    this.bindEvents();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initSize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = this.canvas.width = rect.width || 250;
    this.height = this.canvas.height = rect.height || 300;
  }

  resetBalls(count = 24) {
    this.balls = [];
    for (let i = 0; i < count; i++) {
      this.addBall(
        40 + Math.random() * (this.width - 80),
        30 + Math.random() * (this.height - 120),
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
        11 + Math.random() * 4
      );
    }
    this.updateCountDisplay();
  }

  addBall(x, y, vx = 0, vy = 0, r = 12) {
    // Soft vibrant pink palette
    const pinkTones = [
      { main: '#ff4d88', highlight: '#ff99c8', dark: '#b3134d' },
      { main: '#ff3377', highlight: '#ff80aa', dark: '#99003d' },
      { main: '#ff5c99', highlight: '#ffb3d1', dark: '#cc1f66' },
      { main: '#fa5590', highlight: '#ffa6c9', dark: '#a61a53' },
      { main: '#f72585', highlight: '#fca3cc', dark: '#800f43' }
    ];
    const color = pinkTones[Math.floor(Math.random() * pinkTones.length)];

    this.balls.push({
      x: x || this.width / 2,
      y: y || 40,
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
      b.vx += (Math.random() - 0.5) * 22;
      b.vy -= (6 + Math.random() * 16);
    });
  }

  updateCountDisplay() {
    if (this.counterEl) {
      this.counterEl.textContent = this.balls.length;
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.initSize();
    });

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      this.addBall(clickX, clickY, (Math.random() - 0.5) * 4, -2);
    });

    const shakeBtn = document.getElementById('shakeJarBtn');
    if (shakeBtn) {
      shakeBtn.addEventListener('click', () => this.shake());
    }

    const addBallBtn = document.getElementById('addBallBtn');
    if (addBallBtn) {
      addBallBtn.addEventListener('click', () => {
        this.addBall(this.width / 2 + (Math.random() - 0.5) * 40, 30, (Math.random() - 0.5) * 4, 1);
      });
    }

    const resetBallsBtn = document.getElementById('resetBallsBtn');
    if (resetBallsBtn) {
      resetBallsBtn.addEventListener('click', () => this.resetBalls(24));
    }
  }

  updatePhysics() {
    const bottomLimit = this.height - 14;
    const leftLimit = 16;
    const rightLimit = this.width - 16;
    const topLimit = 18;

    for (let i = 0; i < this.balls.length; i++) {
      const b = this.balls[i];
      b.vy += this.gravity;
      b.vx *= this.friction;
      b.vy *= this.friction;

      b.x += b.vx;
      b.y += b.vy;

      // Bottom bounce
      if (b.y + b.r > bottomLimit) {
        b.y = bottomLimit - b.r;
        b.vy = -b.vy * this.bounce;
        b.vx *= 0.95;
      }
      // Top bounce
      if (b.y - b.r < topLimit) {
        b.y = topLimit + b.r;
        b.vy = -b.vy * this.bounce;
      }
      // Left bounce
      if (b.x - b.r < leftLimit) {
        b.x = leftLimit + b.r;
        b.vx = -b.vx * this.bounce;
      }
      // Right bounce
      if (b.x + b.r > rightLimit) {
        b.x = rightLimit - b.r;
        b.vx = -b.vx * this.bounce;
      }

      // Ball-to-ball collisions
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

          // Separate
          b.x -= nx * overlap;
          b.y -= ny * overlap;
          b2.x += nx * overlap;
          b2.y += ny * overlap;

          // Elastic collision impulse
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

    // Subtle bottom glass shelf shadow inside jar
    const gradFloor = this.ctx.createRadialGradient(
      this.width / 2, this.height - 12, 10,
      this.width / 2, this.height - 12, this.width * 0.45
    );
    gradFloor.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
    gradFloor.addColorStop(1, 'transparent');
    this.ctx.fillStyle = gradFloor;
    this.ctx.fillRect(10, this.height - 30, this.width - 20, 25);

    // Draw glossy 3D pink spheres
    for (const b of this.balls) {
      // Ambient shadow below ball
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.ellipse(b.x, Math.min(this.height - 14, b.y + b.r * 0.85), b.r * 0.9, b.r * 0.35, 0, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      this.ctx.fill();
      this.ctx.restore();

      // Spherical 3D gradient
      const lightX = b.x - b.r * 0.35;
      const lightY = b.y - b.r * 0.38;
      const sphereGrad = this.ctx.createRadialGradient(
        lightX, lightY, b.r * 0.1,
        b.x, b.y, b.r
      );
      sphereGrad.addColorStop(0, '#ffffff');
      sphereGrad.addColorStop(0.2, b.color.highlight);
      sphereGrad.addColorStop(0.7, b.color.main);
      sphereGrad.addColorStop(1, b.color.dark);

      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      this.ctx.fillStyle = sphereGrad;
      this.ctx.fill();

      // Specular pin-light
      this.ctx.beginPath();
      this.ctx.arc(lightX, lightY, b.r * 0.22, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
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
// 2. CONTAINER 2: UNCOUNTABLE (COTTON FIBERS - RESHA)
// ============================================================================

class UncountableJar {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.fibers = [];
    this.airDisturbance = 0;
    this.time = 0;
    this.backlightMode = false;
    this.initSize();

    // Generate thousands of delicate cotton filament strands
    this.generateFibers(220);

    this.bindEvents();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initSize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = this.canvas.width = rect.width || 250;
    this.height = this.canvas.height = rect.height || 300;
  }

  generateFibers(count = 220) {
    this.fibers = [];
    const centerX = this.width / 2;
    const centerY = this.height / 2 + 30;

    for (let i = 0; i < count; i++) {
      // Cluster densely towards the center and lower half like packed raw cotton
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.pow(Math.random(), 0.7) * (this.width * 0.38);
      const baseX = centerX + Math.cos(angle) * radius;
      const baseY = centerY + Math.sin(angle) * (radius * 0.85);

      const segments = 4 + Math.floor(Math.random() * 5);
      const points = [];
      let currX = baseX;
      let currY = baseY;

      points.push({ x: currX, y: currY });

      const segLen = 9 + Math.random() * 12;
      let segAngle = angle + (Math.random() - 0.5) * 1.5;

      for (let s = 0; s < segments; s++) {
        segAngle += (Math.random() - 0.5) * 1.2;
        currX += Math.cos(segAngle) * segLen;
        currY += Math.sin(segAngle) * segLen;

        // Keep inside jar walls
        currX = Math.max(20, Math.min(this.width - 20, currX));
        currY = Math.max(25, Math.min(this.height - 20, currY));

        points.push({
          x: currX,
          y: currY,
          baseX: currX,
          baseY: currY,
          phase: Math.random() * Math.PI * 2,
          speed: 0.02 + Math.random() * 0.03
        });
      }

      this.fibers.push({
        points: points,
        width: 0.6 + Math.random() * 1.1,
        alpha: 0.25 + Math.random() * 0.55,
        tone: Math.random() > 0.3 ? 'pure' : 'warm'
      });
    }
  }

  puffAir() {
    this.airDisturbance = 12.0;
  }

  toggleBacklight() {
    this.backlightMode = !this.backlightMode;
  }

  bindEvents() {
    window.addEventListener('resize', () => this.initSize());

    const puffBtn = document.getElementById('puffCottonBtn');
    if (puffBtn) {
      puffBtn.addEventListener('click', () => this.puffAir());
    }

    const inspectBtn = document.getElementById('inspectCottonBtn');
    if (inspectBtn) {
      inspectBtn.addEventListener('click', () => this.toggleBacklight());
    }

    this.canvas.addEventListener('click', () => this.puffAir());
  }

  draw() {
    this.time += 0.025;
    if (this.airDisturbance > 0.05) {
      this.airDisturbance *= 0.94;
    } else {
      this.airDisturbance = 0;
    }

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Backlight / ambient cotton puff glow
    const centerGlow = this.ctx.createRadialGradient(
      this.width / 2, this.height / 2 + 20, 10,
      this.width / 2, this.height / 2 + 20, this.width * 0.45
    );
    if (this.backlightMode) {
      centerGlow.addColorStop(0, 'rgba(210, 235, 255, 0.22)');
      centerGlow.addColorStop(0.6, 'rgba(180, 210, 245, 0.08)');
      centerGlow.addColorStop(1, 'transparent');
    } else {
      centerGlow.addColorStop(0, 'rgba(255, 250, 240, 0.14)');
      centerGlow.addColorStop(0.7, 'rgba(255, 240, 220, 0.04)');
      centerGlow.addColorStop(1, 'transparent');
    }
    this.ctx.fillStyle = centerGlow;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw all entangled fibers ("resha")
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    for (const fiber of this.fibers) {
      this.ctx.beginPath();
      const p0 = fiber.points[0];
      this.ctx.moveTo(p0.x, p0.y);

      for (let i = 1; i < fiber.points.length; i++) {
        const pt = fiber.points[i];

        // Brownian gentle drift + air disturbance
        const driftX = Math.sin(this.time * pt.speed + pt.phase) * (1.8 + this.airDisturbance * 1.5);
        const driftY = Math.cos(this.time * pt.speed * 0.8 + pt.phase) * (1.2 + this.airDisturbance * 1.2);

        // Curving bezier thread
        const prevPt = fiber.points[i - 1];
        const midX = (prevPt.x + pt.x + driftX) / 2;
        const midY = (prevPt.y + pt.y + driftY) / 2;
        this.ctx.quadraticCurveTo(prevPt.x, prevPt.y, midX, midY);
      }

      this.ctx.lineWidth = fiber.width;
      if (this.backlightMode) {
        this.ctx.strokeStyle = `rgba(200, 235, 255, ${Math.min(1, fiber.alpha * 1.4)})`;
      } else {
        if (fiber.tone === 'pure') {
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${fiber.alpha})`;
        } else {
          this.ctx.strokeStyle = `rgba(250, 242, 230, ${fiber.alpha})`;
        }
      }
      this.ctx.stroke();
    }

    // Micro wisps floating in air draft
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let w = 0; w < 18; w++) {
      const wx = (this.width / 2) + Math.sin(this.time * 0.5 + w * 2.3) * (this.width * 0.35);
      const wy = (this.height / 2 + 10) + Math.cos(this.time * 0.4 + w * 1.7) * (this.height * 0.35);
      this.ctx.beginPath();
      this.ctx.arc(wx, wy, 0.9, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  animate() {
    this.draw();
    requestAnimationFrame(this.animate);
  }
}

// ============================================================================
// 3. CONTAINER 3: INFINITE (STREAMING GOLDEN SAND & COSMIC DIRT)
// ============================================================================

class InfiniteSandJar {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.particles = [];
    this.settledPoints = [];
    this.streamRate = 22; // grains per frame
    this.time = 0;
    this.swirlForce = 0;
    this.initSize();

    // Sand color palette: golden desert silica, holy Ganges sand, sparkling mica
    this.sandPalette = [
      '#e4b873',
      '#d4a055',
      '#f7d58b',
      '#c28c46',
      '#ffd97d',
      '#b87d35',
      '#ffeec2'
    ];

    this.initPrePopulatedSand();
    this.bindEvents();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initSize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = this.canvas.width = rect.width || 250;
    this.height = this.canvas.height = rect.height || 300;
  }

  initPrePopulatedSand() {
    this.particles = [];
    // Pre-fill bottom sand dune heap
    for (let i = 0; i < 450; i++) {
      const spread = (Math.random() - 0.5);
      const x = this.width / 2 + spread * (this.width * 0.7);
      const peakY = this.height - 20 - (1 - Math.abs(spread)) * 55;
      const y = peakY + Math.random() * (this.height - peakY - 14);

      this.particles.push({
        x: x,
        y: y,
        vx: 0,
        vy: 0,
        size: 0.9 + Math.random() * 1.5,
        color: this.sandPalette[Math.floor(Math.random() * this.sandPalette.length)],
        isSettled: true,
        alpha: 0.6 + Math.random() * 0.4
      });
    }
  }

  spawnStreamGrains() {
    // Continuously pour fine stream from top neck
    const pourCount = this.streamRate;
    for (let i = 0; i < pourCount; i++) {
      const originX = this.width / 2 + (Math.random() - 0.5) * 14;
      const originY = 22 + Math.random() * 6;

      this.particles.push({
        x: originX,
        y: originY,
        vx: (Math.random() - 0.5) * 0.7 + Math.sin(this.time) * 0.4,
        vy: 2.8 + Math.random() * 3.5,
        size: 0.8 + Math.random() * 1.4,
        color: this.sandPalette[Math.floor(Math.random() * this.sandPalette.length)],
        isSettled: false,
        alpha: 0.7 + Math.random() * 0.3
      });
    }
  }

  stirSand() {
    this.swirlForce = 8.0;
    this.particles.forEach(p => {
      p.isSettled = false;
      p.vx += (Math.random() - 0.5) * 16;
      p.vy -= (Math.random() * 14);
    });
  }

  bindEvents() {
    window.addEventListener('resize', () => this.initSize());

    const stirBtn = document.getElementById('stirSandBtn');
    if (stirBtn) {
      stirBtn.addEventListener('click', () => this.stirSand());
    }

    const cosmicModalBtn = document.getElementById('cosmicInfinityBtn');
    if (cosmicModalBtn) {
      cosmicModalBtn.addEventListener('click', () => {
        alert(
          "॥ ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते ।\n" +
          "पूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते ॥\n\n" +
          "\"That is Infinite, and This is Infinite;\n" +
          "From Infinite, Infinite emerges;\n" +
          "When Infinite is taken away from Infinite,\n" +
          "Infinite alone remains.\"\n\n" +
          "Ancient Indian Mathematics & Philosophy recognized that the grains of sand on the holy banks of the Ganges (Ganga-valuka) symbolize the boundless, uncountable nature of the universe."
        );
      });
    }

    this.canvas.addEventListener('mousemove', (e) => {
      if (e.buttons === 1) {
        this.stirSand();
      }
    });

    this.canvas.addEventListener('click', () => this.stirSand());
  }

  update() {
    this.time += 0.05;
    if (this.swirlForce > 0.1) {
      this.swirlForce *= 0.96;
    } else {
      this.swirlForce = 0;
    }

    this.spawnStreamGrains();

    const bottomFloor = this.height - 15;
    const maxParticles = 900;

    // Prune oldest settled particles when exceeding limit to keep high FPS
    if (this.particles.length > maxParticles) {
      this.particles.splice(0, this.particles.length - maxParticles);
    }

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (p.isSettled) continue;

      p.vy += 0.22; // gravity
      p.x += p.vx;
      p.y += p.vy;

      // Dynamic sand pile height (peak at center)
      const distFromCenter = Math.abs(p.x - this.width / 2);
      const heapHeight = Math.max(0, 48 - (distFromCenter * 0.38));
      const groundLevel = bottomFloor - heapHeight;

      if (p.y >= groundLevel) {
        p.y = groundLevel + (Math.random() * 4 - 2);
        p.isSettled = true;
        p.vx = 0;
        p.vy = 0;
      }

      // Jar boundary collision
      if (p.x < 18) {
        p.x = 18;
        p.vx = -p.vx * 0.4;
      }
      if (p.x > this.width - 18) {
        p.x = this.width - 18;
        p.vx = -p.vx * 0.4;
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Warm golden ambient illumination inside vessel
    const glow = this.ctx.createRadialGradient(
      this.width / 2, this.height - 40, 20,
      this.width / 2, this.height - 40, this.width * 0.45
    );
    glow.addColorStop(0, 'rgba(242, 156, 42, 0.22)');
    glow.addColorStop(0.7, 'rgba(217, 160, 91, 0.05)');
    glow.addColorStop(1, 'transparent');
    this.ctx.fillStyle = glow;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Sand dune base silhouette
    this.ctx.beginPath();
    this.ctx.moveTo(18, this.height - 18);
    this.ctx.quadraticCurveTo(this.width / 2, this.height - 72, this.width - 18, this.height - 18);
    this.ctx.lineTo(this.width - 18, this.height - 12);
    this.ctx.lineTo(18, this.height - 12);
    this.ctx.closePath();
    this.ctx.fillStyle = 'rgba(180, 120, 50, 0.4)';
    this.ctx.fill();

    // Render individual grains
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    this.ctx.globalAlpha = 1.0;

    // Golden stream central shimmer line
    const streamShimmer = this.ctx.createLinearGradient(this.width / 2, 20, this.width / 2, this.height - 60);
    streamShimmer.addColorStop(0, 'rgba(255, 230, 150, 0.6)');
    streamShimmer.addColorStop(0.8, 'rgba(242, 156, 42, 0.3)');
    streamShimmer.addColorStop(1, 'transparent');
    this.ctx.strokeStyle = streamShimmer;
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(this.width / 2, 24);
    this.ctx.lineTo(this.width / 2 + Math.sin(this.time * 2) * 2, this.height - 70);
    this.ctx.stroke();
  }

  animate() {
    this.update();
    this.draw();
    requestAnimationFrame(this.animate);
  }
}

// ============================================================================
// 4. ANCIENT AMBIENT AUDIO SYNTHESIZER (WEB AUDIO API - 100% SELF-CONTAINED)
// ============================================================================

class ExhibitionAudio {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.gainNode = null;
    this.oscillators = [];
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

    // Ancient Indian Tanpura Drone Harmonics (C# fundamental ~ 138.59 Hz)
    // Sa (Root), Pa (Fifth), Sa (Octave)
    const droneFreqs = [138.59, 207.65, 277.18, 554.37];

    droneFreqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Subtle detune chorus effect
      osc.detune.setValueAtTime((idx - 1.5) * 4, this.ctx.currentTime);

      oscGain.gain.setValueAtTime(0.18 / (idx + 1), this.ctx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(this.gainNode);

      osc.start();
      this.oscillators.push(osc);
    });
  }

  toggle() {
    if (!this.ctx) {
      this.initAudio();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (!this.isPlaying) {
      // Fade in
      this.gainNode.gain.setTargetAtTime(0.35, this.ctx.currentTime, 1.2);
      this.isPlaying = true;
      if (this.toggleBtn) {
        this.toggleBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
          Ambiance: On
        `;
        this.toggleBtn.classList.add('active');
      }
    } else {
      // Fade out
      this.gainNode.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.6);
      this.isPlaying = false;
      if (this.toggleBtn) {
        this.toggleBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          </svg>
          Ambiance: Muted
        `;
        this.toggleBtn.classList.remove('active');
      }
    }
  }
}

// ============================================================================
// INITIALIZATION ON DOM READY
// ============================================================================

window.addEventListener('DOMContentLoaded', () => {
  // Initialize the three transparent containers
  window.countableJarInstance = new CountableJar('countableCanvas', 'countableNumDisplay');
  window.uncountableJarInstance = new UncountableJar('uncountableCanvas');
  window.infiniteSandJarInstance = new InfiniteSandJar('infiniteCanvas');

  // Initialize Ambiance audio
  window.exhibitionAudioInstance = new ExhibitionAudio();
});

window.addEventListener('load', () => {
  // Trigger resize refresh once web fonts and images settle
  if (window.countableJarInstance) window.countableJarInstance.initSize();
  if (window.uncountableJarInstance) window.uncountableJarInstance.initSize();
  if (window.infiniteSandJarInstance) window.infiniteSandJarInstance.initSize();
});
