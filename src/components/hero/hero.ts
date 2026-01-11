import './hero.css';

export function initHero() {
  // Typing Animation with Endless Loop
  const typingText = document.getElementById('typing-text');
  const fullName = 'Leow Kai Wen';
  let charIndex = 0;
  let isDeleting = false;
  
  function typeWriter() {
    if (!typingText) return;

    if (!isDeleting) {
      // Typing forward
      if (charIndex <= fullName.length) {
        typingText.textContent = fullName.substring(0, charIndex);
        charIndex++;
        setTimeout(typeWriter, 150); // Typing speed
      } else {
        // Pause at the end before deleting
        setTimeout(() => {
          isDeleting = true;
          typeWriter();
        }, 2000); // Wait 2 seconds before deleting
      }
    } else {
      // Deleting backward
      if (charIndex > 0) {
        typingText.textContent = fullName.substring(0, charIndex - 1);
        charIndex--;
        setTimeout(typeWriter, 100); // Deleting speed (faster)
      } else {
        // Pause before typing again
        isDeleting = false;
        setTimeout(() => {
          typeWriter();
        }, 500); // Wait 0.5 seconds before typing again
      }
    }
  }

  // Start typing animation after a short delay
  setTimeout(() => {
    typeWriter();
  }, 500);

  // Smooth scroll for anchor links
  const heroButtons = document.querySelectorAll('.hero-btn');
  heroButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const href = button.getAttribute('href');
      if (href?.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // Scroll indicator click handler
  const scrollIndicator = document.querySelector('.scroll-indicator');
  scrollIndicator?.addEventListener('click', () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });

  console.log('Hero section initialized!');
}