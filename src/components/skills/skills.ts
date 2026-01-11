import './skills.css';

export function initSkills() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const skillsSection = document.querySelector('.skills-section');
  if (skillsSection) {
    observer.observe(skillsSection);
  }

  // Add interactive effects to skill cards
  const skillCards = document.querySelectorAll<HTMLElement>('.skill-card');
  skillCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
    });
  });

  console.log('Skills section initialized!');
}