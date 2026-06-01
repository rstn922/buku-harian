// app.js - Logika Modern Glassmorphism & Balon Rindu Interaktif

document.addEventListener('DOMContentLoaded', () => {
  // === 1. AUDIO PLAYER CONTROLLER (RETRO MP3 PLAYER) ===
  const audio = new Audio('assets/EVERYTHING.mp3');
  audio.loop = true;
  audio.volume = 0.55;
  let isPlaying = false;

  const btnPlayPause = document.getElementById('mp3-play-pause');
  const mp3Status = document.getElementById('mp3-status');

  const btnPlayPauseZoomed = document.getElementById('mp3-play-pause-zoomed');
  const mp3StatusZoomed = document.getElementById('mp3-status-zoomed');

  function syncMP3UI() {
    if (isPlaying) {
      if (btnPlayPause) btnPlayPause.classList.add('playing');
      if (btnPlayPauseZoomed) btnPlayPauseZoomed.classList.add('playing');
      if (mp3Status) mp3Status.textContent = 'PLAYING';
      if (mp3StatusZoomed) mp3StatusZoomed.textContent = 'PLAYING';
    } else {
      if (btnPlayPause) btnPlayPause.classList.remove('playing');
      if (btnPlayPauseZoomed) btnPlayPauseZoomed.classList.remove('playing');
      if (mp3Status) mp3Status.textContent = 'PAUSED';
      if (mp3StatusZoomed) mp3StatusZoomed.textContent = 'PAUSED';
    }
  }

  function playMusic() {
    audio.play().then(() => {
      isPlaying = true;
      syncMP3UI();
    }).catch(err => {
      console.log("Autoplay blocked by browser.", err);
      isPlaying = false;
      syncMP3UI();
    });
  }

  function pauseMusic() {
    audio.pause();
    isPlaying = false;
    syncMP3UI();
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
  if (btnPlayPauseZoomed) {
    btnPlayPauseZoomed.addEventListener('click', togglePlay);
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
    
    const bookWrapper = document.getElementById('book-wrapper');
    if (bookWrapper) {
      if (!isMobile) {
        if (currentSpread === 0) {
          bookWrapper.classList.add('closed-cover');
          bookWrapper.classList.remove('closed-back');
        } else if (currentSpread === totalSpreads - 1) {
          bookWrapper.classList.remove('closed-cover');
          bookWrapper.classList.add('closed-back');
        } else {
          bookWrapper.classList.remove('closed-cover');
          bookWrapper.classList.remove('closed-back');
        }
      } else {
        bookWrapper.classList.remove('closed-cover');
        bookWrapper.classList.remove('closed-back');
      }
    }
    
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
    const particlesList = ['*', '+', 'o', 'x', '.'];
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

  // === 7. ID CARD ZOOM/LIGHTBOX INTERACTION (GAME INSPECT STYLE) ===
  const deskIdCard = document.getElementById('desk-id-card');
  const idCardOverlay = document.getElementById('id-card-overlay');
  
  if (deskIdCard && idCardOverlay) {
    const lightbox = idCardOverlay.querySelector('.id-card-lightbox');
    let isClosing = false;
    let isOpen = false;
    
    deskIdCard.addEventListener('click', (e) => {
      if (isOpen || isClosing) return;
      e.stopPropagation();
      
      isOpen = true;
      isClosing = false;
      
      // Calculate screen positions
      const rect = deskIdCard.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const centerX = windowWidth / 2;
      const centerY = windowHeight / 2;
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;
      
      const translateX = cardCenterX - centerX;
      const translateY = cardCenterY - centerY;
      const scale = rect.width / 280; // normalized to standard width
      
      // Step 1: Place the lightbox exactly over the desk card, matches rotation
      lightbox.style.transition = 'none';
      lightbox.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(-10deg)`;
      
      // Step 2: Make the desk card invisible
      deskIdCard.style.opacity = '0';
      deskIdCard.style.pointerEvents = 'none';
      
      // Step 3: Open the overlay (darkens background)
      idCardOverlay.classList.add('active');
      
      // Trigger browser reflow
      lightbox.offsetHeight;
      
      // Step 4: Animate from the table to center of the screen
      lightbox.style.transition = 'transform 0.65s cubic-bezier(0.25, 1.2, 0.5, 1)';
      lightbox.style.transform = 'translate(0, 0) scale(1) rotate(0deg)';
    });
    
    idCardOverlay.addEventListener('click', (e) => {
      // Close only if clicking the background overlay itself
      if (e.target !== idCardOverlay && !e.target.classList.contains('id-card-lightbox') && e.target.closest('.id-card-lightbox')) return;
      
      if (!isOpen || isClosing) return;
      
      isClosing = true;
      isOpen = false;
      
      // Calculate target screen position of desk card
      const rect = deskIdCard.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const centerX = windowWidth / 2;
      const centerY = windowHeight / 2;
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;
      
      const translateX = cardCenterX - centerX;
      const translateY = cardCenterY - centerY;
      const scale = rect.width / 280;
      
      // Step 1: Fly back to desk card
      lightbox.style.transition = 'transform 0.55s cubic-bezier(0.55, 0, 0.1, 1)';
      lightbox.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(-10deg)`;
      
      // Step 2: Fade out background
      idCardOverlay.classList.remove('active');
      
      // Step 3: Clean up
      setTimeout(() => {
        deskIdCard.style.opacity = '1';
        deskIdCard.style.pointerEvents = 'auto';
        lightbox.style.transition = '';
        lightbox.style.transform = '';
        isClosing = false;
      }, 550);
    });
    
    // AAA Game Parallax Tilt Effect on Inspect
    idCardOverlay.addEventListener('mousemove', (e) => {
      if (!isOpen || isClosing) return;
      
      const rect = lightbox.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      
      // Gentle 3D tilt
      const tiltX = (y / (window.innerHeight / 2)) * -12;
      const tiltY = (x / (window.innerWidth / 2)) * 12;
      
      lightbox.style.transition = 'transform 0.1s ease-out';
      lightbox.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03) translateZ(20px)`;
    });
    
    // Reset hover effect when mouse leaves
    idCardOverlay.addEventListener('mouseleave', () => {
      if (!isOpen || isClosing) return;
      lightbox.style.transition = 'transform 0.4s ease-out';
      lightbox.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }

  // === 8. KKN LOGBOOK ZOOM/INSPECT & FLIP INTERACTION (GAME INSPECT STYLE) ===
  const deskLogbook = document.getElementById('desk-logbook');
  const logbookOverlay = document.getElementById('logbook-overlay');
  
  if (deskLogbook && logbookOverlay) {
    const logbookLightbox = logbookOverlay.querySelector('.logbook-lightbox');
    const miniBook = logbookOverlay.querySelector('.mini-book');
    const miniPages = logbookOverlay.querySelectorAll('.mini-page');
    const btnMiniPrev = document.getElementById('btn-mini-prev');
    const btnMiniNext = document.getElementById('btn-mini-next');
    const miniNavIndicator = document.getElementById('mini-nav-indicator');
    
    let currentMiniSpread = 0;
    const totalMiniSpreads = miniPages.length + 1; // 4 page sheets + 1 = 5 states (0 to 4)
    const miniSpreadLabels = ["Sampul", "Halaman 1-2", "Halaman 3-4", "Halaman 5-6", "Selesai"];
    
    let isClosing = false;
    let isOpen = false;

    function updateMiniBook() {
      // Manage visual centering based on which page is open
      if (currentMiniSpread === 0) {
        // Closed cover: Shift book left by 140px to center the cover on screen
        miniBook.style.transform = 'translateX(-140px)';
      } else if (currentMiniSpread === totalMiniSpreads - 1) {
        // Closed back cover: Shift book right by 140px to center the back cover
        miniBook.style.transform = 'translateX(140px)';
      } else {
        // Opened: Spine is at center (translateX 0)
        miniBook.style.transform = 'translateX(0px)';
      }

      miniPages.forEach((page, i) => {
        if (i < currentMiniSpread) {
          page.classList.add('flipped');
          page.style.zIndex = i;
        } else {
          page.classList.remove('flipped');
          page.style.zIndex = totalMiniSpreads - i;
        }
      });

      if (btnMiniPrev) btnMiniPrev.disabled = (currentMiniSpread === 0);
      if (btnMiniNext) btnMiniNext.disabled = (currentMiniSpread === totalMiniSpreads - 1);
      if (miniNavIndicator) miniNavIndicator.textContent = miniSpreadLabels[currentMiniSpread];
    }

    // Direct click on desk element to inspect
    deskLogbook.addEventListener('click', (e) => {
      if (isOpen || isClosing) return;
      e.stopPropagation();
      
      isOpen = true;
      isClosing = false;
      currentMiniSpread = 0; // start on cover
      updateMiniBook();
      
      // Calculate screen positions
      const rect = deskLogbook.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const centerX = windowWidth / 2;
      const centerY = windowHeight / 2;
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;
      
      const translateX = cardCenterX - centerX;
      const translateY = cardCenterY - centerY;
      const scale = rect.width / 280; // normalized to cover width (280px)
      
      // Step 1: Place the lightbox exactly over the desk logbook, matches rotation (8deg)
      logbookLightbox.style.transition = 'none';
      logbookLightbox.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(8deg)`;
      
      // Step 2: Make desk logbook invisible
      deskLogbook.style.opacity = '0';
      deskLogbook.style.pointerEvents = 'none';
      
      // Step 3: Show the overlay
      logbookOverlay.classList.add('active');
      
      // Trigger browser reflow
      logbookLightbox.offsetHeight;
      
      // Step 4: Fly in to the center
      logbookLightbox.style.transition = 'transform 0.65s cubic-bezier(0.25, 1.2, 0.5, 1)';
      logbookLightbox.style.transform = 'translate(0, 0) scale(1) rotate(0deg)';
    });

    // Dismiss overlay by clicking around
    logbookOverlay.addEventListener('click', (e) => {
      // Prevent closing if clicking buttons, or clicking inside the book
      if (e.target.closest('.mini-book-nav') || e.target.closest('.mini-book')) return;
      if (e.target !== logbookOverlay && !e.target.classList.contains('logbook-lightbox') && e.target.closest('.logbook-lightbox')) return;
      
      if (!isOpen || isClosing) return;
      
      isClosing = true;
      isOpen = false;
      
      // Fly book back to desk
      const rect = deskLogbook.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const centerX = windowWidth / 2;
      const centerY = windowHeight / 2;
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;
      
      const translateX = cardCenterX - centerX;
      const translateY = cardCenterY - centerY;
      const scale = rect.width / 280;
      
      // Close transition (returns book to desk size & angle)
      currentMiniSpread = 0;
      updateMiniBook();
      logbookLightbox.style.transition = 'transform 0.55s cubic-bezier(0.55, 0, 0.1, 1)';
      logbookLightbox.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(8deg)`;
      
      logbookOverlay.classList.remove('active');
      
      setTimeout(() => {
        deskLogbook.style.opacity = '1';
        deskLogbook.style.pointerEvents = 'auto';
        logbookLightbox.style.transition = '';
        logbookLightbox.style.transform = '';
        isClosing = false;
      }, 550);
    });

    // Click on book left/right halves to turn pages
    miniBook.addEventListener('click', (e) => {
      if (isClosing) return;
      e.stopPropagation();
      
      const rect = miniBook.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      
      if (clickX > rect.width / 2) {
        if (currentMiniSpread < totalMiniSpreads - 1) {
          currentMiniSpread++;
          updateMiniBook();
        }
      } else {
        if (currentMiniSpread > 0) {
          currentMiniSpread--;
          updateMiniBook();
        }
      }
    });

    // Navigation buttons
    if (btnMiniPrev) {
      btnMiniPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentMiniSpread > 0) {
          currentMiniSpread--;
          updateMiniBook();
        }
      });
    }

    if (btnMiniNext) {
      btnMiniNext.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentMiniSpread < totalMiniSpreads - 1) {
          currentMiniSpread++;
          updateMiniBook();
        }
      });
    }

    // Parallax Tilt on inspect
    logbookOverlay.addEventListener('mousemove', (e) => {
      if (!isOpen || isClosing) return;
      
      const rect = logbookLightbox.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      
      const tiltX = (y / (window.innerHeight / 2)) * -12;
      const tiltY = (x / (window.innerWidth / 2)) * 12;
      
      logbookLightbox.style.transition = 'transform 0.1s ease-out';
      logbookLightbox.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03) translateZ(20px)`;
    });

    logbookOverlay.addEventListener('mouseleave', () => {
      if (!isOpen || isClosing) return;
      logbookLightbox.style.transition = 'transform 0.4s ease-out';
      logbookLightbox.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });

    updateMiniBook();
  }

  // === 9. STICKY NOTES ZOOM/LIGHTBOX INTERACTION ===
  function setupStickyNoteInspect(deskNoteId, overlayId, rotationVal) {
    const deskNote = document.getElementById(deskNoteId);
    const overlay = document.getElementById(overlayId);
    if (!deskNote || !overlay) return;

    const lightbox = overlay.querySelector('.sticky-note-lightbox');
    let isOpen = false;
    let isClosing = false;

    deskNote.addEventListener('click', (e) => {
      if (isOpen || isClosing) return;
      e.stopPropagation();

      isOpen = true;
      isClosing = false;

      const rect = deskNote.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const centerX = windowWidth / 2;
      const centerY = windowHeight / 2;
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const translateX = cardCenterX - centerX;
      const translateY = cardCenterY - centerY;
      const scale = rect.width / 320; // normalized to zoomed width

      lightbox.style.transition = 'none';
      lightbox.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotationVal}deg)`;

      deskNote.style.opacity = '0';
      deskNote.style.pointerEvents = 'none';
      overlay.classList.add('active');

      lightbox.offsetHeight; // force reflow

      lightbox.style.transition = 'transform 0.65s cubic-bezier(0.25, 1.2, 0.5, 1)';
      lightbox.style.transform = 'translate(0, 0) scale(1) rotate(0deg)';
    });

    overlay.addEventListener('click', (e) => {
      if (e.target !== overlay && !e.target.classList.contains('sticky-note-lightbox') && e.target.closest('.sticky-note-lightbox')) return;

      if (!isOpen || isClosing) return;

      isClosing = true;
      isOpen = false;

      const rect = deskNote.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const centerX = windowWidth / 2;
      const centerY = windowHeight / 2;
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const translateX = cardCenterX - centerX;
      const translateY = cardCenterY - centerY;
      const scale = rect.width / 320;

      lightbox.style.transition = 'transform 0.55s cubic-bezier(0.55, 0, 0.1, 1)';
      lightbox.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotationVal}deg)`;

      overlay.classList.remove('active');

      setTimeout(() => {
        deskNote.style.opacity = '1';
        deskNote.style.pointerEvents = 'auto';
        lightbox.style.transition = '';
        lightbox.style.transform = '';
        isClosing = false;
      }, 550);
    });

    overlay.addEventListener('mousemove', (e) => {
      if (!isOpen || isClosing) return;
      const rect = lightbox.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      const tiltX = (y / (window.innerHeight / 2)) * -12;
      const tiltY = (x / (window.innerWidth / 2)) * 12;
      lightbox.style.transition = 'transform 0.1s ease-out';
      lightbox.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03) translateZ(20px)`;
    });

    overlay.addEventListener('mouseleave', () => {
      if (!isOpen || isClosing) return;
      lightbox.style.transition = 'transform 0.4s ease-out';
      lightbox.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }

  setupStickyNoteInspect('desk-yellow-note', 'yellow-note-overlay', -5);
  setupStickyNoteInspect('desk-pink-note', 'pink-note-overlay', 4);


  // === 10. POLAROID FLOOR PHOTOS & SCRAPBOOK PHOTOS ZOOM/INSPECT INTERACTION ===
  const floorPolaroids = document.querySelectorAll('.floor-polaroid, .scrapbook-photo-slot');
  const floorCamera = document.getElementById('floor-camera');
  const polaroidOverlay = document.getElementById('polaroid-overlay');

  if ((floorPolaroids.length || floorCamera) && polaroidOverlay) {
    const lightbox = polaroidOverlay.querySelector('.polaroid-lightbox');
    const zoomedImg = document.getElementById('polaroid-zoomed-img');
    const zoomedCaption = document.getElementById('polaroid-zoomed-caption');
    
    let activePolaroid = null;
    let isOpen = false;
    let isClosing = false;
    let currentCameraPhotoIndex = -1;

    const cameraPhotos = [
      "IMG_20250709_115251_770.jpg",
      "IMG_20250710_123012_068.jpg",
      "IMG_20250712_122848_313.jpg",
      "IMG_20250720_163813_229.jpg",
      "IMG_20250720_163817_605.jpg",
      "IMG_20250720_163818_651.jpg",
      "IMG_20250720_163819_670.jpg",
      "IMG_20250722_213405_490.jpg",
      "IMG_20250723_172437_9.jpg",
      "IMG_20250726_115817_8.jpg",
      "IMG_20250728_114145_541.jpg",
      "IMG_20250728_122556_691.jpg",
      "IMG_20250728_124029_623.jpg",
      "IMG_20250803_173552_5.jpg",
      "IMG_20250811_211740_980.jpg",
      "IMG_20250812_222931_282.jpg",
      "IMG_20250813_153802_359.jpg",
      "IMG_20250816_215506_213.jpg",
      "IMG_20250816_215747_763.jpg",
      "IMG_20250816_221328_773.jpg",
      "IMG_20250816_221407_482.jpg",
      "IMG_20250817_224507_5.jpg",
      "IMG_20251119_120911_509.jpg",
      "IMG_20251119_120923_193.jpg",
      "IMG_20251119_121734_908.jpg",
      "IMG_20251119_121759_164.jpg",
      "IMG_20251119_121805_452.jpg",
      "IMG_20251119_121819_113.jpg",
      "IMG_20251119_121851_975.jpg",
      "IMG_20251119_121857_118.jpg",
      "IMG_20260528_030455_905.jpg",
      "IMG-20250720-WA0010.jpg",
      "IMG-20250817-WA0162.jpg",
      "IMG-20250818-WA0020.jpg",
      "IMG-20250818-WA0520.jpg",
      "IMG-20251119-WA0069.jpg",
      "IMG-20251119-WA0071.jpg",
      "IMG-20251119-WA0074.jpg",
      "IMG-20251119-WA0075.jpg",
      "IMG-20251119-WA0079.jpg",
      "IMG-20251119-WA0122.jpg",
      "IMG-20251119-WA0124.jpg",
      "IMG-20251119-WA0126.jpg",
      "IMG-20251119-WA0128.jpg",
      "IMG-20251119-WA0130.jpg",
      "IMG-20251119-WA0132.jpg",
      "IMG-20251119-WA0134.jpg",
      "IMG-20251119-WA0136.jpg",
      "IMG-20251119-WA0138.jpg",
      "IMG-20251119-WA0140.jpg",
      "IMG-20251119-WA0142.jpg",
      "IMG-20251119-WA0144.jpg",
      "IMG-20251119-WA0146.jpg",
      "IMG-20251119-WA0148.jpg",
      "IMG-20251119-WA0150.jpg",
      "IMG-20251119-WA0152.jpg",
      "IMG-20251119-WA0154.jpg",
      "IMG-20251119-WA0156.jpg"
    ];

    const triggerZoom = (polaroid) => {
      if (isOpen || isClosing) return;

      activePolaroid = polaroid;
      isOpen = true;
      isClosing = false;

      let captionText = "";
      if (polaroid === floorCamera) {
        currentCameraPhotoIndex = Math.floor(Math.random() * cameraPhotos.length);
        const currentPhoto = cameraPhotos[currentCameraPhotoIndex];
        zoomedImg.src = `assets/photos/${currentPhoto}`;
        captionText = "Hasil Foto Polaroid";
        
        document.getElementById('polaroid-prev-btn').style.display = 'flex';
        document.getElementById('polaroid-next-btn').style.display = 'flex';
      } else {
        // Extract photo details
        const img = polaroid.querySelector('img');
        zoomedImg.src = img ? img.src : '';
        
        let captionEl = polaroid.querySelector('.fp-caption');
        if (captionEl) {
          captionText = captionEl.textContent;
        } else {
          // Check if this is the first photo inside Ristin's diary
          const isFirstPhoto = polaroid.closest('#page-1') !== null;
          if (isFirstPhoto) {
            captionText = "";
          } else {
            // It's a scrapbook photo, let's find the text visible on its LEFT page in the spread (back of sheet page-N-1)
            const parentPage = polaroid.closest('.page');
            if (parentPage) {
              const pageIdMatch = parentPage.id.match(/page-(\d+)/);
              if (pageIdMatch) {
                const pageNum = parseInt(pageIdMatch[1], 10);
                const prevPage = document.getElementById(`page-${pageNum - 1}`);
                if (prevPage) {
                  const textElements = prevPage.querySelectorAll('.back .scrapbook-text-area p, .back h3, .back p.handwritten-text, .back p.signature-text');
                  if (textElements.length) {
                    captionText = Array.from(textElements).map(el => el.textContent.trim()).join('\n');
                  } else {
                    const fallbackElements = prevPage.querySelectorAll('.back p, .back h4, .back h3');
                    if (fallbackElements.length) {
                      captionText = Array.from(fallbackElements).map(el => el.textContent.trim()).join('\n');
                    }
                  }
                }
              }
            }
            if (!captionText && img) {
              captionText = img.alt || "Momen Indah";
            }
          }
        }
        
        document.getElementById('polaroid-prev-btn').style.display = 'none';
        document.getElementById('polaroid-next-btn').style.display = 'none';
      }
      zoomedCaption.textContent = captionText;

      // Reset inline styles
      zoomedCaption.style.fontSize = '';
      zoomedCaption.style.lineHeight = '';
      zoomedCaption.style.marginTop = '';

      // Dynamically shrink font size and spacing for long texts to keep photo size original
      if (captionText.length > 150) {
        zoomedCaption.style.fontSize = '0.85rem';
        zoomedCaption.style.lineHeight = '1.25';
        zoomedCaption.style.marginTop = '12px';
      } else if (captionText.length > 80) {
        zoomedCaption.style.fontSize = '1.05rem';
        zoomedCaption.style.lineHeight = '1.35';
        zoomedCaption.style.marginTop = '18px';
      } else {
        zoomedCaption.style.fontSize = '1.35rem';
        zoomedCaption.style.lineHeight = '1.5';
        zoomedCaption.style.marginTop = '25px';
      }

      // Bounding rect
      const rect = polaroid.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const centerX = windowWidth / 2;
      const centerY = windowHeight / 2;
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const translateX = cardCenterX - centerX;
      const translateY = cardCenterY - centerY;
      const scale = rect.width / 420; // normalized to polaroid lightbox width

      // Match original rotation
      const transformStyle = polaroid.style.transform || '';
      const match = transformStyle.match(/rotate\(([^)]+)\)/);
      let rotationVal = '0deg';
      if (match) {
        rotationVal = match[1];
      } else if (polaroid.id === 'floor-camera') {
        rotationVal = '15deg';
      } else if (polaroid.classList.contains('scrapbook-photo-slot')) {
        rotationVal = '-1.5deg';
      }

      lightbox.style.transition = 'none';
      lightbox.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotationVal})`;

      // Hide desk/book item
      polaroid.style.opacity = '0';
      polaroid.style.pointerEvents = 'none';

      polaroidOverlay.classList.add('active');
      lightbox.offsetHeight; // reflow

      lightbox.style.transition = 'transform 0.65s cubic-bezier(0.25, 1.2, 0.5, 1)';
      lightbox.style.transform = 'translate(0, 0) scale(1) rotate(0deg)';
    };

    floorPolaroids.forEach(polaroid => {
      polaroid.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerZoom(polaroid);
      });
    });

    if (floorCamera) {
      floorCamera.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerZoom(floorCamera);
      });
    }

    // Navigation buttons click events
    const prevBtn = document.getElementById('polaroid-prev-btn');
    const nextBtn = document.getElementById('polaroid-next-btn');

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isOpen || isClosing || activePolaroid !== floorCamera) return;

        currentCameraPhotoIndex = (currentCameraPhotoIndex - 1 + cameraPhotos.length) % cameraPhotos.length;
        const currentPhoto = cameraPhotos[currentCameraPhotoIndex];
        
        zoomedImg.style.opacity = '0';
        setTimeout(() => {
          zoomedImg.src = `assets/photos/${currentPhoto}`;
          zoomedImg.onload = () => {
            zoomedImg.style.opacity = '1';
          };
        }, 150);
      });

      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isOpen || isClosing || activePolaroid !== floorCamera) return;

        currentCameraPhotoIndex = (currentCameraPhotoIndex + 1) % cameraPhotos.length;
        const currentPhoto = cameraPhotos[currentCameraPhotoIndex];
        
        zoomedImg.style.opacity = '0';
        setTimeout(() => {
          zoomedImg.src = `assets/photos/${currentPhoto}`;
          zoomedImg.onload = () => {
            zoomedImg.style.opacity = '1';
          };
        }, 150);
      });
    }

    polaroidOverlay.addEventListener('click', (e) => {
      if (e.target.closest('.polaroid-nav-btn')) return;
      if (e.target !== polaroidOverlay && !e.target.classList.contains('polaroid-lightbox') && e.target.closest('.polaroid-lightbox')) return;

      if (!isOpen || isClosing || !activePolaroid) return;

      isClosing = true;
      isOpen = false;

      const rect = activePolaroid.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const centerX = windowWidth / 2;
      const centerY = windowHeight / 2;
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const translateX = cardCenterX - centerX;
      const translateY = cardCenterY - centerY;
      const scale = rect.width / 420;

      const transformStyle = activePolaroid.style.transform || '';
      const match = transformStyle.match(/rotate\(([^)]+)\)/);
      let rotationVal = '0deg';
      if (match) {
        rotationVal = match[1];
      } else if (activePolaroid.id === 'floor-camera') {
        rotationVal = '15deg';
      } else if (activePolaroid.classList.contains('scrapbook-photo-slot')) {
        rotationVal = '-1.5deg';
      }

      lightbox.style.transition = 'transform 0.55s cubic-bezier(0.55, 0, 0.1, 1)';
      lightbox.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotationVal})`;

      polaroidOverlay.classList.remove('active');

      setTimeout(() => {
        activePolaroid.style.opacity = '1';
        activePolaroid.style.pointerEvents = 'auto';
        lightbox.style.transition = '';
        lightbox.style.transform = '';
        activePolaroid = null;
        isClosing = false;
        currentCameraPhotoIndex = -1;
      }, 550);
    });

    polaroidOverlay.addEventListener('mousemove', (e) => {
      if (!isOpen || isClosing) return;
      const rect = lightbox.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      const tiltX = (y / (window.innerHeight / 2)) * -12;
      const tiltY = (x / (window.innerWidth / 2)) * 12;
      lightbox.style.transition = 'transform 0.1s ease-out';
      lightbox.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03) translateZ(20px)`;
    });

    polaroidOverlay.addEventListener('mouseleave', () => {
      if (!isOpen || isClosing) return;
      lightbox.style.transition = 'transform 0.4s ease-out';
      lightbox.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }


  // === 11. MP3 PLAYER ZOOM/INSPECT INTERACTION ===
  const deskMp3Player = document.getElementById('mp3-player');
  const mp3PlayerOverlay = document.getElementById('mp3-player-overlay');

  if (deskMp3Player && mp3PlayerOverlay) {
    const lightbox = mp3PlayerOverlay.querySelector('.mp3-player-lightbox');
    let isOpen = false;
    let isClosing = false;

    deskMp3Player.addEventListener('click', (e) => {
      // Prevent click when user is clicking the play pause button on desk
      if (e.target.closest('#mp3-play-pause')) return;
      if (isOpen || isClosing) return;
      e.stopPropagation();

      isOpen = true;
      isClosing = false;

      const rect = deskMp3Player.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const centerX = windowWidth / 2;
      const centerY = windowHeight / 2;
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const translateX = cardCenterX - centerX;
      const translateY = cardCenterY - centerY;
      const scale = rect.width / 250; // normalized to zoomed mp3 player width (250px)

      lightbox.style.transition = 'none';
      lightbox.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(0deg)`;

      deskMp3Player.style.opacity = '0';
      deskMp3Player.style.pointerEvents = 'none';
      mp3PlayerOverlay.classList.add('active');

      lightbox.offsetHeight; // reflow

      lightbox.style.transition = 'transform 0.65s cubic-bezier(0.25, 1.2, 0.5, 1)';
      lightbox.style.transform = 'translate(0, 0) scale(1) rotate(0deg)';
    });

    mp3PlayerOverlay.addEventListener('click', (e) => {
      // Don't close if clicking inside the mp3-player body (especially buttons)
      if (e.target.closest('.zoomed-mp3-player')) return;

      if (!isOpen || isClosing) return;

      isClosing = true;
      isOpen = false;

      const rect = deskMp3Player.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const centerX = windowWidth / 2;
      const centerY = windowHeight / 2;
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const translateX = cardCenterX - centerX;
      const translateY = cardCenterY - centerY;
      const scale = rect.width / 250;

      lightbox.style.transition = 'transform 0.55s cubic-bezier(0.55, 0, 0.1, 1)';
      lightbox.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(0deg)`;

      mp3PlayerOverlay.classList.remove('active');

      setTimeout(() => {
        deskMp3Player.style.opacity = '1';
        deskMp3Player.style.pointerEvents = 'auto';
        lightbox.style.transition = '';
        lightbox.style.transform = '';
        isClosing = false;
      }, 550);
    });

    mp3PlayerOverlay.addEventListener('mousemove', (e) => {
      if (!isOpen || isClosing) return;
      const rect = lightbox.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      const tiltX = (y / (window.innerHeight / 2)) * -12;
      const tiltY = (x / (window.innerWidth / 2)) * 12;
      lightbox.style.transition = 'transform 0.1s ease-out';
      lightbox.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03) translateZ(20px)`;
    });

    mp3PlayerOverlay.addEventListener('mouseleave', () => {
      if (!isOpen || isClosing) return;
      lightbox.style.transition = 'transform 0.4s ease-out';
      lightbox.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }

});

