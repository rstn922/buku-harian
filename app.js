// app.js - Logika Modern Glassmorphism & Balon Rindu Interaktif

document.addEventListener('DOMContentLoaded', () => {
  // === 1. AUDIO PLAYER CONTROLLER (RETRO MP3 PLAYER) ===
  const audio = new Audio('assets/EVERYTHING.mp3');
  audio.loop = true;
  audio.volume = 0.55;
  let isPlaying = false;

  const btnPlayPause = document.getElementById('mp3-play-pause');
  const mp3Status = document.getElementById('mp3-status');

  function playMusic() {
    audio.play().then(() => {
      if (btnPlayPause) btnPlayPause.classList.add('playing');
      if (mp3Status) mp3Status.textContent = 'PLAYING';
      isPlaying = true;
    }).catch(err => {
      console.log("Autoplay blocked by browser.", err);
      if (mp3Status) mp3Status.textContent = 'PAUSED';
    });
  }

  function pauseMusic() {
    audio.pause();
    if (btnPlayPause) btnPlayPause.classList.remove('playing');
    if (mp3Status) mp3Status.textContent = 'PAUSED';
    isPlaying = false;
  }

  function togglePlay() {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }

  if (btnPlayPause) {
    btnPlayPause.addEventListener('click', togglePlay);
  }

  // Fallback: Autoplay on first click if blocked
  const startAutoplayOnInteraction = (e) => {
    if (e.target.closest('#btn-open-jurnal') || e.target.closest('#mp3-player')) {
      document.removeEventListener('click', startAutoplayOnInteraction);
      document.removeEventListener('touchstart', startAutoplayOnInteraction);
      return;
    }
    if (!isPlaying) {
      playMusic();
    }
    document.removeEventListener('click', startAutoplayOnInteraction);
    document.removeEventListener('touchstart', startAutoplayOnInteraction);
  };
  document.addEventListener('click', startAutoplayOnInteraction);
  document.addEventListener('touchstart', startAutoplayOnInteraction);

  // === 2. SCRAPBOOK PAGE FLIPPING LOGIC ===
  let currentSpread = 0; // Desktop spreads (0 to 7)
  let mobilePageIndex = 0; // Mobile pages (0 to 13)
  const pages = document.querySelectorAll('.page');
  const totalSpreads = pages.length + 1; // 7 page elements + 1 = 8 states
  const totalMobilePages = pages.length * 2; // 14 pages

  function updateBook() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      pages.forEach((page, i) => {
        const activePageElementIndex = Math.floor(mobilePageIndex / 2);
        const isFrontActive = (mobilePageIndex % 2 === 0);
        
        if (i === activePageElementIndex) {
          page.classList.remove('page-mobile-hidden');
          const front = page.querySelector('.front');
          const back = page.querySelector('.back');
          
          if (isFrontActive) {
            if (front) front.style.display = 'block';
            if (back) back.style.display = 'none';
          } else {
            if (front) front.style.display = 'none';
            if (back) back.style.display = 'block';
          }
        } else {
          page.classList.add('page-mobile-hidden');
        }
        
        page.classList.remove('flipped');
        page.style.zIndex = '';
      });
    } else {
      pages.forEach((page, i) => {
        const front = page.querySelector('.front');
        const back = page.querySelector('.back');
        if (front) front.style.display = '';
        if (back) back.style.display = '';
        page.classList.remove('page-mobile-hidden');
        
        if (i < currentSpread) {
          page.classList.add('flipped');
          page.style.zIndex = i;
        } else {
          page.classList.remove('flipped');
          page.style.zIndex = totalSpreads - i;
        }
      });
    }
    
    const btnBookPrev = document.getElementById('btn-book-prev');
    const btnBookNext = document.getElementById('btn-book-next');
    
    if (isMobile) {
      if (btnBookPrev) btnBookPrev.disabled = (mobilePageIndex === 0);
      if (btnBookNext) btnBookNext.disabled = (mobilePageIndex === totalMobilePages - 1);
    } else {
      if (btnBookPrev) btnBookPrev.disabled = (currentSpread === 0);
      if (btnBookNext) btnBookNext.disabled = (currentSpread === totalSpreads - 1);
    }
  }

  // Event Listeners for Nav Buttons
  const btnBookPrev = document.getElementById('btn-book-prev');
  const btnBookNext = document.getElementById('btn-book-next');
  
  if (btnBookPrev) {
    btnBookPrev.addEventListener('click', () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        if (mobilePageIndex > 0) {
          mobilePageIndex--;
          updateBook();
        }
      } else {
        if (currentSpread > 0) {
          currentSpread--;
          updateBook();
        }
      }
    });
  }
  
  if (btnBookNext) {
    btnBookNext.addEventListener('click', () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        if (mobilePageIndex < totalMobilePages - 1) {
          mobilePageIndex++;
          updateBook();
        }
      } else {
        if (currentSpread < totalSpreads - 1) {
          currentSpread++;
          updateBook();
        }
      }
    });
  }

  // Direct click on book pages to flip
  const scrapbook = document.getElementById('scrapbook');
  if (scrapbook) {
    scrapbook.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      
      const rect = scrapbook.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const isMobile = window.innerWidth <= 768;
      
      if (isMobile) {
        if (clickX > rect.width / 2) {
          if (mobilePageIndex < totalMobilePages - 1) {
            mobilePageIndex++;
            updateBook();
          }
        } else {
          if (mobilePageIndex > 0) {
            mobilePageIndex--;
            updateBook();
          }
        }
      } else {
        if (clickX > rect.width / 2) {
          if (currentSpread < totalSpreads - 1) {
            currentSpread++;
            updateBook();
          }
        } else {
          if (currentSpread > 0) {
            currentSpread--;
            updateBook();
          }
        }
      }
    });
  }

  window.addEventListener('resize', updateBook);
  updateBook();

  // === 3. WELCOME SCREEN TRANSITION ===
  const btnOpenJurnal = document.getElementById('btn-open-jurnal');
  const welcomeScreen = document.getElementById('welcome-screen');
  
  if (btnOpenJurnal && welcomeScreen) {
    btnOpenJurnal.addEventListener('click', () => {
      welcomeScreen.classList.add('fade-out');
      playMusic();
    });
  }

  // === 4. SCATTERED DECORATIONS INTERACTION ===
  const scatteredPolaroids = document.querySelectorAll('.floor-polaroid');
  scatteredPolaroids.forEach(polaroid => {
    polaroid.addEventListener('click', (e) => {
      const originalTransform = polaroid.style.transform;
      const rotateVal = originalTransform.match(/rotate\([^)]+\)/) || ['rotate(0deg)'];
      polaroid.style.transform = `scale(1.18) ${rotateVal[0]}`;
      const rect = polaroid.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      spawnActivationSparks(x, y);
      
      setTimeout(() => {
        polaroid.style.transform = originalTransform;
      }, 1000);
    });
  });

  function spawnActivationSparks(x, y) {
    const particlesList = ['❤️', '✨', '🌸', '⭐', '🎈'];
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'polaroid-particle';
      particle.textContent = particlesList[Math.floor(Math.random() * particlesList.length)];
      particle.style.position = 'fixed';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.setProperty('--drift-x', `${Math.random() * 80 - 40}px`);
      particle.style.setProperty('--rot', `${Math.random() * 120 - 60}deg`);
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 1200);
    }
  }

  // === 5. FIREWORKS ENGINE ===
  let fireworksActive = false;
  let fireworksAnimationId = null;
  let launchTextInterval = null;
  let launchNormalInterval = null;
  let canvas = null;
  let ctx = null;
  let particles = [];
  let rockets = [];
  let currentWordIndex = 0;

  const fireworksWords = [
    "YOU ARE MY EVERYTHING",
    "KAMU HEBAT, RISTIN!",
    "사랑해",
    "SEMANGAT TERUS YA!",
    "TETAPLAH DI SINI",
    "TERIMA KASIH CERITANYA"
  ];

  class Rocket {
    constructor(startX, startY, targetX, targetY, word) {
      this.x = startX;
      this.y = startY;
      this.targetX = targetX;
      this.targetY = targetY;
      this.word = word;
      this.speed = 12;
      const angle = Math.atan2(targetY - startY, targetX - startX);
      this.vx = Math.cos(angle) * this.speed;
      this.vy = Math.sin(angle) * this.speed;
      this.alive = true;
      this.trail = [];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 8) this.trail.shift();

      const dist = Math.hypot(this.targetX - this.x, this.targetY - this.y);
      if (dist < 15 || this.y <= this.targetY) {
        this.alive = false;
        explodeRocket(this.targetX, this.targetY, this.word);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 126, 95, 0.8)';
      ctx.lineWidth = 3;
      for (let i = 0; i < this.trail.length; i++) {
        const p = this.trail[i];
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }
  }

  class Particle {
    constructor(x, y, targetX, targetY, color) {
      this.x = x;
      this.y = y;
      this.vx = (targetX - x) / 35 + (Math.random() * 2 - 1) * 0.4;
      this.vy = (targetY - y) / 35 + (Math.random() * 2 - 1) * 0.4;
      this.targetX = targetX;
      this.targetY = targetY;
      this.color = color;
      this.alpha = 1;
      this.decay = Math.random() * 0.012 + 0.008;
      this.friction = 0.96;
      this.gravity = 0.04;
      this.lifeStage = 'assemble'; // 'assemble', 'hold', 'fade'
      this.timer = 0;
      this.holdTime = 70 + Math.random() * 30; // menahan bentuk tulisan
    }

    update() {
      if (this.lifeStage === 'assemble') {
        this.x += this.vx;
        this.y += this.vy;
        this.timer++;
        const dist = Math.hypot(this.targetX - this.x, this.targetY - this.y);
        if (dist < 2 || this.timer > 35) {
          this.x = this.targetX;
          this.y = this.targetY;
          this.vx = 0;
          this.vy = 0;
          this.lifeStage = 'hold';
          this.timer = 0;
        }
      } else if (this.lifeStage === 'hold') {
        this.timer++;
        if (this.timer > this.holdTime) {
          this.lifeStage = 'fade';
          const angle = Math.random() * Math.PI * 2;
          const force = Math.random() * 1.5;
          this.vx = Math.cos(angle) * force;
          this.vy = Math.sin(angle) * force;
        }
      } else if (this.lifeStage === 'fade') {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function explodeRocket(ex, ey, word) {
    if (!word) {
      const colors = ['#ff5e36', '#00d2ff', '#ffa834', '#ffff80', '#ff3366', '#ffffff', '#a8ff34', '#ff34e8'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < 70; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 5 + 1.5;
        const p = new Particle(ex, ey, ex + Math.cos(angle) * velocity * 30, ey + Math.sin(angle) * velocity * 30, color);
        p.lifeStage = 'fade';
        particles.push(p);
      }
      return;
    }

    const offscreenCanvas = document.createElement('canvas');
    const offscreenCtx = offscreenCanvas.getContext('2d');
    
    offscreenCanvas.width = 650;
    offscreenCanvas.height = 120;
    
    offscreenCtx.fillStyle = '#ffffff';
    offscreenCtx.font = 'bold 36px Outfit, Montserrat, sans-serif';
    offscreenCtx.textBaseline = 'middle';
    offscreenCtx.textAlign = 'center';
    offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    offscreenCtx.fillText(word, offscreenCanvas.width / 2, offscreenCanvas.height / 2);
    
    const imgData = offscreenCtx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    const pixels = imgData.data;
    const points = [];
    
    const step = 3;
    for (let y = 0; y < offscreenCanvas.height; y += step) {
      for (let x = 0; x < offscreenCanvas.width; x += step) {
        const index = (y * offscreenCanvas.width + x) * 4;
        const alpha = pixels[index + 3];
        if (alpha > 128) {
          points.push({
            x: x - offscreenCanvas.width / 2,
            y: y - offscreenCanvas.height / 2
          });
        }
      }
    }
    
    const colors = ['#ff5e36', '#00d2ff', '#ffa834', '#ffff80', '#ff3366', '#ffffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    let scale = window.innerWidth < 768 ? 0.55 : 1.0;
    
    points.forEach(p => {
      const targetX = ex + p.x * scale;
      const targetY = ey + p.y * scale;
      const startX = ex + (Math.random() * 20 - 10);
      const startY = ey + (Math.random() * 20 - 10);
      particles.push(new Particle(startX, startY, targetX, targetY, color));
    });

    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 5 + 1.5;
      const p = new Particle(ex, ey, ex + Math.cos(angle) * velocity * 25, ey + Math.sin(angle) * velocity * 25, color);
      p.lifeStage = 'fade';
      particles.push(p);
    }
  }

  function loopFireworks() {
    if (!fireworksActive) return;
    
    ctx.fillStyle = 'rgba(10, 10, 10, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.update();
      if (r.alive) r.draw();
      else rockets.splice(i, 1);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      if (p.alpha <= 0) particles.splice(i, 1);
    }
    
    fireworksAnimationId = requestAnimationFrame(loopFireworks);
  }

  function startLaunchingRockets() {
    currentWordIndex = 0;
    
    const launchText = () => {
      if (!fireworksActive) return;
      const word = fireworksWords[currentWordIndex];
      currentWordIndex = (currentWordIndex + 1) % fireworksWords.length;
      
      const startX = canvas.width / 2 + (Math.random() * 160 - 80);
      const startY = canvas.height + 20;
      const targetX = canvas.width * 0.22 + Math.random() * (canvas.width * 0.56);
      const targetY = canvas.height * 0.25 + Math.random() * (canvas.height * 0.22);
      
      rockets.push(new Rocket(startX, startY, targetX, targetY, word));
    };

    const launchNormal = () => {
      if (!fireworksActive) return;
      const startX = Math.random() * canvas.width;
      const startY = canvas.height + 20;
      const targetX = canvas.width * 0.12 + Math.random() * (canvas.width * 0.76);
      const targetY = canvas.height * 0.15 + Math.random() * (canvas.height * 0.45);
      
      rockets.push(new Rocket(startX, startY, targetX, targetY, null));
    };

    launchText();
    setTimeout(launchNormal, 200);
    setTimeout(launchNormal, 600);
    setTimeout(launchNormal, 1000);

    launchTextInterval = setInterval(launchText, 2800);
    launchNormalInterval = setInterval(launchNormal, 700);
  }

  function triggerSecretFireworks() {
    if (fireworksActive) return;
    
    fireworksActive = true;
    
    canvas = document.getElementById('fireworks-canvas');
    ctx = canvas.getContext('2d');
    const overlay = document.getElementById('fireworks-overlay');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';
    
    overlay.classList.add('active');
    
    window.addEventListener('resize', resizeFireworksCanvas);
    
    if (!isPlaying) {
      playMusic();
    }
    
    rockets = [];
    particles = [];
    loopFireworks();
    startLaunchingRockets();
    
    setTimeout(() => {
      stopSecretFireworks();
    }, 20000);
  }

  function resizeFireworksCanvas() {
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }

  function stopSecretFireworks() {
    if (!fireworksActive) return;
    
    fireworksActive = false;
    
    if (fireworksAnimationId) {
      cancelAnimationFrame(fireworksAnimationId);
      fireworksAnimationId = null;
    }
    if (launchTextInterval) {
      clearInterval(launchTextInterval);
      launchTextInterval = null;
    }
    if (launchNormalInterval) {
      clearInterval(launchNormalInterval);
      launchNormalInterval = null;
    }
    
    window.removeEventListener('resize', resizeFireworksCanvas);
    
    const overlay = document.getElementById('fireworks-overlay');
    if (overlay) overlay.classList.remove('active');
    
    if (canvas) {
      canvas.style.opacity = '0';
      canvas.style.transition = 'opacity 1s ease-in-out';
      setTimeout(() => {
        canvas.style.display = 'none';
        canvas.style.opacity = '1';
        canvas.style.transition = '';
      }, 1000);
    }
  }

  // Shortcut Dobel Klik Judul Welcome Screen untuk memicu kembang api
  const welcomeTitle = document.querySelector('.welcome-title');
  if (welcomeTitle) {
    let titleClickCount = 0;
    let titleLastClick = 0;
    welcomeTitle.addEventListener('click', () => {
      const now = Date.now();
      if (now - titleLastClick < 400) {
        titleClickCount++;
        if (titleClickCount >= 1) {
          triggerSecretFireworks();
          titleClickCount = 0;
        }
      } else {
        titleClickCount = 0;
      }
      titleLastClick = now;
    });
  }

  // === 6. AMBIENT SUNLIGHT DUST PARTICLES SYSTEM ===
  const ambientCanvas = document.getElementById('ambient-canvas');
  if (ambientCanvas) {
    const ambientCtx = ambientCanvas.getContext('2d');
    let mouseX = -9999;
    let mouseY = -9999;

    function resizeAmbientCanvas() {
      ambientCanvas.width = window.innerWidth;
      ambientCanvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeAmbientCanvas);
    resizeAmbientCanvas();

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    });

    window.addEventListener('mouseleave', () => {
      mouseX = -9999;
      mouseY = -9999;
    });

    window.addEventListener('touchend', () => {
      mouseX = -9999;
      mouseY = -9999;
    });

    const motes = [];
    const moteCount = 38; // Small number of particles (30 - 45) to mimic natural dust

    for (let i = 0; i < moteCount; i++) {
      motes.push({
        x: Math.random() * ambientCanvas.width,
        y: Math.random() * ambientCanvas.height,
        size: 0.8 + Math.random() * 1.6, // radius: 0.8px to 2.4px (makes glowRadius 2px to 6px)
        vx: 0,
        vy: 0,
        baseVx: -0.15 + Math.random() * 0.3,
        baseVy: 0.25 + Math.random() * 0.45,
        swayAngle: Math.random() * Math.PI * 2,
        swaySpeed: 0.003 + Math.random() * 0.007,
        pulseAngle: Math.random() * Math.PI * 2,
        pulseSpeed: 0.004 + Math.random() * 0.01,
        baseAlpha: 0.18 + Math.random() * 0.25 // max base alpha
      });
    }

    function animateAmbient() {
      ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);

      for (let i = 0; i < motes.length; i++) {
        const p = motes[i];

        // Update cycles
        p.swayAngle += p.swaySpeed;
        p.pulseAngle += p.pulseSpeed;

        const targetVx = p.baseVx + Math.sin(p.swayAngle) * 0.12;
        const targetVy = p.baseVy;

        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.hypot(dx, dy);
        const maxDist = 180; // Attraction range 180px

        if (dist < maxDist && mouseX > -1000) {
          const force = (maxDist - dist) / maxDist;
          const strength = 0.045; // Gentle magnetic strength (weak pull)

          // Weak acceleration towards mouse
          p.vx += (dx / dist) * force * strength;
          p.vy += (dy / dist) * force * strength;
        }

        // Apply friction
        p.vx *= 0.97;
        p.vy *= 0.97;

        // Return to natural drift path
        p.vx += (targetVx - p.vx) * 0.025;
        p.vy += (targetVy - p.vy) * 0.025;

        // Clamp speed to keep movement calm and nostalgic
        const speed = Math.hypot(p.vx, p.vy);
        const maxSpeed = 1.6;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Boundary wrap
        if (p.y > ambientCanvas.height + 15) {
          p.y = -15;
          p.x = Math.random() * ambientCanvas.width;
          p.vx = p.baseVx;
          p.vy = p.baseVy;
        }
        if (p.x < -15) {
          p.x = ambientCanvas.width + 15;
        } else if (p.x > ambientCanvas.width + 15) {
          p.x = -15;
        }

        // Pulse alpha for ambient sparkling
        const alpha = p.baseAlpha + Math.sin(p.pulseAngle) * 0.12;
        const clampedAlpha = Math.max(0.08, Math.min(0.55, alpha));
        const glowRadius = p.size * 2.5;

        // Render soft glow particle
        const grad = ambientCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
        grad.addColorStop(0, `rgba(255, 240, 200, ${clampedAlpha})`);
        grad.addColorStop(0.3, `rgba(253, 218, 120, ${clampedAlpha * 0.6})`);
        grad.addColorStop(0.7, `rgba(251, 191, 36, ${clampedAlpha * 0.15})`);
        grad.addColorStop(1, `rgba(251, 191, 36, 0)`);

        ambientCtx.fillStyle = grad;
        ambientCtx.beginPath();
        ambientCtx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ambientCtx.fill();
      }

      requestAnimationFrame(animateAmbient);
    }

    animateAmbient();
  }

  // === 7. ID CARD ZOOM/LIGHTBOX INTERACTION ===
  const deskIdCard = document.getElementById('desk-id-card');
  const idCardOverlay = document.getElementById('id-card-overlay');
  
  if (deskIdCard && idCardOverlay) {
    deskIdCard.addEventListener('click', (e) => {
      e.stopPropagation();
      idCardOverlay.classList.add('active');
    });
    
    idCardOverlay.addEventListener('click', () => {
      idCardOverlay.classList.remove('active');
    });
  }

});

