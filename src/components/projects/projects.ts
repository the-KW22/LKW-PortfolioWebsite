import './projects.css';

export function initProjects() {
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

  const projectsSection = document.querySelector('.projects-section');
  if (projectsSection) {
    observer.observe(projectsSection);
  }

  // Image gallery functionality
  const thumbnailButtons = document.querySelectorAll('.thumbnail-btn');
  
  thumbnailButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const target = event.currentTarget as HTMLButtonElement;
      const projectNumber = target.getAttribute('data-project');
      const imageSrc = target.querySelector('img')?.getAttribute('src');
      
      if (!imageSrc || !projectNumber) return;
      
      // Update main image
      const mainImage = document.getElementById(`project${projectNumber}-main-image`) as HTMLImageElement;
      if (mainImage) {
        mainImage.src = imageSrc;
      }
      
      // Update active state
      const projectThumbnails = document.querySelectorAll(`[data-project="${projectNumber}"]`);
      projectThumbnails.forEach(thumb => {
        thumb.classList.remove('active');
        const img = thumb.querySelector('img');
        if (img) {
          img.classList.remove('border-primary');
          img.classList.add('border-transparent');
        }
      });
      
      target.classList.add('active');
      const activeImg = target.querySelector('img');
      if (activeImg) {
        activeImg.classList.remove('border-transparent');
        activeImg.classList.add('border-primary');
      }
    });
  });

  // Smooth hover effects for project cards
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      (card as HTMLElement).style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', () => {
      (card as HTMLElement).style.transform = 'translateY(0)';
    });
  });

  console.log('Projects section initialized!');
}