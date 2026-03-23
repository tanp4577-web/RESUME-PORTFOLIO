/* 
    Professional Portfolio Interactivity
    Engine: GSAP & Custom 3D Matrix Logic
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // 2. Navigation Logic
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const allNavLinks = document.querySelectorAll('.nav-link');

    // Scroll → shrink navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link based on scroll position
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        allNavLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active-link');
            }
        });
    });

    // Mobile burger toggle
    mobileMenuBtn?.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-open');
        mobileMenuBtn.classList.toggle('open');
    });

    // Close mobile menu when a link is clicked
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-open');
            mobileMenuBtn.classList.remove('open');
        });
    });

    // 3. Simple 3D Card Interaction
    const cards = document.querySelectorAll('.card3d');
    
    cards.forEach(card => {
        const content = card.querySelector('.card-content');
        if (!content) return;
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15; // Refined rotate
            const rotateY = (centerX - x) / 15;
            
            content.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            content.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        });
    });

    // 5. Skill Bar Progressive Load
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    skillBars.forEach(bar => {
        gsap.to(bar, {
            width: bar.getAttribute('data-width'),
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: {
                trigger: bar,
                start: "top 90%"
            }
        });
    });

    // 6. Project Matrix Filtering System
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const showAllBtn = document.getElementById('show-all-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update Active State
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            
            // Filter Animation Logic
            gsap.to(projectCards, {
                opacity: 0,
                scale: 0.8,
                duration: 0.3,
                onComplete: () => {
                    projectCards.forEach(card => {
                        const langs = card.getAttribute('data-lang');
                        if (filter === 'all' || langs.includes(filter)) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });

                    gsap.to(projectCards, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.4,
                        stagger: 0.1
                    });
                    
                    // Toggle Show All visibility
                    if (filter !== 'all') {
                        showAllBtn.style.display = 'flex';
                    } else {
                        showAllBtn.style.display = 'none';
                    }
                }
            });
        });
    });

    showAllBtn?.addEventListener('click', () => {
        document.querySelector('.filter-btn[data-filter="all"]').click();
    });

    // 7. Global Reveal Logic (Staggered)
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none none"
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "expo.out"
        });
    });
});
