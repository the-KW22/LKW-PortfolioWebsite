(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function a(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerPolicy&&(n.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?n.credentials="include":e.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(e){if(e.ep)return;e.ep=!0;const n=a(e);fetch(e.href,n)}})();function g(){const t=document.getElementById("mobile-menu-btn"),i=document.getElementById("mobile-menu");let a=!1;t?.addEventListener("click",()=>{a=!a,i?.classList.toggle("hidden");const o=t.querySelector("i");o&&(o.setAttribute("data-lucide",a?"x":"menu"),typeof window.lucide<"u"&&window.lucide.createIcons())});const s=document.querySelectorAll(".nav-link");s.forEach(o=>{o.addEventListener("click",r=>{const d=o.getAttribute("href");if(d?.startsWith("#")){if(r.preventDefault(),a&&i){a=!1,i.classList.add("hidden");const m=t?.querySelector("i");m&&(m.setAttribute("data-lucide","menu"),typeof window.lucide<"u"&&window.lucide.createIcons())}const c=d.substring(1),l=document.getElementById(c);if(l){const m=document.querySelector(".header"),u=m?m.offsetHeight:0,p=l.offsetTop-u;window.scrollTo({top:p,behavior:"smooth"})}}})});const e=()=>{const o=document.querySelectorAll("section[id]"),r=document.querySelector(".header"),d=r?r.offsetHeight:0;let c="";o.forEach(l=>{const m=l.offsetTop-d-100,u=l.offsetHeight;window.pageYOffset>=m&&window.pageYOffset<m+u&&(c=l.getAttribute("id")||"")}),s.forEach(l=>{l.classList.remove("active"),l.getAttribute("href")===`#${c}`&&l.classList.add("active")})};window.addEventListener("scroll",e),e();const n=document.querySelector(".header");window.addEventListener("scroll",()=>{window.scrollY>50?n?.classList.add("scrolled"):n?.classList.remove("scrolled")}),console.log("Header initialized!")}function b(){const t=document.getElementById("current-year");t&&(t.textContent=new Date().getFullYear().toString()),document.querySelectorAll(".footer-link").forEach(s=>{s.addEventListener("click",e=>{const n=s.getAttribute("href");if(n?.startsWith("#")){e.preventDefault();const o=n.substring(1),r=document.getElementById(o);if(r){const d=document.querySelector(".header"),c=d?d.offsetHeight:0,l=r.offsetTop-c;window.scrollTo({top:l,behavior:"smooth"})}}})}),document.querySelector(".footer-logo")?.addEventListener("click",s=>{s.preventDefault(),window.scrollTo({top:0,behavior:"smooth"})}),console.log("Footer initialized!")}function f(){const t=document.getElementById("typing-text"),i="Leow Kai Wen";let a=0,s=!1;function e(){t&&(s?a>0?(t.textContent=i.substring(0,a-1),a--,setTimeout(e,100)):(s=!1,setTimeout(()=>{e()},500)):a<=i.length?(t.textContent=i.substring(0,a),a++,setTimeout(e,150)):setTimeout(()=>{s=!0,e()},2e3))}setTimeout(()=>{e()},500),document.querySelectorAll(".hero-btn").forEach(r=>{r.addEventListener("click",d=>{const c=r.getAttribute("href");if(c?.startsWith("#")){d.preventDefault();const l=document.querySelector(c);l&&l.scrollIntoView({behavior:"smooth",block:"start"})}})}),document.querySelector(".scroll-indicator")?.addEventListener("click",()=>{const r=document.querySelector("#about");r&&r.scrollIntoView({behavior:"smooth",block:"start"})}),console.log("Hero section initialized!")}function v(){const t={threshold:.2,rootMargin:"0px 0px -100px 0px"},i=new IntersectionObserver(e=>{e.forEach(n=>{n.isIntersecting&&(n.target.classList.add("animate"),i.unobserve(n.target))})},t),a=document.querySelector(".about-section");a&&i.observe(a),document.querySelectorAll(".highlight-card").forEach(e=>{e.addEventListener("mouseenter",()=>{e.style.transform="translateX(10px)"}),e.addEventListener("mouseleave",()=>{e.style.transform="translateX(0)"})}),console.log("About section initialized!")}function x(){const t={threshold:.2,rootMargin:"0px 0px -100px 0px"},i=new IntersectionObserver(e=>{e.forEach(n=>{n.isIntersecting&&(n.target.classList.add("animate"),i.unobserve(n.target))})},t),a=document.querySelector(".skills-section");a&&i.observe(a),document.querySelectorAll(".skill-card").forEach(e=>{e.addEventListener("mouseenter",()=>{e.style.boxShadow="0 20px 40px rgba(0, 0, 0, 0.15)"}),e.addEventListener("mouseleave",()=>{e.style.boxShadow=""})}),console.log("Skills section initialized!")}function w(){const t={threshold:.2,rootMargin:"0px 0px -100px 0px"},i=new IntersectionObserver(n=>{n.forEach(o=>{o.isIntersecting&&(o.target.classList.add("animate"),i.unobserve(o.target))})},t),a=document.querySelector(".projects-section");a&&i.observe(a),document.querySelectorAll(".thumbnail-btn").forEach(n=>{n.addEventListener("click",o=>{const r=o.currentTarget,d=r.getAttribute("data-project"),c=r.querySelector("img")?.getAttribute("src");if(!c||!d)return;const l=document.getElementById(`project${d}-main-image`);l&&(l.src=c),document.querySelectorAll(`[data-project="${d}"]`).forEach(p=>{p.classList.remove("active");const h=p.querySelector("img");h&&(h.classList.remove("border-primary"),h.classList.add("border-transparent"))}),r.classList.add("active");const u=r.querySelector("img");u&&(u.classList.remove("border-transparent"),u.classList.add("border-primary"))})}),document.querySelectorAll(".project-card").forEach(n=>{n.addEventListener("mouseenter",()=>{n.style.transform="translateY(-5px)"}),n.addEventListener("mouseleave",()=>{n.style.transform="translateY(0)"})}),console.log("Projects section initialized!")}function y(){const t={threshold:.2,rootMargin:"0px 0px -100px 0px"},i=new IntersectionObserver(o=>{o.forEach(r=>{r.isIntersecting&&(r.target.classList.add("animate"),i.unobserve(r.target))})},t),a=document.querySelector(".contact-section");a&&i.observe(a);const s=document.getElementById("contact-form");s&&s.addEventListener("submit",o=>{o.preventDefault();const r=document.getElementById("name").value,d=document.getElementById("email").value,c=document.getElementById("subject").value,l=document.getElementById("message").value,m=`mailto:kwenleow@gmail.com?subject=${encodeURIComponent(c)}&body=${encodeURIComponent(`Name: ${r}
Email: ${d}

Message:
${l}`)}`;window.location.href=m}),document.querySelectorAll(".form-group input, .form-group textarea").forEach(o=>{o.addEventListener("focus",()=>{const r=o.parentElement?.querySelector("i");r&&(r.style.color="#FE4D01")}),o.addEventListener("blur",()=>{const r=o.parentElement?.querySelector("i");r&&(r.style.color="")})}),document.querySelectorAll(".info-card").forEach(o=>{o.addEventListener("mouseenter",()=>{o.style.borderLeftWidth="6px"}),o.addEventListener("mouseleave",()=>{o.style.borderLeftWidth="4px"})}),console.log("Contact section initialized!")}const j=`<header class="header bg-white shadow-sm sticky top-0 z-50">
  <div class="container">
    <div class="flex justify-between items-center py-5">
      <!-- Logo -->
      <a href="javascript:location.reload();" class="logo flex items-center hover:opacity-80 transition-opacity">
        <img src="/v1/images/kw-logo.png" alt="LKW Logo" class="w-12 h-12 object-contain">
      </a>

      <!-- Desktop Navigation - Centered -->
      <nav class="hidden lg:flex items-center gap-10 absolute left-1/2 transform -translate-x-1/2">
        <a href="#hero" class="nav-link text-stone-700 hover:text-primary font-semibold text-[15px] tracking-wide transition-colors duration-300">
          Home
        </a>
        <a href="#about" class="nav-link text-stone-700 hover:text-primary font-semibold text-[15px] tracking-wide transition-colors duration-300">
          About
        </a>
        <a href="#project" class="nav-link text-stone-700 hover:text-primary font-semibold text-[15px] tracking-wide transition-colors duration-300">
          Project
        </a>
        <a href="#contact" class="nav-link text-stone-700 hover:text-primary font-semibold text-[15px] tracking-wide transition-colors duration-300">
          Contact
        </a>
      </nav>

      <!-- Icon Buttons - Right Side -->
      <div class="hidden lg:flex items-center gap-4">
        <a href="/v1/documents/LeowKaiWen-Resume.pdf" target="_blank" 
           class="icon-btn group rounded-full w-11 h-11 flex items-center justify-center border-2 border-stone-300 text-stone-700 hover:border-primary hover:bg-primary transition-all duration-300"
           title="Download Resume">
          <i data-lucide="download" class="w-5 h-5 group-hover:text-white transition-colors duration-300"></i>
        </a>
        <a href="https://github.com/the-KW22" target="_blank" 
           class="icon-btn group rounded-full w-11 h-11 flex items-center justify-center border-2 border-stone-300 text-stone-700 hover:border-primary hover:bg-primary transition-all duration-300"
           title="GitHub Profile">
          <i data-lucide="github" class="w-5 h-5 group-hover:text-white transition-colors duration-300"></i>
        </a>
        <a href="mailto:kwenleow@gmail.com" 
           class="icon-btn group rounded-full w-11 h-11 flex items-center justify-center border-2 border-stone-300 text-stone-700 hover:border-primary hover:bg-primary transition-all duration-300"
           title="Email Me">
          <i data-lucide="mail" class="w-5 h-5 group-hover:text-white transition-colors duration-300"></i>
        </a>
      </div>

      <!-- Mobile Menu Button -->
      <button id="mobile-menu-btn" class="lg:hidden text-stone-800 hover:text-primary transition-colors duration-300 p-2">
        <i data-lucide="menu" class="w-7 h-7"></i>
      </button>
    </div>

    <!-- Mobile Navigation -->
    <nav id="mobile-menu" class="mobile-menu lg:hidden hidden pb-6 border-t border-stone-200 pt-6">
      <div class="flex flex-col gap-5">
        <a href="#home" class="nav-link text-stone-700 hover:text-primary font-semibold text-base transition-colors duration-300 py-2">
          Home
        </a>
        <a href="#about" class="nav-link text-stone-700 hover:text-primary font-semibold text-base transition-colors duration-300 py-2">
          About
        </a>
        <a href="#project" class="nav-link text-stone-700 hover:text-primary font-semibold text-base transition-colors duration-300 py-2">
          Project
        </a>
        <a href="#contact" class="nav-link text-stone-700 hover:text-primary font-semibold text-base transition-colors duration-300 py-2">
          Contact
        </a>
        
        <div class="flex items-center gap-4 pt-4 border-t border-stone-200">
          <a href="/v1/resume.pdf" target="_blank" 
             class="icon-btn group rounded-full w-11 h-11 flex items-center justify-center border-2 border-stone-300 text-stone-700 hover:border-primary hover:bg-primary transition-all duration-300">
            <i data-lucide="download" class="w-5 h-5 group-hover:text-white transition-colors duration-300"></i>
          </a>
          <a href="https://github.com/the-KW22" target="_blank" 
             class="icon-btn group rounded-full w-11 h-11 flex items-center justify-center border-2 border-stone-300 text-stone-700 hover:border-primary hover:bg-primary transition-all duration-300">
            <i data-lucide="github" class="w-5 h-5 group-hover:text-white transition-colors duration-300"></i>
          </a>
          <a href="mailto:kwenleow@gmail.com" 
             class="icon-btn group rounded-full w-11 h-11 flex items-center justify-center border-2 border-stone-300 text-stone-700 hover:border-primary hover:bg-primary transition-all duration-300">
            <i data-lucide="mail" class="w-5 h-5 group-hover:text-white transition-colors duration-300"></i>
          </a>
        </div>
      </div>
    </nav>
  </div>
</header>`,k=`<footer class="footer bg-white border-t border-stone-200 mt-20">
  <div class="container">
    <!-- First Row: 3 Columns -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 py-12">
      <!-- Column 1: Logo -->
      <div class="flex justify-center md:justify-start">
        <a href="javascript:location.reload();" class="footer-logo block hover:opacity-80 transition-opacity duration-300">
          <img src="/v1/images/kw-logo.png" alt="LKW Logo" class="w-16 h-16 object-contain">
        </a>
      </div>

      <!-- Column 2: Navigation Links -->
      <div class="flex flex-col items-center md:items-start">
        <h3 class="text-stone-800 font-bold text-lg mb-4">Quick Links</h3>
        <nav class="flex flex-col gap-3">
          <a href="#hero" class="footer-link text-stone-600 hover:text-primary font-medium transition-colors duration-300">
            Home
          </a>
          <a href="#about" class="footer-link text-stone-600 hover:text-primary font-medium transition-colors duration-300">
            About
          </a>
          <a href="#project" class="footer-link text-stone-600 hover:text-primary font-medium transition-colors duration-300">
            Project
          </a>
          <a href="#contact" class="footer-link text-stone-600 hover:text-primary font-medium transition-colors duration-300">
            Contact
          </a>
        </nav>
      </div>

      <!-- Column 3: Social Icons -->
      <div class="flex flex-col items-center md:items-end">
        <h3 class="text-stone-800 font-bold text-lg mb-4">Connect With Me</h3>
        <div class="flex items-center gap-4">
          <a href="/v1/documents/LeowKaiWen-Resume.pdf" target="_blank" 
             class="footer-icon-btn group rounded-full w-12 h-12 flex items-center justify-center border-2 border-stone-300 text-stone-700 hover:border-primary hover:bg-primary transition-all duration-300"
             title="Download Resume">
            <i data-lucide="download" class="w-5 h-5 group-hover:text-white transition-colors duration-300"></i>
          </a>
          <a href="https://github.com/the-KW22" target="_blank" 
             class="footer-icon-btn group rounded-full w-12 h-12 flex items-center justify-center border-2 border-stone-300 text-stone-700 hover:border-primary hover:bg-primary transition-all duration-300"
             title="GitHub Profile">
            <i data-lucide="github" class="w-5 h-5 group-hover:text-white transition-colors duration-300"></i>
          </a>
          <a href="mailto:kwenleow@gmail.com" 
             class="footer-icon-btn group rounded-full w-12 h-12 flex items-center justify-center border-2 border-stone-300 text-stone-700 hover:border-primary hover:bg-primary transition-all duration-300"
             title="Email Me">
            <i data-lucide="mail" class="w-5 h-5 group-hover:text-white transition-colors duration-300"></i>
          </a>
        </div>
      </div>
    </div>

    <!-- Second Row: Disclaimer & Copyright -->
    <div class="border-t border-stone-200 py-8 mt-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-stone-500">
        <p class="text-center md:text-left">
          © <span id="current-year"></span> Leow Kai Wen Portfolio. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</footer>`,S=`<section class="hero relative min-h-screen flex items-center overflow-hidden" id="hero">
    <!-- Background Wallpaper -->
    <div class="hero-background absolute inset-0 z-0">
        <img src="/v1/images/hero/mount-fuji-background.jpg" alt="Mount Fuji Background Wallpaper" class="w-full h-full object-cover">

        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-linear-to-r from-black/90 via-black/70 to-black/30"></div>
    </div>

    <!-- Content -->
     <div class="container relative z-10">
        <div class="max-w-3xl">
            <!-- Greeting Text -->
            <div class="greeting mb-4 opacity-0">
                <p class="text-stone-300 text-lg font-medium tracking-wide">
                    Hi there! Welcome to my portfolio.
                </p>
            </div>

            <!-- Name with Typing Animation -->
            <div class="name-container mb-6">
                <h1 class="hero-name text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight">
                    <span class="gradient-text">
                        <span id="typing-text"></span>
                        <span class="typing-cursor font-light">|</span>
                    </span> 
                </h1>
            </div>

             <!-- Title & Position -->
            <div class="title-container mb-8 opacity-0">
                <h2 class="hero-title text-xl md:text-2xl lg:text-3xl font-semibold text-stone-200 tracking-wide">
                    Fresh Graduate <span class="text-primary">|</span> Software Engineering
                </h2>
            </div>

            <!-- Description -->
            <div class="description-container mb-10 opacity-0">
                <p class="hero-description text-base md:text-lg text-stone-300 leading-relaxed max-w-2xl">
                    Passionate software engineer specializing in full-stack development. I transform ideas into elegant, 
                    scalable solutions with clean code and modern technologies. Let's build something amazing together!
                </p>
            </div>

            <!-- CTA Buttons -->
            <div class="buttons-container opacity-0 flex flex-wrap gap-4">
                <a href="#project" class="hero-btn hero-btn-primary group flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/50">
                    <i data-lucide="folder" class="w-5 h-5 group-hover:scale-110 transition-transform"></i>
                    <span>View Projects</span>
                </a>

                <a href="/v1/documents/LeowKaiWen-Resume.pdf" target="_blank" class="hero-btn hero-btn-secondary group flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300">
                    <i data-lucide="download" class="w-5 h-5 group-hover:scale-110 transition-transform"></i>
                    <span>Download Resume</span>
                </a>

                <a href="#contact" class="hero-btn hero-btn-outline group flex items-center gap-2 border-2 border-stone-300 hover:border-primary hover:bg-primary text-stone-200 hover:text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300">
                    <i data-lucide="mail" class="w-5 h-5 group-hover:scale-110 transition-transform"></i>
                    <span>Contact Me</span>
                </a>
            </div>

        </div>
     </div> 
</section>`,L=`<section class="about-section bg-white py-20" id="about">
  <div class="container">
    <!-- Section Header -->
    <div class="text-center mb-16 fade-in">
      <h2 class="section-title text-4xl md:text-5xl font-bold text-stone-800 mb-4">
        About Me
      </h2>
      <div class="title-underline mx-auto w-20 h-1 bg-linear-to-r from-primary to-secondary rounded-full"></div>
    </div>

    <!-- Introduction Part: Content Left, Image Right -->
    <div class="intro-container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
      <!-- Content Left -->
      <div class="intro-content fade-in-left">
        <h3 class="text-2xl md:text-3xl font-bold text-stone-800 mb-6">
          Hi, I'm <span class="text-primary">Leow Kai Wen</span>
        </h3>
        <p class="text-base md:text-lg text-stone-600 leading-relaxed mb-6">
          I'm a passionate software engineering graduate eager to create innovative solutions. 
          With a strong foundation in full-stack development and a drive to continuously learn, 
          I'm ready to contribute to exciting projects and grow as a developer.
        </p>
        <p class="text-base md:text-lg text-stone-600 leading-relaxed">
          When I'm not coding, you'll find me watching movies, playing badminton or futsal, 
          and exploring new places around the world. I believe the best ideas come when you 
          step away from the screen and experience life!
        </p>
      </div>

      <!-- Image Right -->
      <div class="intro-image fade-in-right flex justify-center lg:justify-end">
        <div class="relative">
          <div class="absolute inset-0 bg-linear-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl"></div>
            <img src="/v1/images/LeowKaiWen.JPG" 
                alt="Leow Kai Wen Avatar" 
                class="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-8 border-white shadow-2xl object-cover hover:scale-105 transition-transform duration-500">
          </div>
      </div>
    </div>

    <!-- Key Highlights Part: Image Left, Content Right -->
    <div class="highlights-container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
      <!-- Image Left -->
      <div class="highlights-image fade-in-left flex justify-center lg:justify-start order-2 lg:order-1">
        <div class="relative">
          <div class="absolute inset-0 bg-linear-to-tr from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
          <img src="https://illustrations.popsy.co/amber/remote-work.svg" 
               alt="Developer Illustration" 
               class="relative w-72 h-72 md:w-96 md:h-96 object-contain hover:scale-105 transition-transform duration-500">
        </div>
      </div>

      <!-- Content Right -->
      <div class="highlights-content order-1 lg:order-2 fade-in-right">
        <h3 class="text-2xl md:text-3xl font-bold text-stone-800 mb-8">
          What Defines Me
        </h3>

        <!-- Highlight Cards -->
        <div class="space-y-6">
          <!-- Card 1: Fresh Graduate -->
          <div class="highlight-card group bg-stone-50 hover:bg-white border-l-4 border-primary p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
            <div class="flex items-start gap-4">
              <div class="icon-wrapper shrink-0 w-12 h-12 bg-linear-to-br from-primary to-primary-light rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <i data-lucide="graduation-cap" class="w-6 h-6"></i>
              </div>
              <div>
                <h4 class="text-xl font-bold text-stone-800 mb-2">Fresh Graduate</h4>
                <p class="text-stone-600">
                  Recently completed my Software Engineering degree with a passion for learning and applying modern technologies.
                </p>
              </div>
            </div>
          </div>

          <!-- Card 2: Team Player -->
          <div class="highlight-card group bg-stone-50 hover:bg-white border-l-4 border-secondary p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
            <div class="flex items-start gap-4">
              <div class="icon-wrapper shrink-0 w-12 h-12 bg-linear-to-br from-secondary to-primary rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <i data-lucide="users" class="w-6 h-6"></i>
              </div>
              <div>
                <h4 class="text-xl font-bold text-stone-800 mb-2">Team Player</h4>
                <p class="text-stone-600">
                  Collaborative and communicative, I thrive in team environments and believe great software is built together.
                </p>
              </div>
            </div>
          </div>

          <!-- Card 3: Hands-On -->
          <div class="highlight-card group bg-stone-50 hover:bg-white border-l-4 border-accent p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
            <div class="flex items-start gap-4">
              <div class="icon-wrapper shrink-0 w-12 h-12 bg-linear-to-br from-accent to-[#14b8a6] rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <i data-lucide="hammer" class="w-6 h-6"></i>
              </div>
              <div>
                <h4 class="text-xl font-bold text-stone-800 mb-2">Hands-On Learner</h4>
                <p class="text-stone-600">
                  I learn best by building. Every project is an opportunity to experiment, fail fast, and improve continuously.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`,I=`<section class="skills-section bg-stone-50 py-20">
  <div class="container">
    <!-- Section Header -->
    <div class="text-center mb-16 fade-in">
      <h2 class="section-title text-4xl md:text-5xl font-bold text-stone-800 mb-4">
        Skills & Technologies
      </h2>
      <div class="title-underline mx-auto w-20 h-1 bg-linear-to-r from-primary to-secondary rounded-full"></div>
      <p class="text-lg text-stone-600 mt-6 max-w-2xl mx-auto">
        Here are the technologies and tools I work with to bring ideas to life
      </p>
    </div>

    <!-- Skills Grid -->
    <div class="skills-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      
      <!-- Card 1: Programming Languages -->
      <div class="skill-card bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-primary fade-in-up">
        <div class="card-header mb-6">
          <div class="icon-wrapper w-16 h-16 bg-linear-to-br from-primary to-primary-light rounded-xl flex items-center justify-center mb-4 shadow-lg">
            <i data-lucide="code-2" class="w-8 h-8 text-white"></i>
          </div>
          <h3 class="text-2xl font-bold text-stone-800">Programming Languages</h3>
        </div>
        
        <div class="tech-list space-y-3">
          <div class="tech-item flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors">
            <div class="tech-icon w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <i data-lucide="coffee" class="w-5 h-5 text-primary"></i>
            </div>
            <span class="text-stone-700 font-medium">Java</span>
          </div>
          
          <div class="tech-item flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors">
            <div class="tech-icon w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i data-lucide="braces" class="w-5 h-5 text-secondary"></i>
            </div>
            <span class="text-stone-700 font-medium">JavaScript</span>
          </div>
          
          <div class="tech-item flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors">
            <div class="tech-icon w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i data-lucide="code" class="w-5 h-5 text-blue-600"></i>
            </div>
            <span class="text-stone-700 font-medium">Python</span>
          </div>
          
          <div class="tech-item flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors">
            <div class="tech-icon w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <i data-lucide="file-code" class="w-5 h-5 text-slate-600"></i>
            </div>
            <span class="text-stone-700 font-medium">C / C++</span>
          </div>
          
          <div class="tech-item flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors">
            <div class="tech-icon w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <i data-lucide="terminal" class="w-5 h-5 text-purple-600"></i>
            </div>
            <span class="text-stone-700 font-medium">PHP</span>
          </div>
        </div>
      </div>

      <!-- Card 2: Frontend Development -->
      <div class="skill-card bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-secondary fade-in-up">
        <div class="card-header mb-6">
          <div class="icon-wrapper w-16 h-16 bg-linear-to-br from-secondary to-primary rounded-xl flex items-center justify-center mb-4 shadow-lg">
            <i data-lucide="layout" class="w-8 h-8 text-white"></i>
          </div>
          <h3 class="text-2xl font-bold text-stone-800">Frontend Development</h3>
        </div>
        
        <div class="tech-list space-y-3">
          <div class="tech-item flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors">
            <div class="tech-icon w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <i data-lucide="file-text" class="w-5 h-5 text-orange-600"></i>
            </div>
            <span class="text-stone-700 font-medium">HTML5</span>
          </div>
          
          <div class="tech-item flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors">
            <div class="tech-icon w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i data-lucide="paintbrush" class="w-5 h-5 text-blue-600"></i>
            </div>
            <span class="text-stone-700 font-medium">CSS3</span>
          </div>
          
          <div class="tech-item flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors">
            <div class="tech-icon w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
              <i data-lucide="atom" class="w-5 h-5 text-cyan-600"></i>
            </div>
            <span class="text-stone-700 font-medium">React</span>
          </div>
        </div>
      </div>

      <!-- Card 3: Database -->
      <div class="skill-card bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-accent fade-in-up">
        <div class="card-header mb-6">
          <div class="icon-wrapper w-16 h-16 bg-linear-to-br from-accent to-[#14b8a6] rounded-xl flex items-center justify-center mb-4 shadow-lg">
            <i data-lucide="database" class="w-8 h-8 text-white"></i>
          </div>
          <h3 class="text-2xl font-bold text-stone-800">Database</h3>
        </div>
        
        <div class="tech-list space-y-3">
          <div class="tech-item flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors">
            <div class="tech-icon w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <i data-lucide="hard-drive" class="w-5 h-5 text-teal-600"></i>
            </div>
            <span class="text-stone-700 font-medium">MySQL</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Optional: Tools & Platforms Section (you can customize this later) -->
    <div class="tools-section mt-16 fade-in-up">
      <div class="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-primary">
        <div class="flex items-center gap-4 mb-6">
          <div class="icon-wrapper w-14 h-14 bg-linear-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-lg">
            <i data-lucide="wrench" class="w-7 h-7 text-white"></i>
          </div>
          <h3 class="text-2xl font-bold text-stone-800">Tools & Platforms</h3>
        </div>
        
        <div class="flex flex-wrap gap-3">
          <span class="tool-tag px-4 py-2 bg-stone-100 hover:bg-primary hover:text-white text-stone-700 rounded-full font-medium transition-all duration-300 cursor-default">
            <i data-lucide="git-branch" class="w-4 h-4 inline mr-1"></i>
            Git
          </span>
          <span class="tool-tag px-4 py-2 bg-stone-100 hover:bg-primary hover:text-white text-stone-700 rounded-full font-medium transition-all duration-300 cursor-default">
            <i data-lucide="github" class="w-4 h-4 inline mr-1"></i>
            GitHub
          </span>
          <span class="tool-tag px-4 py-2 bg-stone-100 hover:bg-primary hover:text-white text-stone-700 rounded-full font-medium transition-all duration-300 cursor-default">
            <i data-lucide="code-2" class="w-4 h-4 inline mr-1"></i>
            VS Code
          </span>
          <span class="tool-tag px-4 py-2 bg-stone-100 hover:bg-primary hover:text-white text-stone-700 rounded-full font-medium transition-all duration-300 cursor-default">
            <i data-lucide="box" class="w-4 h-4 inline mr-1"></i>
            npm
          </span>
          <span class="tool-tag px-4 py-2 bg-stone-100 hover:bg-primary hover:text-white text-stone-700 rounded-full font-medium transition-all duration-300 cursor-default">
            <i data-lucide="puzzle" class="w-4 h-4 inline mr-1"></i>
            Vite
          </span>
        </div>
      </div>
    </div>

  </div>
</section>`,C=`<section class="projects-section bg-white py-20" id="project">
  <div class="container">
    <!-- Section Header -->
    <div class="text-center mb-16 fade-in">
      <h2 class="section-title text-4xl md:text-5xl font-bold text-stone-800 mb-4">
        Featured Projects
      </h2>
      <div class="title-underline mx-auto w-20 h-1 bg-linear-to-r from-primary to-secondary rounded-full"></div>
      <p class="text-lg text-stone-600 mt-6 max-w-2xl mx-auto">
        Here are some of my recent projects that showcase my skills and passion for development
      </p>
    </div>

    <!-- Projects Container -->
    <div class="projects-container space-y-20">
      
      <!-- Project 1: Mini Dashboard App -->
      <div class="project-card fade-in-up">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          <!-- Project Image - Left -->
          <div class="project-image-container order-2 lg:order-1">
            <div class="relative group">
              <!-- Main Image Display with fixed height -->
              <div class="main-image-wrapper relative rounded-2xl overflow-hidden shadow-2xl h-80 md:h-96 cursor-pointer" data-project="1">
                <img id="project1-main-image" 
                     src="/v1/images/projects/mini-dashboard/LightTheme.jpeg" 
                     alt="Mini Dashboard App Screenshot" 
                     class="w-full h-full object-cover object-top">
                <!-- Overlay on hover -->
                <div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div class="p-6 w-full">
                    <div class="flex items-center justify-between text-white">
                      <p class="text-sm font-medium">Click thumbnail to see different image</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Thumbnail Gallery -->
              <div class="thumbnails-gallery mt-4 flex gap-2 overflow-x-auto pb-2">
                <button class="thumbnail-btn active" data-project="1" data-index="0">
                  <img src="/v1/images/projects/mini-dashboard/LightTheme.jpeg" 
                       alt="Screenshot 1" 
                       class="w-20 h-14 object-cover rounded-lg border-2 border-primary">
                </button>
                <button class="thumbnail-btn" data-project="1" data-index="1">
                  <img src="/v1/images/projects/mini-dashboard/DarkTheme.jpeg" 
                       alt="Screenshot 2" 
                       class="w-20 h-14 object-cover rounded-lg border-2 border-transparent hover:border-primary transition-all">
                </button>
                <button class="thumbnail-btn" data-project="1" data-index="2">
                  <img src="/v1/images/projects/mini-dashboard/Notes.jpeg" 
                       alt="Screenshot 3" 
                       class="w-20 h-14 object-cover rounded-lg border-2 border-transparent hover:border-primary transition-all">
                </button>
                <button class="thumbnail-btn" data-project="1" data-index="3">
                  <img src="/v1/images/projects/mini-dashboard/Setting.jpeg" 
                       alt="Screenshot 4" 
                       class="w-20 h-14 object-cover rounded-lg border-2 border-transparent hover:border-primary transition-all">
                </button>
                <button class="thumbnail-btn" data-project="1" data-index="4">
                  <img src="/v1/images/projects/mini-dashboard/Tasks.jpeg" 
                       alt="Screenshot 5" 
                       class="w-20 h-14 object-cover rounded-lg border-2 border-transparent hover:border-primary transition-all">
                </button>
              </div>
            </div>
          </div>

          <!-- Project Details - Right -->
          <div class="project-details order-1 lg:order-2">
            <!-- Project Number Badge -->
            <div class="project-number inline-block px-4 py-1 bg-primary/10 text-primary font-bold rounded-full text-sm mb-4">
              PROJECT 01
            </div>
            
            <!-- Project Title -->
            <h3 class="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
              Mini Dashboard App
            </h3>
            
            <!-- Project Description -->
            <p class="text-base md:text-lg text-stone-600 leading-relaxed mb-6">
              A modern, feature-rich personal dashboard application built with Next.js, TypeScript, and TailwindCSS. 
              Manage your tasks, take notes, and customize your experience with a beautiful dark mode theme.
            </p>

            <!-- Tech Stack -->
            <div class="tech-stack mb-6">
              <h4 class="text-sm font-bold text-stone-800 mb-3 uppercase tracking-wider">Tech Stack</h4>
              <div class="flex flex-wrap gap-2">
                <span class="tech-badge px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium border border-stone-200">
                  Next.js
                </span>
                <span class="tech-badge px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium border border-stone-200">
                  React
                </span>
                <span class="tech-badge px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium border border-stone-200">
                  TypeScript
                </span>
                <span class="tech-badge px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium border border-stone-200">
                  TailwindCSS
                </span>
                <span class="tech-badge px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium border border-stone-200">
                  shadcn/ui
                </span>
                <span class="tech-badge px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium border border-stone-200">
                  Zustand
                </span>
                <span class="tech-badge px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium border border-stone-200">
                  localStorage
                </span>
              </div>
            </div>

            <!-- Challenges Overcome -->
            <div class="challenges mb-6">
              <h4 class="text-sm font-bold text-stone-800 mb-3 uppercase tracking-wider flex items-center gap-2">
                <i data-lucide="zap" class="w-4 h-4 text-primary"></i>
                Challenges Overcome
              </h4>
              <ul class="space-y-2">
                <li class="flex items-start gap-2 text-stone-600">
                  <i data-lucide="check-circle" class="w-5 h-5 text-primary shrink-0 mt-0.5"></i>
                  <span>Configured light/dark mode theme switching with proper persistence</span>
                </li>
                <li class="flex items-start gap-2 text-stone-600">
                  <i data-lucide="check-circle" class="w-5 h-5 text-primary shrink-0 mt-0.5"></i>
                  <span>Implemented localStorage API for client-side data persistence</span>
                </li>
              </ul>
            </div>

            <!-- Action Buttons -->
            <div class="project-actions flex flex-wrap gap-3">
              <a href="https://github.com/the-KW22/MiniDashboard" 
                 target="_blank"
                 class="project-btn primary-btn group flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                <i data-lucide="github" class="w-5 h-5 group-hover:scale-110 transition-transform"></i>
                <span>View on GitHub</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      <!-- Project 2: Watch Tracker -->
      <div class="project-card fade-in-up">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          <!-- Project Details - Left (reversed order) -->
          <div class="project-details order-1">
            <!-- Project Number Badge -->
            <div class="project-number inline-block px-4 py-1 bg-primary/10 text-primary font-bold rounded-full text-sm mb-4">
              PROJECT 02
            </div>
            
            <!-- Project Title -->
            <h3 class="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
              Watch Tracker
            </h3>
            
            <!-- Project Description -->
            <p class="text-base md:text-lg text-stone-600 leading-relaxed mb-6">
              Watch Tracker is a modern web application that helps to track your watching progress for movies, TV shows, 
              and anime. Never forget where you stopped watching again!
            </p>

            <!-- Tech Stack -->
            <div class="tech-stack mb-6">
              <h4 class="text-sm font-bold text-stone-800 mb-3 uppercase tracking-wider">Tech Stack</h4>
              <div class="flex flex-wrap gap-2">
                <span class="tech-badge px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium border border-stone-200">
                  React
                </span>
                <span class="tech-badge px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium border border-stone-200">
                  TypeScript
                </span>
                <span class="tech-badge px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium border border-stone-200">
                  Vite
                </span>
                <span class="tech-badge px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium border border-stone-200">
                  TailwindCSS
                </span>
                <span class="tech-badge px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium border border-stone-200">
                  shadcn/ui
                </span>
                <span class="tech-badge px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium border border-stone-200">
                  Zustand
                </span>
                <span class="tech-badge px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium border border-stone-200">
                  Supabase
                </span>
                <span class="tech-badge px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium border border-stone-200">
                  TMDB API
                </span>
                <span class="tech-badge px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium border border-stone-200">
                  Vercel
                </span>
              </div>
            </div>

            <!-- Challenges Overcome -->
            <div class="challenges mb-6">
              <h4 class="text-sm font-bold text-stone-800 mb-3 uppercase tracking-wider flex items-center gap-2">
                <i data-lucide="zap" class="w-4 h-4 text-primary"></i>
                Challenges Overcome
              </h4>
              <ul class="space-y-2">
                <li class="flex items-start gap-2 text-stone-600">
                  <i data-lucide="check-circle" class="w-5 h-5 text-primary shrink-0 mt-0.5"></i>
                  <span>Integrated Supabase for database management and user authentication</span>
                </li>
                <li class="flex items-start gap-2 text-stone-600">
                  <i data-lucide="check-circle" class="w-5 h-5 text-primary shrink-0 mt-0.5"></i>
                  <span>Successfully consumed TMDB API for fetching movie and TV show data</span>
                </li>
              </ul>
            </div>

            <!-- Action Buttons -->
            <div class="project-actions flex flex-wrap gap-3">
              <a href="https://github.com/the-KW22/WatchTracker" 
                 target="_blank"
                 class="project-btn primary-btn group flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                <i data-lucide="github" class="w-5 h-5 group-hover:scale-110 transition-transform"></i>
                <span>View on GitHub</span>
              </a>
            </div>
          </div>

          <!-- Project Image - Right (reversed order) -->
          <div class="project-image-container order-2">
            <div class="relative group">
              <!-- Main Image Display with fixed height -->
              <div class="main-image-wrapper relative rounded-2xl overflow-hidden shadow-2xl h-80 md:h-96 cursor-pointer" data-project="2">
                <img id="project2-main-image" 
                     src="/v1/images/projects/watch-tracker/Home.jpeg" 
                     alt="Watch Tracker Screenshot" 
                     class="w-full h-full object-cover object-top">
                <!-- Overlay on hover -->
                <div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div class="p-6 w-full">
                    <div class="flex items-center justify-between text-white">
                      <p class="text-sm font-medium">Click thumbnail to see different image</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Thumbnail Gallery -->
              <div class="thumbnails-gallery mt-4 flex gap-2 overflow-x-auto pb-2">
                <button class="thumbnail-btn active" data-project="2" data-index="0">
                  <img src="/v1/images/projects/watch-tracker/Home.jpeg" 
                       alt="Screenshot 1" 
                       class="w-20 h-14 object-cover rounded-lg border-2 border-primary">
                </button>
                <button class="thumbnail-btn" data-project="2" data-index="1">
                  <img src="/v1/images/projects/watch-tracker/MovieDetail.jpeg" 
                       alt="Screenshot 2" 
                       class="w-20 h-14 object-cover rounded-lg border-2 border-transparent hover:border-primary transition-all">
                </button>
                <button class="thumbnail-btn" data-project="2" data-index="2">
                  <img src="/v1/images/projects/watch-tracker/Profile.jpeg" 
                       alt="Screenshot 3" 
                       class="w-20 h-14 object-cover rounded-lg border-2 border-transparent hover:border-primary transition-all">
                </button>
                <button class="thumbnail-btn" data-project="2" data-index="3">
                  <img src="/v1/images/projects/watch-tracker/Search.jpeg" 
                       alt="Screenshot 4" 
                       class="w-20 h-14 object-cover rounded-lg border-2 border-transparent hover:border-primary transition-all">
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>

  </div>

</section>`,E=`<section class="contact-section bg-stone-50 py-20" id="contact">
    <div class="container">
        <!-- Section Header -->
        <div class="text-center mb-16 fade-in">
            <h2 class="section-title text-4xl md:text-5xl font-bold text-stone-800 mb-4">
                Contact Me
            </h2>
            <div class="title-underline mx-auto w-20 h-1 bg-linear-to-r from-primary to-secondary rounded-full"></div>

            <!-- Illustration -->
            <div class="illustration-wrapper mb-8 flex justify-center">
                <div class="absolute inset-0 bg-linear-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl"></div>
                <img src="https://illustrations.popsy.co/amber/telephone-call.svg" alt="Contact Illustration" class="relative w-64 h-64 md:w-80 md:h-80 object-contain">
            </div>
        </div>

        <!-- Contact Content -->
         <div class="contact-content grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <!-- Left Side Contact Form -->
            <div class="contact-form-container fade-in-left">
                <div class="bg-white rounded-2xl p-8 shadow=2xl border-t-4 border-primary">
                    <h3 class="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                        <i data-lucide="send" class="w-6 h-6 text-primary"></i>
                        Send Me a Message
                    </h3>

                    <form id="contact-form" class="space-y-5">
                        <!-- Name Field -->
                        <div class="form-group">
                            <label for="name" class="block text-sm font-semibold text-stone-700 mb-2">
                                Your Name <span class="text-primary">*</span>
                            </label>
                        

                            <div class="relative">
                                <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400">
                                    <i data-lucide="user" class="w-5 h-5"></i>
                                </div>

                                <input 
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    placeholder="John Doe"
                                    class="w-full pl-11 pr-4 py-3 border-2 border-stone-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                                >
                            </div>
                        </div>

                        <!-- Email Field -->
                        <div class="form-group">
                            <label for="email" class="block text-sm font-semibold text-stone-700 mb-2">
                                Your Email <span class="text-primary">*</span>
                            </label>

                            <div class="relative">
                                <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400">
                                    <i data-lucide="mail" class="w-5 h-5"></i>
                                </div>

                                <input 
                                    type="text"
                                    id="email"
                                    name="email"
                                    required
                                    placeholder="john@example.com"
                                    class="w-full pl-11 pr-4 py-3 border-2 border-stone-200 rounded-lg focus:border-primary focus:outline-none transition-colors"   
                                >
                            </div>
                        </div>

                        <!-- Subject Field -->
                        <div class="form-group">
                            <label for="subject" class="block text-sm font-semibold text-stone-700 mb-2">
                                Subject <span class="text-primary">*</span>
                            </label>

                            <div class="relative">
                                <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400">
                                    <i data-lucide="tag" class="w-5 h-5"></i>
                                </div>

                                <input 
                                    type="text" 
                                    id="subject" 
                                    name="subject"
                                    required
                                    placeholder="Example Subject"
                                    class="w-full pl-11 pr-4 py-3 border-2 border-stone-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                                >
                            </div>
                        </div>

                        <!-- Message Field -->
                        <div class="form-group">
                            <label for="message" class="block text-sm font-semibold text-stone-700 mb-2">
                                Message <span class="text-primary">*</span>
                            </label>

                            <div class="relative">
                                <div class="absolute left-3 top-3 text-stone-400">
                                    <i data-lucide="message-square" class="w-5 h-5"></i>
                                </div>

                                <textarea 
                                    id="message" 
                                    name="message"
                                    required
                                    rows="5"
                                    placeholder="Tell me about your project or idea..."
                                    class="w-full pl-11 pr-4 py-3 border-2 border-stone-200 rounded-lg focus:border-primary focus:outline-none transition-colors resize-none"
                                ></textarea>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <button type="submit" class="submit-btn w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group">
                            <i data-lucide="send" class="w-5 h-5 group-hover:translate-x-1 transition-transform"></i>
                            <span>Send Message</span>
                        </button>
                    </form>
                </div>
            </div>

            <!-- Right Side Contact Info & Illustration -->
             <div class="contact-info-container fade-in-right">
                

                <!-- Contact Information Card -->
                <div class="space-y-4">
                    <!-- Email Card -->
                    <div class="info-card group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-primary">
                        <div class="flex items-start gap-4">
                            <div class="icon-wrapper shrink-0 w-12 h-12 bg-linear-to-br from-primary to-primary-light rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <i data-lucide="mail" class="w-6 h-6 text-white"></i>
                            </div>

                            <div>
                                <h4 class="text-sm font-bold text-stone-800 mb-1 uppercase tracking-wider">
                                    Email
                                </h4>

                                <a href="mailto:kwenleow@gmail.com" class="text-stone-600 hover:text-primary transition-colors break-all">
                                    kwenleow@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Phone Card -->
                    <div class="info-card group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-secondary">
                        <div class="flex items-start gap-4">
                            <div class="icon-wrapper hrink-0 w-12 h-12 bg-linear-to-br from-secondary to-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <i data-lucide="phone" class="w-6 h-6 text-white"></i>
                            </div>

                            <div>
                                <h4 class="text-sm font-bold text-stone-800 mb-1 uppercase tracking-wider">
                                    Phone
                                </h4>

                                <a href="tel:+60176782206" class="text-stone-600 hover:text-primary transition-colors">
                                    +60 17-678 2206
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Location Card -->
                    <div class="info-card group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-accent">
                        <div class="flex items-start gap-4">
                            <div class="icon-wrapper shrink-0 w-12 h-12 bg-linear-to-br from-accent to-[#14b8a6] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <i data-lucide="map-pin" class="w-6 h-6 text-white"></i>
                            </div>

                            <div>
                                <h4 class="text-sm font-bold text-stone-800 mb-1 uppercase tracking-wider">
                                    Location
                                </h4>

                                <p class="text-stone-600">
                                    Setapak, Kuala Lumpur, Malaysia
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Availability Badge -->
                    <div class="availability-badge bg-linear-to-r from-primary to-primary-light rounded-xl p-6 text-white shadow-lg">
                        <div class="flex items-center gap-3">
                            <div class="hrink-0">
                                <div class="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                            </div>

                            <div>
                                <h4 class="font-bold text-sm uppercase tracking-wider mb-1">
                                    Current Status
                                </h4>

                                <p class="text-white/90 text-lg font-semibold">
                                    Open to Opportunities
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
         </div>
    </div>
</section>`;async function T(){const t=document.getElementById("header-container");t&&(t.innerHTML=j,g(),typeof window.lucide<"u"&&window.lucide.createIcons())}async function H(){const t=document.getElementById("footer-container");t&&(t.innerHTML=k,b(),typeof window.lucide<"u"&&window.lucide.createIcons())}async function P(){const t=document.getElementById("hero-container");t&&(t.innerHTML=S,f(),typeof window.lucide<"u"&&window.lucide.createIcons())}async function M(){const t=document.getElementById("about-container");t&&(t.innerHTML=L,v(),typeof window.lucide<"u"&&window.lucide.createIcons())}async function A(){const t=document.getElementById("skills-container");t&&(t.innerHTML=I,x(),typeof window.lucide<"u"&&window.lucide.createIcons())}async function B(){const t=document.getElementById("projects-container");t&&(t.innerHTML=C,w(),typeof window.lucide<"u"&&window.lucide.createIcons())}async function q(){const t=document.getElementById("contact-container");t&&(t.innerHTML=E,y(),typeof window.lucide<"u"&&window.lucide.createIcons())}document.addEventListener("DOMContentLoaded",async()=>{await T(),await H(),await P(),await M(),await A(),await B(),await q(),console.log("Website Loaded")});
