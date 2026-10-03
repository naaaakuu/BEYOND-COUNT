/**
 * BEYOND COUNT - Radiocarbon Chronometry Wing
 * Interactive Carbon-14 Decay Simulator, Atom Particle Canvas,
 * Timeline Slider, and Historical Indian Relic Presets.
 */

class CarbonDatingSimulator {
  constructor() {
    this.canvas = document.getElementById('decayAtomCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.slider = document.getElementById('datingTimeSlider');
    this.timeDisplay = document.getElementById('sliderTimeValue');
    this.remainingDisplay = document.getElementById('statRemainingC14');
    this.decayedDisplay = document.getElementById('statDecayedN14');
    this.halfLifeDisplay = document.getElementById('statHalfLivesElapsed');
    this.eraDisplay = document.getElementById('statHistoricalEra');
    this.formulaValDisplay = document.getElementById('formulaCurrentVal');
    this.canvasCounterDisplay = document.getElementById('canvasAtomCountDisplay');

    this.halfLife = 5730; // Half life of C-14 in years
    this.totalAtoms = 180;
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
    this.width = this.canvas.width = rect.width || 500;
    this.height = this.canvas.height = rect.height || 250;
  }

  initAtoms() {
    this.atoms = [];
    for (let i = 0; i < this.totalAtoms; i++) {
      // Distribute randomly across the canvas
      this.atoms.push({
        id: i,
        x: 20 + Math.random() * (this.width - 40),
        y: 20 + Math.random() * (this.height - 40),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        isC14: true, // starts as C-14
        decayRank: Math.random(), // used for deterministic threshold decay
        phase: Math.random() * Math.PI * 2,
        decayPulse: 0
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

    // Historical Indian Artifact Preset Buttons
    const presets = [
      { id: 'presetModern', years: 0 },
      { id: 'presetBakhshali', years: 1720 },
      { id: 'presetAshoka', years: 2320 },
      { id: 'presetHarappa', years: 4500 },
      { id: 'presetBhimbetka', years: 10000 },
      { id: 'presetPaleo', years: 35000 }
    ];

    presets.forEach(p => {
      const btn = document.getElementById(p.id);
      if (btn) {
        btn.addEventListener('click', () => {
          if (this.slider) {
            this.slider.value = p.years;
          }
          this.updateSimulation(p.years);
        });
      }
    });

    // 4-Step Interactive Process Cards
    const stepCards = document.querySelectorAll('.carbon-step-card');
    stepCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        stepCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        // Contextual slider nudge for steps
        if (index === 0 || index === 1) {
          if (this.slider) { this.slider.value = 0; this.updateSimulation(0); }
        } else if (index === 2) {
          if (this.slider) { this.slider.value = 5730; this.updateSimulation(5730); }
        } else if (index === 3) {
          if (this.slider) { this.slider.value = 4500; this.updateSimulation(4500); }
        }
      });
    });
  }

  updateSimulation(years) {
    this.currentYears = years;

    // Exponential radioactive decay: N(t) = N0 * (1/2)^(t / T_half)
    const halfLives = years / this.halfLife;
    const fractionC14 = Math.pow(0.5, halfLives);
    const percentC14 = (fractionC14 * 100).toFixed(1);
    const percentN14 = (100 - parseFloat(percentC14)).toFixed(1);

    // Update UI numbers
    if (this.timeDisplay) {
      this.timeDisplay.textContent = years.toLocaleString() + ' Years';
    }
    if (this.remainingDisplay) {
      this.remainingDisplay.textContent = percentC14 + '%';
    }
    if (this.decayedDisplay) {
      this.decayedDisplay.textContent = percentN14 + '%';
    }
    if (this.halfLifeDisplay) {
      this.halfLifeDisplay.textContent = halfLives.toFixed(2) + ' t½';
    }
    if (this.formulaValDisplay) {
      this.formulaValDisplay.textContent = `N(${years}) = N₀ × (½)^(${halfLives.toFixed(2)}) = ${percentC14}%`;
    }

    // Determine Indian Archaeological Chronology Era
    let eraText = 'Living / Present Era';
    if (years === 0) {
      eraText = 'Modern Biomass (100% C-14 equilibrium)';
    } else if (years < 1000) {
      eraText = 'Late Medieval & Early Modern Indian Relics';
    } else if (years < 2000) {
      eraText = 'Classical Indian Era (Bakhshali Manuscript, Gupta Age)';
    } else if (years < 3500) {
      eraText = 'Iron Age & Maurya Era (Ashokan Timber & Pillars)';
    } else if (years < 5500) {
      eraText = 'Indus Valley / Harappan Civilization (Rakhigarhi, Dholavira)';
    } else if (years < 12000) {
      eraText = 'Mesolithic Indian Cultures (Bhimbetka Cave Charcoal Art)';
    } else if (years < 45000) {
      eraText = 'Upper Paleolithic Stone Age & Ancient Megafauna';
    } else {
      eraText = 'Radiocarbon Limit (~50,000 yrs): Beyond Detection Count';
    }

    if (this.eraDisplay) {
      this.eraDisplay.textContent = eraText;
    }

    // Update atoms state: exactly fractionC14 portion stays C14, rest become decayed N14
    let activeC14Count = 0;
    this.atoms.forEach(atom => {
      const shouldBeC14 = atom.decayRank <= fractionC14;
      if (atom.isC14 && !shouldBeC14) {
        atom.decayPulse = 1.0; // trigger beta particle emission animation
      }
      atom.isC14 = shouldBeC14;
      if (atom.isC14) activeC14Count++;
    });

    if (this.canvasCounterDisplay) {
      this.canvasCounterDisplay.textContent = `${activeC14Count} C-14 / ${this.totalAtoms - activeC14Count} N-14`;
    }
  }

  animate() {
    this.time += 0.03;
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Subtle dark grid background representing molecular detector chamber
    this.ctx.strokeStyle = 'rgba(229, 185, 88, 0.06)';
    this.ctx.lineWidth = 1;
    const gridSize = 30;
    for (let x = 0; x < this.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }

    // Draw and animate atom particles
    for (const atom of this.atoms) {
      // Brownian gentle vibration
      atom.x += Math.sin(this.time + atom.phase) * 0.4 + atom.vx;
      atom.y += Math.cos(this.time * 0.9 + atom.phase) * 0.4 + atom.vy;

      // Wrap around walls
      if (atom.x < 15) atom.x = this.width - 15;
      if (atom.x > this.width - 15) atom.x = 15;
      if (atom.y < 15) atom.y = this.height - 15;
      if (atom.y > this.height - 15) atom.y = 15;

      // Draw decay beta pulse wave if decaying
      if (atom.decayPulse > 0.05) {
        this.ctx.beginPath();
        this.ctx.arc(atom.x, atom.y, 14 * (1.1 - atom.decayPulse), 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(255, 220, 100, ${atom.decayPulse * 0.8})`;
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
        atom.decayPulse *= 0.94;
      }

      // Draw atom core
      this.ctx.beginPath();
      if (atom.isC14) {
        // Active Carbon-14: Luminous Emerald Green / Amber
        this.ctx.arc(atom.x, atom.y, 4.5, 0, Math.PI * 2);
        this.ctx.fillStyle = '#39e75f';
        this.ctx.shadowColor = '#39e75f';
        this.ctx.shadowBlur = 8;
        this.ctx.fill();

        // Inner nucleus gleam
        this.ctx.beginPath();
        this.ctx.arc(atom.x - 1, atom.y - 1, 1.5, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowBlur = 0;
        this.ctx.fill();
      } else {
        // Decayed Nitrogen-14: Calmer Sapphire Blue
        this.ctx.arc(atom.x, atom.y, 3.8, 0, Math.PI * 2);
        this.ctx.fillStyle = '#3b82f6';
        this.ctx.shadowColor = '#3b82f6';
        this.ctx.shadowBlur = 4;
        this.ctx.fill();

        // Inner nucleus gleam
        this.ctx.beginPath();
        this.ctx.arc(atom.x - 1, atom.y - 1, 1.2, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.shadowBlur = 0;
        this.ctx.fill();
      }
      this.ctx.shadowBlur = 0; // reset shadow
    }

    requestAnimationFrame(this.animate);
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.carbonSimulatorInstance = new CarbonDatingSimulator();
});

window.addEventListener('load', () => {
  if (window.carbonSimulatorInstance) {
    window.carbonSimulatorInstance.initCanvasSize();
    window.carbonSimulatorInstance.initAtoms();
    window.carbonSimulatorInstance.updateSimulation(window.carbonSimulatorInstance.currentYears);
  }
});
