document.addEventListener("DOMContentLoaded", () => {
    // Mobile Hamburger Menu Logic
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (menuBtn && navLinksContainer) {
        menuBtn.addEventListener('click', () => {
            navLinksContainer.classList.toggle('nav-active');
            const icon = menuBtn.querySelector('i');
            if (navLinksContainer.classList.contains('nav-active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });

        // Close menu immediately tracking link paths
        const mobileLinks = navLinksContainer.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 900) {
                    navLinksContainer.classList.remove('nav-active');
                    menuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
                }
            });
        });
    }

    gsap.registerPlugin(ScrollTrigger);

    // Initial Sleek Entrance Animation
    const tl = gsap.timeline();
    tl.from('.navbar', { y: -20, opacity: 0, duration: 0.6, ease: 'power2.out' })
      .from('.hero-content > *', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, "-=0.3")
      .from('.hero-3d-wrapper', { opacity: 0, x: 50, rotateY: -30, duration: 1, ease: 'power2.out' }, "-=0.6");

    // Clean Minimalist Scroll Effects For Timeline
    const timelineItems = gsap.utils.toArray('.timeline-item');
    timelineItems.forEach((item) => {
        gsap.fromTo(item, 
            { opacity: 0, y: 20 },
            {
                scrollTrigger: { trigger: item, start: "top 90%", toggleActions: "play none none reverse" },
                opacity: 1, y: 0, duration: 0.6, ease: 'power2.out'
            }
        );
    });

    // Clean Minimalist Projects Grid Scroll Effect
    const projectCards = gsap.utils.toArray('.project-card');
    projectCards.forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 30 },
            {
                scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play none none reverse" },
                opacity: 1, y: 0, duration: 0.6, ease: 'power2.out'
            }
        );
    });

    // Enhanced Matrix Dashboard Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const allProjects = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterLang = btn.getAttribute('data-filter');
                document.querySelector('#projects').scrollIntoView({ behavior: 'smooth', block: 'start' });

                allProjects.forEach(project => {
                    const projectLangs = (project.getAttribute('data-lang') || '').split(' ');
                    // Always show the massive stock logic card or filter logic
                    if (filterLang === 'all' || projectLangs.includes(filterLang) || project.classList.contains('highlight-card')) {
                        project.style.display = 'block';
                        gsap.to(project, { opacity: 1, scale: 1, rotateY: 0, duration: 0.4 });
                    } else {
                        gsap.to(project, { opacity: 0, scale: 0.8, duration: 0.4, onComplete: () => {
                            project.style.display = 'none';
                            ScrollTrigger.refresh();
                        }});
                    }
                });
            });
        });
    }

    // Animated Skill Dashboard Graphs
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    if (skillBars.length > 0) {
        skillBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            gsap.fromTo(bar, 
                { width: "0%" },
                {
                    scrollTrigger: {
                        trigger: bar,
                        start: "top 85%",
                    },
                    width: targetWidth,
                    duration: 1.5,
                    ease: "power3.out"
                }
            );
        });
    }

    // ScrollSpy Navbar Sync
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') && link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-40% 0px -60% 0px' });
    sections.forEach(sec => {
        if(sec.id) observer.observe(sec);
    });
});
