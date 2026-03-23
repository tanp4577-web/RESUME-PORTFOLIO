document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // Initial Sleek Entrance Animation
    const tl = gsap.timeline();
    tl.from('.navbar', { y: -20, opacity: 0, duration: 0.6, ease: 'power2.out' })
      .from('.hero-content > *', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, "-=0.3")
      .from('.hero-3d-wrapper', { opacity: 0, x: 50, rotateY: -30, duration: 1, ease: 'power2.out' }, "-=0.6");

    const isMobile = window.innerWidth <= 900;

    // Dynamic 3D Feedback Scroll Effects For Timeline
    const timelineItems = gsap.utils.toArray('.timeline-item');
    timelineItems.forEach((item) => {
        gsap.fromTo(item, 
            { opacity: 0, translateY: isMobile ? 40 : 100, translateZ: isMobile ? 0 : -100, rotateX: isMobile ? 0 : 10, skewY: isMobile ? 0 : 2 },
            {
                scrollTrigger: { trigger: item, start: "top 95%", end: "top 60%", scrub: isMobile ? 1 : 1.5 },
                opacity: 1, translateY: 0, translateZ: 0, rotateX: 0, skewY: 0, duration: 1, ease: 'power2.out'
            }
        );
    });

    // Intense 3D Projects Grid Stagger Scroll Effect
    const projectCards = gsap.utils.toArray('.project-card');
    projectCards.forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, scale: isMobile ? 0.95 : 0.8, rotateY: isMobile ? 0 : (i % 2 === 0 ? 15 : -15), translateY: isMobile ? 40 : 80, translateZ: isMobile ? 0 : 150 },
            {
                scrollTrigger: { trigger: card, start: "top 95%", end: "top 60%", scrub: isMobile ? 1 : 1.5 },
                opacity: 1, scale: 1, rotateY: 0, translateY: 0, translateZ: 0, duration: 1, ease: 'power3.out'
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

    // Premium 3D Tilt Interactivity (Apple-esque Glass Depth)
    if (!isMobile) {
        document.querySelectorAll('.card3d').forEach(card => {
            const content = card.querySelector('.glass-panel');
            if(!content) return;
            
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const rotateX = (((e.clientY - rect.top) - (rect.height / 2)) / (rect.height / 2)) * -4;
                const rotateY = (((e.clientX - rect.left) - (rect.width / 2)) / (rect.width / 2)) * 4;
                gsap.to(content, { rotateX, rotateY, duration: 0.4, ease: "power2.out", transformPerspective: 1000 });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(content, { rotateX: 0, rotateY: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
            });
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
