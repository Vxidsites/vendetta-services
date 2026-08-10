document.addEventListener('DOMContentLoaded', () => {
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
        renderCarouselMember(currentCarouselIndex, '');

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
