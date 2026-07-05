document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (!track) return;
    
    const slides = Array.from(track.children);
    
    const setupCarousel = () => {
        dotsContainer.innerHTML = '';
        const slideWidth = slides[0].getBoundingClientRect().width;
        const gap = 24;
        
        // Calculate maximum scrollable width
        const maxScrollLeft = track.scrollWidth - track.clientWidth;
        
        // If there's nothing to scroll, no dots needed
        if (maxScrollLeft <= 0) return;
        
        // Number of dots needed = ceil(maxScrollLeft / step) + 1
        const numDots = Math.ceil(maxScrollLeft / (slideWidth + gap)) + 1;
        
        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Ir para a página ${i + 1}`);
            
            dot.addEventListener('click', () => {
                // Ensure we don't scroll past the max
                const scrollTo = Math.min((slideWidth + gap) * i, track.scrollWidth - track.clientWidth);
                track.scrollTo({
                    left: scrollTo,
                    behavior: 'smooth'
                });
            });
            
            dotsContainer.appendChild(dot);
        }
        
        updateDotsActiveState();
    };
    
    const updateDotsActiveState = () => {
        if (dotsContainer.children.length === 0) return;
        
        const slideWidth = slides[0].getBoundingClientRect().width;
        const gap = 24;
        const scrollPosition = track.scrollLeft;
        const maxScrollLeft = track.scrollWidth - track.clientWidth;
        
        let activeIndex = Math.round(scrollPosition / (slideWidth + gap));
        
        // If reached the end, highlight the last dot
        if (scrollPosition >= maxScrollLeft - 5) {
            activeIndex = dotsContainer.children.length - 1;
        }
        
        const dots = Array.from(dotsContainer.children);
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };
    
    // Initial setup
    setupCarousel();
    
    // Ensure it updates when images load or window resizes
    window.addEventListener('load', setupCarousel);
    window.addEventListener('resize', setupCarousel);
    
    // Update active dot on scroll
    track.addEventListener('scroll', updateDotsActiveState);
    
    // Navigation Buttons
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            const slideWidth = slides[0].getBoundingClientRect().width;
            const gap = 24;
            const scrollPosition = track.scrollLeft;
            
            track.scrollTo({
                left: scrollPosition + slideWidth + gap,
                behavior: 'smooth'
            });
        });
        
        prevBtn.addEventListener('click', () => {
            const slideWidth = slides[0].getBoundingClientRect().width;
            const gap = 24;
            const scrollPosition = track.scrollLeft;
            
            track.scrollTo({
                left: scrollPosition - slideWidth - gap,
                behavior: 'smooth'
            });
        });
    }
});
