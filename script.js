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
