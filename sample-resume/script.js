// Advanced Liquid Interactivity Cursor
const cursor = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor-dot');

const isDesktop = window.matchMedia("(pointer: fine)").matches;

if(cursor && cursorDot && isDesktop) {
    // GSAP quickTo for 60fps physics tracking
    gsap.set(cursor, {xPercent: -50, yPercent: -50});
    gsap.set(cursorDot, {xPercent: -50, yPercent: -50});

    let xTo = gsap.quickTo(cursor, "x", {duration: 0.6, ease: "power3"});
    let yTo = gsap.quickTo(cursor, "y", {duration: 0.6, ease: "power3"});
    
    let xToDot = gsap.quickTo(cursorDot, "x", {duration: 0.1, ease: "power3"});
    let yToDot = gsap.quickTo(cursorDot, "y", {duration: 0.1, ease: "power3"});

    window.addEventListener("mousemove", e => {
        xTo(e.clientX);
        yTo(e.clientY);
        xToDot(e.clientX);
        yToDot(e.clientY);
    });

    // Magnetic expansion on interactive elements
    const interactables = document.querySelectorAll('a, button, input, textarea');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 2.2, backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'transparent', duration: 0.3 });
            gsap.to(cursorDot, { scale: 0, duration: 0.2 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.4)', duration: 0.3 });
            gsap.to(cursorDot, { scale: 1, duration: 0.2 });
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // Initial Sleek Entrance Animation
    const tl = gsap.timeline();
    tl.from('.navbar', { y: -20, opacity: 0, duration: 0.6, ease: 'power2.out' })
      .from('.hero-content > *', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, "-=0.3")
      .from('.hero-3d-wrapper', { opacity: 0, x: 50, rotateY: -30, duration: 1, ease: 'power2.out' }, "-=0.6");

    // Dynamic 3D Feedback Scroll Effects For Timeline
    const timelineItems = gsap.utils.toArray('.timeline-item');
    timelineItems.forEach((item) => {
        gsap.fromTo(item, 
            { opacity: 0, translateY: 100, translateZ: -100, rotateX: 10, skewY: 2 },
            {
                scrollTrigger: { trigger: item, start: "top 95%", end: "top 60%", scrub: 1 },
                opacity: 1, translateY: 0, translateZ: 0, rotateX: 0, skewY: 0, duration: 1, ease: 'power2.out'
            }
        );
    });

    // Intense 3D Projects Grid Stagger Scroll Effect
    const projectCards = gsap.utils.toArray('.project-card');
    projectCards.forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, scale: 0.8, rotateY: (i % 2 === 0 ? 15 : -15), translateY: 80, translateZ: 150 },
            {
                scrollTrigger: { trigger: card, start: "top 95%", end: "top 60%", scrub: 1.5 },
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
});
