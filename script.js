document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Particles Background
    if (window.particlesJS) {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#ff3333" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": false },
                "size": { "value": 3, "random": true },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ff3333",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": { "enable": true, "mode": "grab" },
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                },
                "modes": {
                    "grab": { "distance": 140, "line_linked": { "opacity": 1 } },
                    "push": { "particles_nb": 4 }
                }
            },
            "retina_detect": true
        });
    }

    // 2. Loading Screen & Live Data Sequence
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.getElementById('loading-progress');
    const loadingStatus = document.getElementById('loading-status');
    const discordFeed = document.getElementById('discord-feed');
    const gtaFeed = document.getElementById('gta-feed');
    const memberCount = document.getElementById('member-count');

    // Simulate boot sequence
    if (loadingScreen && progressBar) {
        setTimeout(() => {
            progressBar.style.width = '40%';
            loadingStatus.innerText = 'Fetching live Discord data...';
        }, 500);

        setTimeout(() => {
            progressBar.style.width = '80%';
            loadingStatus.innerText = 'Connecting to Rockstar Newswire...';
        }, 1500);

        setTimeout(() => {
            progressBar.style.width = '100%';
            loadingStatus.innerText = 'System Online.';
            
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.visibility = 'hidden';
                
                // Trigger Data Injection after load
                injectLiveData();
            }, 500);
        }, 2500);
    }

    async function injectLiveData() {
        if (!memberCount) return;
        
        try {
            // Fetch live Discord data from our Render Python backend
            const discordResponse = await fetch('https://vendetta-security-bot.onrender.com/api/discord');
            if (discordResponse.ok) {
                const data = await discordResponse.json();
                
                // Animate Member Count
                let currentCount = 0;
                const targetCount = data.member_count !== '--' ? data.member_count : 0; 
                const step = Math.ceil(targetCount / 50) || 1;
                const countInterval = setInterval(() => {
                    currentCount += step;
                    if (currentCount >= targetCount) {
                        currentCount = targetCount;
                        clearInterval(countInterval);
                    }
                    memberCount.innerText = currentCount;
                }, 20);

                // Inject Discord Announcements
                if (discordFeed && data.announcements.length > 0) {
                    discordFeed.innerHTML = '';
                    data.announcements.forEach(msg => {
                        const date = new Date(msg.timestamp).toLocaleDateString();
                        discordFeed.innerHTML += `
                            <div class="feed-item">
                                <div class="feed-item-header">
                                    <span><i class="fab fa-discord"></i> ${msg.author}</span>
                                    <span>${date}</span>
                                </div>
                                <div class="feed-item-body">
                                    ${msg.content}
                                </div>
                            </div>
                        `;
                    });
                } else if (discordFeed) {
                    discordFeed.innerHTML = '<div class="feed-item">No recent announcements found.</div>';
                }
            }
        } catch (error) {
            console.error("Failed to fetch live Discord data. Make sure the bot is running.", error);
            if (discordFeed) discordFeed.innerHTML = '<div class="feed-item" style="color:red;">Error: Backend Offline. Make sure keep_alive.py is running.</div>';
        }

        // Fetch Live GTA News (using IGN GTA 5 RSS feed for real-time news)
        try {
            const newsResponse = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.ign.com/rss/articles/feed?tags=gta-5');
            if (newsResponse.ok) {
                const data = await newsResponse.json();
                if (gtaFeed && data.items) {
                    gtaFeed.innerHTML = '';
                    // Take top 3 news items
                    data.items.slice(0, 3).forEach(item => {
                        const date = new Date(item.pubDate).toLocaleDateString();
                        gtaFeed.innerHTML += `
                            <div class="feed-item">
                                <div class="feed-item-header">
                                    <span><i class="fas fa-rss"></i> News</span>
                                    <span>${date}</span>
                                </div>
                                <div class="feed-item-body">
                                    <strong><a href="${item.link}" target="_blank" style="color: #fff; text-decoration: none;">${item.title}</a></strong>
                                </div>
                            </div>
                        `;
                    });
                }
            }
        } catch (error) {
            console.error("Failed to fetch GTA news", error);
            if (gtaFeed) gtaFeed.innerHTML = '<div class="feed-item" style="color:red;">Error fetching news.</div>';
        }
    }

    const navItems = document.querySelectorAll('.nav-links li');
    const views = document.querySelectorAll('.view-section');
    const toggles = document.querySelectorAll('.toggle-switch');
    const dockItems = document.querySelectorAll('.dock-item');

    // Sidebar Tab Switching
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all navs
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active to clicked nav
            item.classList.add('active');

            // Hide all views
            views.forEach(view => {
                view.classList.remove('active-view');
            });

            // Show target view
            const targetId = item.getAttribute('data-target');
            const targetView = document.getElementById(targetId);
            if (targetView) {
                targetView.classList.add('active-view');
                if (targetId === 'syndicate') {
                    const cPanel = document.getElementById('carousel-panel');
                    if(cPanel) {
                        cPanel.classList.remove('slide-in-up', 'slide-in-right', 'slide-in-left');
                        void cPanel.offsetWidth; 
                        cPanel.classList.add('slide-in-up');
                    }
                }
            }
        });
    });

    // Toggle Switches (Visual only for now)
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
        });
    });
    
    // Bottom dock active states (Optional interaction)
    dockItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if(!item.href) {
                dockItems.forEach(d => d.classList.remove('active-dock'));
                item.classList.add('active-dock');
            }
        });
    });

    // Syndicate Carousel Logic
    const roster = [
        { name: "Nx5hh", role: "Founder/Creator", img: "founder.jpg" },
        { name: "Buddy", role: "Service Provider", img: "buddy.png" },
        { name: "XXPly_keaxx", role: "Service Provider", img: "xxply.png" },
        { name: "Graysnyper", role: "Admin", img: "graysnyper.png" },
        { name: "Sosa", role: "Senior Staff", img: "sosa.png" },
        { name: "Heatymeat", role: "Senior Staff", img: "heatymeat.png" },
        { name: "Leon", role: "Senior Staff", img: "leon.png" },
        { name: "DaGoat12", role: "Support", img: "dagoat12.png" },
        { name: "RaiiDen", role: "Trial Support", img: "raiiden.png" },
        { name: "Er0nzii", role: "Trial Support", img: "eronzii.png" }
    ];

    const carouselPanel = document.getElementById('carousel-panel');
    const carouselPrev = document.getElementById('carousel-prev');
    const carouselNext = document.getElementById('carousel-next');

    let currentCarouselIndex = 0;
    let isAnimating = false;

    function renderCarouselMember(index, animationClass) {
        const member = roster[index];
        
        carouselPanel.className = 'carousel-panel-wrapper glass-panel';
        void carouselPanel.offsetWidth; // trigger reflow

        if (animationClass) {
            carouselPanel.classList.add(animationClass);
        }

        carouselPanel.innerHTML = `
            <img src="${member.img}" class="carousel-avatar" alt="${member.name}">
            <h2 class="carousel-name">${member.name}</h2>
            <div class="carousel-role">${member.role}</div>
        `;
    }

    if (carouselPanel && carouselPrev && carouselNext) {
        // Initial render
        renderCarouselMember(currentCarouselIndex, 'slide-in-up');

        // Mouse interaction (Tilt)
        carouselPanel.addEventListener('mousemove', (e) => {
            if (isAnimating) return;
            const rect = carouselPanel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -15; 
            const rotateY = ((x - centerX) / centerX) * 15;
            const translateX = ((x - centerX) / centerX) * 15;
            const translateY = ((y - centerY) / centerY) * 15;
            
            carouselPanel.style.transform = `perspective(1000px) translate(${translateX}px, ${translateY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        carouselPanel.addEventListener('mouseleave', () => {
            if (isAnimating) return;
            carouselPanel.style.transform = `perspective(1000px) translate(0px, 0px) rotateX(0) rotateY(0)`;
        });

        carouselNext.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;

            carouselPanel.classList.add('fade-out-left');
            
            setTimeout(() => {
                currentCarouselIndex = (currentCarouselIndex + 1) % roster.length;
                renderCarouselMember(currentCarouselIndex, 'slide-in-right');
                
                setTimeout(() => { isAnimating = false; }, 500); 
            }, 400); 
        });

        carouselPrev.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;

            carouselPanel.classList.add('fade-out-right');
            
            setTimeout(() => {
                currentCarouselIndex = (currentCarouselIndex - 1 + roster.length) % roster.length;
                renderCarouselMember(currentCarouselIndex, 'slide-in-left');
                
                setTimeout(() => { isAnimating = false; }, 500);
            }, 400);
        });
    }

});
