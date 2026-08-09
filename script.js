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
                ctx.fillStyle = `rgba(255, 51, 51, ${this.opacity})`; // var(--accent-red)
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


    // --- CURSOR SPOTLIGHT ---
    const spotlight = document.getElementById('spotlight');
    if (spotlight) {
        window.addEventListener('mousemove', (e) => {
            spotlight.style.left = e.clientX + 'px';
            spotlight.style.top = e.clientY + 'px';
        });
    }

    // --- MAGNETIC BUTTONS ---
    const magneticElements = document.querySelectorAll('.cta-button, .carousel-btn');
    
    magneticElements.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const h = rect.width / 2;
            const v = rect.height / 2;
            
            // Calculate distance from center of button
            const x = e.clientX - rect.left - h;
            const y = e.clientY - rect.top - v;
            
            // Move button slightly towards cursor (magnetic pull factor: 0.3)
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        el.addEventListener('mouseleave', () => {
            // Reset position
            el.style.transform = 'translate(0px, 0px)';
        });
    });


    // --- LEAVE-PAGE TAB NOTIFICATION ---
    let originalTitle = document.title;
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.title = '⚠️ NETWORK COMPROMISED!';
        } else {
            document.title = originalTitle;
        }
    });

    // --- CUSTOM RIGHT CLICK MENU ---
    const customMenu = document.getElementById('custom-menu');
    const menuClose = document.getElementById('menu-close');
    
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        customMenu.style.display = 'block';
        
        // Prevent menu from going off-screen
        let x = e.clientX;
        let y = e.clientY;
        if (x + 200 > window.innerWidth) x = window.innerWidth - 200;
        if (y + 150 > window.innerHeight) y = window.innerHeight - 150;
        
        customMenu.style.left = x + 'px';
        customMenu.style.top = y + 'px';
    });

    document.addEventListener('click', (e) => {
        if (!customMenu.contains(e.target)) {
            customMenu.style.display = 'none';
        }
    });
    if (menuClose) {
        menuClose.addEventListener('click', () => {
            customMenu.style.display = 'none';
        });
    }

    // --- LIVE HACKER NOTIFICATIONS ---
    const notifContainer = document.getElementById('notification-container');
    const fakeLogs = [
        '> Incoming connection blocked in sector 4.',
        '> Security sweep active...',
        '> Payout completed for Operative [REDACTED].',
        '> Firewall integrity at 99.9%.',
        '> Unauthorized access attempt thwarted.',
        '> Encrypting outgoing traffic...',
        '> Syndicate servers nominal.'
    ];

    if (notifContainer) {
        setInterval(() => {
            // 30% chance to show a notification every 5 seconds
            if (Math.random() < 0.3) {
                const notif = document.createElement('div');
                notif.className = 'hacker-notify';
                const randomText = fakeLogs[Math.floor(Math.random() * fakeLogs.length)];
                
                // Typing effect for notification
                let charIdx = 0;
                notifContainer.appendChild(notif);
                
                // Slide in
                setTimeout(() => notif.classList.add('show'), 50);
                
                function typeNotif() {
                    if (charIdx < randomText.length) {
                        notif.innerHTML += randomText.charAt(charIdx);
                        charIdx++;
                        setTimeout(typeNotif, 20);
                    } else {
                        // Fade out after 4 seconds
                        setTimeout(() => {
                            notif.classList.remove('show');
                            setTimeout(() => notif.remove(), 500);
                        }, 4000);
                    }
                }
                typeNotif();
            }
        }, 5000);
    }

    
    


    // --- SCROLL PROGRESS BAR ---
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.getElementById('scroll-progress-bar');
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    });

});
