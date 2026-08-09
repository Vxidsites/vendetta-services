document.addEventListener('DOMContentLoaded', () => {
    // Loading Screen Logic
    const loader = document.getElementById('loader');
    
    // Hide loader after 2 seconds
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

    // --- AMBIENT AUDIO TOGGLE ---
    const audioToggle = document.getElementById("audio-toggle");
    const ambientAudio = document.getElementById("ambient-audio");
    let isPlaying = false;
    
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
});
