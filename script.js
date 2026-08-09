document.addEventListener('DOMContentLoaded', () => {
    // Loading Screen Logic
    
    // Terminal Boot-Up Logic
    const loader = document.getElementById('loader');
    const lines = [
        document.getElementById('term-line-1'),
        document.getElementById('term-line-2'),
        document.getElementById('term-line-3')
    ];
    const texts = [
        '> ESTABLISHING SECURE CONNECTION...',
        '> BYPASSING FIREWALLS...',
        '> ACCESS GRANTED: VENDETTA SYNDICATE.'
    ];
    
    let lineIdx = 0;
    let charIdx = 0;
    
    function typeText() {
        if (lineIdx < lines.length) {
            if (charIdx < texts[lineIdx].length) {
                lines[lineIdx].innerHTML += texts[lineIdx].charAt(charIdx);
                charIdx++;
                setTimeout(typeText, 30); // typing speed
            } else {
                lineIdx++;
                charIdx = 0;
                setTimeout(typeText, 300); // pause between lines
            }
        } else {
            // Finished typing, hide loader
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }, 800);
        }
    }
    
    // Start typing
    setTimeout(typeText, 500);


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
    const reveals = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, { 
        threshold: 0.1, 
        rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });

    
    // --- TEAM CAROUSEL LOGIC ---
    const track = document.getElementById('team-track');
    if (track) {
        const cards = Array.from(track.children);
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        
        let currentIndex = 0;
        
        // Init active slide
        cards[currentIndex].classList.add('active-slide');
        
        function updateCarousel() {
            // Slide track
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update classes for scaling and opacity
            cards.forEach((card, index) => {
                if (index === currentIndex) {
                    card.classList.add('active-slide');
                } else {
                    card.classList.remove('active-slide');
                }
            });
        }
        
        nextBtn.addEventListener('click', () => {
            if (currentIndex < cards.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0; // wrap around to beginning
            }
            updateCarousel();
        });
        
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = cards.length - 1; // wrap around to end
            }
            updateCarousel();
        });
    }


    // 3D Holographic Card Tilt
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('.founder-card, .pricing-card'), {
            max: 15,
            speed: 400,
            glare: true,
            'max-glare': 0.2
        });
    }


    // --- SUBTLE BACKGROUND EMBERS ---
    const canvas = document.getElementById('ember-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const embers = [];
        const numEmbers = 40; // Subtle, not overwhelming

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        class Ember {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * width;
                this.y = height + Math.random() * 200;
                this.size = Math.random() * 2 + 0.5;
                this.speedY = Math.random() * 1 + 0.2;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1; // Max 0.6 opacity
            }
            update() {
                this.y -= this.speedY;
                this.x += this.speedX;
                
                // Wiggle effect
                this.x += Math.sin(this.y * 0.05) * 0.5;

                if (this.y < -10 || this.x < -10 || this.x > width + 10) {
                    this.reset();
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = gba(255, 51, 51, \)\; // var(--accent-red)
                ctx.fill();
            }
        }

        for (let i = 0; i < numEmbers; i++) {
            embers.push(new Ember());
        }

        function animateEmbers() {
            ctx.clearRect(0, 0, width, height);
            embers.forEach(ember => {
                ember.update();
                ember.draw();
            });
            requestAnimationFrame(animateEmbers);
        }

        animateEmbers();
    }

});
