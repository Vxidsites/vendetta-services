document.addEventListener('DOMContentLoaded', () => {

    if (window.particlesJS) {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": ["#ff3333", "#ff0000", "#ff6666"] },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.3, "random": true, "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false } },
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


    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.getElementById('loading-progress');
    const loadingStatus = document.getElementById('loading-status');
    const discordFeed = document.getElementById('discord-feed');
    const gtaFeed = document.getElementById('gta-feed');
    const memberCount = document.getElementById('member-count');


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
            }, 500);
        }, 2500);
    }


    injectLiveData();

    async function injectLiveData() {
        if (!memberCount) return;
        
        try {

            const discordResponse = await fetch('https://vendetta-security-bot.onrender.com/api/discord');
            if (discordResponse.ok) {
                const data = await discordResponse.json();
                

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


                if (gtaFeed && data.gta_news && data.gta_news.length > 0) {
                    gtaFeed.innerHTML = '';
                    data.gta_news.forEach(msg => {
                        const date = new Date(msg.timestamp).toLocaleDateString();
                        const linkStr = msg.link ? `<a href="${msg.link}" target="_blank" style="color: #fff; text-decoration: none;">${msg.content}</a>` : msg.content;
                        gtaFeed.innerHTML += `
                            <div class="feed-item">
                                <div class="feed-item-header">
                                    <span><i class="fas fa-rss"></i> ${msg.author}</span>
                                    <span>${date}</span>
                                </div>
                                <div class="feed-item-body">
                                    <strong>${linkStr}</strong>
                                </div>
                            </div>
                        `;
                    });
                } else if (gtaFeed) {
                    gtaFeed.innerHTML = '<div class="feed-item">No recent GTA news found.</div>';
                }
            }
        } catch (error) {
            console.error("Failed to fetch live Discord data. Make sure the bot is running.", error);
            if (discordFeed) discordFeed.innerHTML = '<div class="feed-item" style="color:red;">Error: Backend Offline. Make sure keep_alive.py is running.</div>';
        }
    }

    const navItems = document.querySelectorAll('.nav-links li');
    const views = document.querySelectorAll('.view-section');
    const toggles = document.querySelectorAll('.toggle-switch');
    const dockItems = document.querySelectorAll('.dock-item');


    navItems.forEach(item => {
        item.addEventListener('click', () => {

            navItems.forEach(nav => nav.classList.remove('active'));

            item.classList.add('active');


            views.forEach(view => {
                view.classList.remove('active-view');
            });


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


    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
        });
    });
    

    dockItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if(!item.href) {
                dockItems.forEach(d => d.classList.remove('active-dock'));
                item.classList.add('active-dock');
            }
        });
    });


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

        renderCarouselMember(currentCarouselIndex, 'slide-in-up');


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
            isAnimating = true;
            carouselPanel.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
            setTimeout(() => {
                isAnimating = false;
            }, 300);
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

    // Bento 3D Hover Effect
    const bentoItems = document.querySelectorAll('.bento-hover');
    bentoItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            
            item.style.transform = `perspective(1000px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg)';
        });
    });

    // Scroll Reveal Animations
    function reveal() {
        var reveals = document.querySelectorAll(".reveal");
        for (var i = 0; i < reveals.length; i++) {
            var windowHeight = window.innerHeight;
            var elementTop = reveals[i].getBoundingClientRect().top;
            var elementVisible = 50;
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add("active");
            }
        }
    }
    window.addEventListener("scroll", reveal);
    reveal(); // Trigger once on load to show elements initially in viewport

});

