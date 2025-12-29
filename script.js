document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const revealOnScroll = () => {
    const reveals = document.querySelectorAll('.feature-card, .download-card');
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].style.opacity = '1';
            reveals[i].style.transform = 'translateY(0)';
        }
    }
};

window.addEventListener('scroll', revealOnScroll);

document.addEventListener('DOMContentLoaded', () => {
    const reveals = document.querySelectorAll('.feature-card, .download-card');
    reveals.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
    });
    revealOnScroll();
});
