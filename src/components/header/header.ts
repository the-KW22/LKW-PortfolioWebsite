import './header.css';

export function initHeader() {
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  let isMenuOpen = false;

  mobileMenuBtn?.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    mobileMenu?.classList.toggle('hidden');
    
    // Change icon between menu and X
    const menuIcon = mobileMenuBtn.querySelector('i');
    if (menuIcon) {
      menuIcon.setAttribute('data-lucide', isMenuOpen ? 'x' : 'menu');
      // Re-initialize icons after changing
      if (typeof (window as any).lucide !== 'undefined') {
        (window as any).lucide.createIcons();
      }
    }
  });

  // Smooth scroll for navigation links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href?.startsWith('#')) {
        e.preventDefault();
        
        // Close mobile menu if open
        if (isMenuOpen && mobileMenu) {
          isMenuOpen = false;
          mobileMenu.classList.add('hidden');
          const menuIcon = mobileMenuBtn?.querySelector('i');
          if (menuIcon) {
            menuIcon.setAttribute('data-lucide', 'menu');
            if (typeof (window as any).lucide !== 'undefined') {
              (window as any).lucide.createIcons();
            }
          }
        }
        
        // Smooth scroll to section
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

  // Add active state to nav links based on scroll position
  const updateActiveNavLink = () => {
    const sections = document.querySelectorAll('section[id]');
    const header = document.querySelector('.header') as HTMLElement;
    const headerHeight = header ? header.offsetHeight : 0;
    
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = (section as HTMLElement).offsetTop - headerHeight - 100;
      const sectionHeight = (section as HTMLElement).offsetHeight;
      
      if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id') || '';
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  };
  
  window.addEventListener('scroll', updateActiveNavLink);
  updateActiveNavLink(); // Call once on load

  // Add shadow on scroll
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  console.log('Header initialized!');
}