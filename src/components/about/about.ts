import './about.css';

export function initAbout(){

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const aboutSection = document.querySelector('.about-section');
    if(aboutSection){
        observer.observe(aboutSection);
    }

    // Add hover effect to highlight cards
    const highlightCards = document.querySelectorAll<HTMLElement>('.highlight-card');
    highlightCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateX(10px)';
        });
        
        card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateX(0)';
        });
    });

  console.log('About section initialized!');
}