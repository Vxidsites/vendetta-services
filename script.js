document.addEventListener('DOMContentLoaded', () => {
    // Loading Screen Logic
    const loader = document.getElementById('loader');
    
    // Hide loader after 2 seconds (matches the CSS animation)
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 2000);

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Scroll Reveal Animations
    // This makes elements glide in when you scroll down, and disappear when you scroll up out of view
    const reveals = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                // Remove the class when scrolled out of view so it repeats the animation when scrolling back
                entry.target.classList.remove('active');
            }
        });
    }, { 
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits the very bottom
    });

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });
});

    // --- CUSTOM CURSOR & PARTICLES ---
    const cursorDot = document.getElementById("cursor-dot");
    const cursorOutline = document.getElementById("cursor-outline");
    
    // Track mouse position
    let mouseX = 0;
    let mouseY = 0;
    
    // For smooth trailing outline
    let outlineX = 0;
    let outlineY = 0;
    
    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Dot follows instantly
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
        
        // Create particle on movement (throttle it slightly)
        if(Math.random() > 0.8) {
            createParticle(mouseX, mouseY);
        }
    });
    
    // Animate outline smoothly
    function animateCursor() {
        // Easing factor (lower = slower trail)
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover effects for links and buttons
    const hoverElements = document.querySelectorAll("a, button, .btn, .step-card, .stat-box");
    hoverElements.forEach(el => {
        el.addEventListener("mouseenter", () => {
            cursorOutline.classList.add("cursor-hover");
        });
        el.addEventListener("mouseleave", () => {
            cursorOutline.classList.remove("cursor-hover");
        });
    });
    
    // Particle Generator
    function createParticle(x, y) {
        const particle = document.createElement("div");
        particle.classList.add("particle");
        
        // Randomize size and offset
        const size = Math.random() * 4 + 2;
        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 40;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x + offsetX}px`;
        particle.style.top = `${y + offsetY}px`;
        
        document.body.appendChild(particle);
        
        // Remove after animation (1s)
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }

    // --- AMBIENT AUDIO TOGGLE ---
    const audioToggle = document.getElementById("audio-toggle");
    const ambientAudio = document.getElementById("ambient-audio");
    let isPlaying = false;
    
    // Set audio volume extremely low so it is just ambient
    if(ambientAudio) ambientAudio.volume = 0.2;
    
    if(audioToggle && ambientAudio) {
        audioToggle.addEventListener("click", () => {
            if(isPlaying) {
                ambientAudio.pause();
                audioToggle.innerHTML = `<i class="fas fa-volume-mute"></i>`;
                isPlaying = false;
            } else {
                ambientAudio.play().catch(e => console.log("Audio play prevented by browser"));
                audioToggle.innerHTML = `<i class="fas fa-volume-up"></i>`;
                isPlaying = true;
            }
        });
    }

