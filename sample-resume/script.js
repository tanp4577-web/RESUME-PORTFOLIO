/* 
    Professional Portfolio Interactivity
    Engine: GSAP & Custom 3D Matrix Logic
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // 2. Navigation Logic
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    mobileMenuBtn?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // 3. 3D Tilt Morphing Logic (The "Professional Edge")
    const cards = document.querySelectorAll('.card3d');
    
    cards.forEach(card => {
        const content = card.querySelector('.card-content');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            content.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            content.style.transform = `rotateX(0deg) rotateY(0deg)`;
        });
    });

    // 4. Hero Dashboard Interactive Matrix
    const dashPanel = document.querySelector('.dashboard-panel');
    if (dashPanel) {
        document.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
            dashPanel.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    }

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
    const reveals = document.querySelectorAll('.section-title, .project-card, .education-block, .contact-info, .feedback-form');
    
    reveals.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });
});

