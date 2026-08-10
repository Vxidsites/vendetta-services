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

    // Member Slider Modal Logic
    const members = document.querySelectorAll('.member-card');
    const modal = document.getElementById('member-modal');
    const modalAvatar = document.getElementById('modal-avatar');
    const modalName = document.getElementById('modal-name');
    const modalRole = document.getElementById('modal-role');
    const closeBtn = document.getElementById('close-modal');
    const prevBtn = document.getElementById('prev-member');
    const nextBtn = document.getElementById('next-member');

    let currentIndex = 0;

    function updateModal(index) {
        const member = members[index];
        const img = member.querySelector('.member-avatar');
        const name = member.querySelector('h3').innerText;
        const role = member.querySelector('.member-role').innerText;

        if (img && img.tagName.toLowerCase() === 'img') {
            modalAvatar.src = img.src;
        } else {
            modalAvatar.src = ''; 
        }
        
        modalName.innerText = name;
        modalRole.innerText = role;
    }

    members.forEach((card, index) => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            currentIndex = index;
            updateModal(currentIndex);
            modal.classList.add('active');
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : members.length - 1;
            updateModal(currentIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < members.length - 1) ? currentIndex + 1 : 0;
            updateModal(currentIndex);
        });
    }
});
