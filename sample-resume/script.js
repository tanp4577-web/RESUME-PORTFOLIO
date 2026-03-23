// Advanced Liquid Interactivity Cursor
const cursor = document.querySelector('.cursor');
let isTouchDevice = false;
window.addEventListener('touchstart', () => { isTouchDevice = true; }, { passive: true });

// Premium GSAP Velocity & Blend-Mode Cursor
if (cursor) {
    let hasMoved = false;
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let vel = { x: 0, y: 0 };
    
    // Initial State
    gsap.set(cursor, { xPercent: -50, yPercent: -50, scaleX: 0.6, scaleY: 0.6 });
    
    // Heavy duty direct CSS manipulators
    const xSet = gsap.quickSetter(cursor, "x", "px");
    const ySet = gsap.quickSetter(cursor, "y", "px");
    const rSet = gsap.quickSetter(cursor, "rotation", "deg");
    const sxSet = gsap.quickSetter(cursor, "scaleX");
    const sySet = gsap.quickSetter(cursor, "scaleY");
    
    window.addEventListener("mousemove", e => {
        if (isTouchDevice) return;
        if (!hasMoved) {
            hasMoved = true;
            cursor.style.display = 'block';
            gsap.to(cursor, { opacity: 1, duration: 0.4 });
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            pos.x = mouse.x;
            pos.y = mouse.y;
        }
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // High performance render loop calculating speed vectors
    gsap.ticker.add(() => {
        if (!hasMoved || isTouchDevice) return;
        
        // Spring easing for position lagging behind mouse coordinates
        const dt = 1.0 - Math.pow(1.0 - 0.25, gsap.ticker.deltaRatio()); 
        
        pos.x += (mouse.x - pos.x) * dt;
        pos.y += (mouse.y - pos.y) * dt;
        
        // Velocity differential
        vel.x = mouse.x - pos.x;
        vel.y = mouse.y - pos.y;
        
        // Synthesizing squishy stretch deformation based on raw speed
        const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
        const stretch = 1 + speed * 0.05; 
        const squeeze = 1 / stretch; // maintain volume
        
        // Direction vector angle
        const angle = Math.atan2(vel.y, vel.x) * (180 / Math.PI);
        
        xSet(pos.x);
        ySet(pos.y);
        rSet(angle);
        
        // Interupt squishy animations if hovering over elements
        if (!cursor.classList.contains('is-hovering')) {
            sxSet(stretch * 0.6); // Base size 0.6
            sySet(squeeze * 0.6);
        }
    });

    // Massive Awwwards style overlay expansion
    const interactables = document.querySelectorAll('a, button, input, textarea, .filter-btn');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (isTouchDevice) return;
            cursor.classList.add('is-hovering');
            gsap.to(cursor, { scaleX: 2.8, scaleY: 2.8, duration: 0.4, overwrite: "auto", ease: "back.out(1.5)" });
        });
        el.addEventListener('mouseleave', () => {
            if (isTouchDevice) return;
            cursor.classList.remove('is-hovering');
            gsap.to(cursor, { scaleX: 0.6, scaleY: 0.6, duration: 0.3, overwrite: "auto" });
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
