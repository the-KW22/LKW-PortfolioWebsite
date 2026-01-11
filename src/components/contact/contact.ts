import './contact.css';

export function initContact() {
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

  const contactSection = document.querySelector('.contact-section');
  if (contactSection) {
    observer.observe(contactSection);
  }

  // Form submission handler
  const contactForm = document.getElementById('contact-form') as HTMLFormElement;
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form values
      const name = (document.getElementById('name') as HTMLInputElement).value;
      const email = (document.getElementById('email') as HTMLInputElement).value;
      const subject = (document.getElementById('subject') as HTMLInputElement).value;
      const message = (document.getElementById('message') as HTMLTextAreaElement).value;
      
      // Create mailto link with pre-filled data
      const mailtoLink = `mailto:kwenleow@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      )}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      // Optional: Show success message or reset form
      // contactForm.reset();
      // alert('Your email client will open with the message. Please send it from there!');
    });
  }

  // Add focus effects to form inputs
  const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
  formInputs.forEach(input => {
    input.addEventListener('focus', () => {
      const icon = input.parentElement?.querySelector('i');
      if (icon) {
        icon.style.color = '#FE4D01';
      }
    });
    
    input.addEventListener('blur', () => {
      const icon = input.parentElement?.querySelector('i');
      if (icon) {
        icon.style.color = '';
      }
    });
  });

  // Hover effects for info cards
  const infoCards = document.querySelectorAll('.info-card');
  infoCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      (card as HTMLElement).style.borderLeftWidth = '6px';
    });
    
    card.addEventListener('mouseleave', () => {
      (card as HTMLElement).style.borderLeftWidth = '4px';
    });
  });

  console.log('Contact section initialized!');
}