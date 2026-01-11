import './main.css';
import { initHeader } from './components/header/header';
import { initFooter } from './components/footer/footer';
import { initHero } from './components/hero/hero';
import { initAbout } from './components/about/about';
import { initSkills } from './components/skills/skills';
import { initProjects } from './components/projects/projects';
import { initContact } from './components/contact/contact';

// Import HTML files as raw strings
import headerHtml from './components/header/header.html?raw';
import footerHtml from './components/footer/footer.html?raw';
import heroHtml from './components/hero/hero.html?raw';
import aboutHtml from './components/about/about.html?raw';
import skillsHtml from './components/skills/skills.html?raw';
import projectsHtml from './components/projects/projects.html?raw';
import contactHtml from './components/contact/contact.html?raw';

// Load Header Component
async function loadHeader(){
  const headerContainer = document.getElementById('header-container');
  if(headerContainer){
    headerContainer.innerHTML = headerHtml;

    initHeader();

    if (typeof (window as any).lucide !== 'undefined') {
      (window as any).lucide.createIcons();
    }
  }
}

// Load Footer Component
async function loadFooter(){
  const footerContainer = document.getElementById('footer-container');
  if(footerContainer){
    footerContainer.innerHTML = footerHtml;

    initFooter();

    if(typeof (window as any).lucide !== 'undefined'){
      (window as any).lucide.createIcons();
    }
  }
}

// Load Hero Component
async function loadHero(){
  const heroContainer = document.getElementById('hero-container');
  if(heroContainer){
    heroContainer.innerHTML = heroHtml;

    initHero();

    if(typeof(window as any).lucide !== 'undefined'){
      (window as any).lucide.createIcons();
    }
  }
}

// Load About Component
async function loadAbout(){
  const aboutContainer = document.getElementById('about-container');
  if(aboutContainer){
    aboutContainer.innerHTML = aboutHtml;

    initAbout();

    if(typeof(window as any).lucide !== 'undefined'){
      (window as any).lucide.createIcons();
    }
  }
}

// Load skills component
async function loadSkills() {
  const skillsContainer = document.getElementById('skills-container');
  if (skillsContainer) {
    skillsContainer.innerHTML = skillsHtml;

    initSkills();
    if (typeof (window as any).lucide !== 'undefined') {
      (window as any).lucide.createIcons();
    }
  }
}

// Load projects component
async function loadProjects() {
  const projectsContainer = document.getElementById('projects-container');
  if (projectsContainer) {
    projectsContainer.innerHTML = projectsHtml;
    
    initProjects();
    if (typeof (window as any).lucide !== 'undefined') {
      (window as any).lucide.createIcons();
    }
  }
}

// Load contact component
async function loadContact() {
  const contactContainer = document.getElementById('contact-container');
  if (contactContainer) {
    contactContainer.innerHTML = contactHtml;

    initContact();
    if (typeof (window as any).lucide !== 'undefined') {
      (window as any).lucide.createIcons();
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadHeader();
  await loadFooter();
  await loadHero();
  await loadAbout();
  await loadSkills();
  await loadProjects();
  await loadContact();
  console.log('Website Loaded');
})