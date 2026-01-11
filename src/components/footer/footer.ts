import './footer.css';

export function initFooter() {
  // Set current year dynamically
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear().toString();
  }

  // Smooth scroll for footer navigation links
  const footerLinks = document.querySelectorAll('.footer-link');
  footerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href?.startsWith('#')) {
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          // Get header height for offset
          const header = document.querySelector('.header') as HTMLElement;
          const headerHeight = header ? header.offsetHeight : 0;
          
          // Calculate position with offset
          const targetPosition = targetSection.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Smooth scroll for footer logo
  const footerLogo = document.querySelector('.footer-logo');
  footerLogo?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  console.log('Footer initialized!');
}