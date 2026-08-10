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
});
