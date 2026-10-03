/**
 * BEYOND COUNT - Simplified Mobile-First Carbon Dating Lab
 * Super easy to understand:
 * - Slider from 0 to 50,000 years
 * - Plain language explanation ("50% left = 5,730 yrs ago!")
 * - 90 lightweight atoms decaying on mobile canvas
 * - Indian relic quick-tap buttons
 */

class MobileCarbonLab {
  constructor() {
    this.canvas = document.getElementById('decayAtomCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.slider = document.getElementById('datingTimeSlider');
    this.timeDisplay = document.getElementById('sliderTimeValue');
    this.remainingDisplay = document.getElementById('statRemainingC14');
    this.decayedDisplay = document.getElementById('statDecayedN14');
    this.eraDisplay = document.getElementById('statHistoricalEra');
    this.canvasCount = document.getElementById('mobileAtomCountPill');

    this.halfLife = 5730;
    this.totalAtoms = 90;
    this.atoms = [];
    this.currentYears = 0;
    this.time = 0;

    this.initCanvasSize();
    this.initAtoms();
    this.bindEvents();
    this.updateSimulation(0);

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initCanvasSize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = this.canvas.width = Math.floor(rect.width) || 300;
    this.height = this.canvas.height = Math.floor(rect.height) || 170;
  }

  initAtoms() {
    this.atoms = [];
    for (let i = 0; i < this.totalAtoms; i++) {
      this.atoms.push({
        x: 15 + Math.random() * (this.width - 30),
        y: 15 + Math.random() * (this.height - 30),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        isC14: true,
        decayRank: Math.random(),
        phase: Math.random() * Math.PI * 2,
        pulse: 0
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.initCanvasSize();
      this.initAtoms();
      this.updateSimulation(this.currentYears);
    });

    if (this.slider) {
      this.slider.addEventListener('input', (e) => {
        this.updateSimulation(parseFloat(e.target.value));
      });
    }

    // Relic preset buttons
    const presets = [
      { id: 'relicLiving', years: 0 },
      { id: 'relicBakhshali', years: 1720 },
      { id: 'relicAshoka', years: 2320 },
      { id: 'relicHarappa', years: 4500 },
      { id: 'relicBhimbetka', years: 10000 },
      { id: 'relicFossil', years: 35000 }
    ];

    presets.forEach(p => {
      const btn = document.getElementById(p.id);
      if (btn) {
        btn.addEventListener('click', () => {
          if (this.slider) this.slider.value = p.years;
          this.updateSimulation(p.years);
        });
      }
    });

    // 4 Easy Step Cards Tapping
    const stepCards = document.querySelectorAll('.step-cute-card');
    stepCards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        stepCards.forEach(c => c.classList.remove('highlighted'));
        card.classList.add('highlighted');

        if (idx === 0 || idx === 1) {
          if (this.slider) this.slider.value = 0;
          this.updateSimulation(0);
        } else if (idx === 2) {
          if (this.slider) this.slider.value = 5730;
          this.updateSimulation(5730);
        } else if (idx === 3) {
          if (this.slider) this.slider.value = 4500;
          this.updateSimulation(4500);
        }
      });
    });
  }

  updateSimulation(years) {
    this.currentYears = years;
    const halfLives = years / this.halfLife;
    const fractionC14 = Math.pow(0.5, halfLives);
    const percentC14 = (fractionC14 * 100).toFixed(1);
    const percentN14 = (100 - parseFloat(percentC14)).toFixed(1);

    if (this.timeDisplay) {
      this.timeDisplay.textContent = `${years.toLocaleString()} Years Ago`;
    }
    if (this.remainingDisplay) {
      this.remainingDisplay.textContent = `${percentC14}%`;
    }
    if (this.decayedDisplay) {
      this.decayedDisplay.textContent = `${percentN14}%`;
    }

    // Simple plain English era insight
    let simpleText = "Fresh living organism (100% full of Carbon-14)";
    if (years === 0) {
      simpleText = "🌱 Fresh living organism (100% full of Carbon-14)";
    } else if (years <= 2000) {
      simpleText = `📜 ~${years.toLocaleString()} yrs ago: Classical Indian Era (like the Bakhshali Manuscript zero dot!)`;
    } else if (years <= 3500) {
      simpleText = `🏛️ ~${years.toLocaleString()} yrs ago: Maurya Empire & Ashokan Capital wooden pillars`;
    } else if (years <= 6000) {
      simpleText = `🏺 ~${years.toLocaleString()} yrs ago: Indus Valley / Harappan Civilization (Rakhigarhi)`;
    } else if (years <= 15000) {
      simpleText = `🎨 ~${years.toLocaleString()} yrs ago: Stone Age cave rock art (Bhimbetka charcoal)`;
    } else {
      simpleText = `🦴 ~${years.toLocaleString()} yrs ago: Ancient prehistoric megafauna fossils`;
    }

    if (this.eraDisplay) {
      this.eraDisplay.textContent = simpleText;
    }

    let activeC14 = 0;
    this.atoms.forEach(a => {
      const shouldBeC14 = a.decayRank <= fractionC14;
      if (a.isC14 && !shouldBeC14) a.pulse = 1.0;
      a.isC14 = shouldBeC14;
      if (a.isC14) activeC14++;
    });

    if (this.canvasCount) {
      this.canvasCount.textContent = `${activeC14} C-14 • ${this.totalAtoms - activeC14} N-14`;
    }
  }

  animate() {
    this.time += 0.03;
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (const a of this.atoms) {
      a.x += Math.sin(this.time + a.phase) * 0.3 + a.vx;
      a.y += Math.cos(this.time * 0.9 + a.phase) * 0.3 + a.vy;

      if (a.x < 10) a.x = this.width - 10;
      if (a.x > this.width - 10) a.x = 10;
      if (a.y < 10) a.y = this.height - 10;
      if (a.y > this.height - 10) a.y = 10;

      if (a.pulse > 0.05) {
        this.ctx.beginPath();
        this.ctx.arc(a.x, a.y, 10 * (1 - a.pulse), 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(255, 200, 80, ${a.pulse * 0.7})`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        a.pulse *= 0.92;
      }

      this.ctx.beginPath();
      if (a.isC14) {
        this.ctx.arc(a.x, a.y, 3.8, 0, Math.PI * 2);
        this.ctx.fillStyle = '#39e75f';
      } else {
        this.ctx.arc(a.x, a.y, 3.2, 0, Math.PI * 2);
        this.ctx.fillStyle = '#4f8cf6';
      }
      this.ctx.fill();
    }

    requestAnimationFrame(this.animate);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.mobileCarbonLabInstance = new MobileCarbonLab();
});

window.addEventListener('load', () => {
  if (window.mobileCarbonLabInstance) {
    window.mobileCarbonLabInstance.initCanvasSize();
    window.mobileCarbonLabInstance.initAtoms();
    window.mobileCarbonLabInstance.updateSimulation(window.mobileCarbonLabInstance.currentYears);
  }
});
