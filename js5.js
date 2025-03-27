// Footer Functionality
// Email Redirect
const emailLink = document.getElementById('emailLink');
emailLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'mailto:mrd.club786@gmail.com';
});

// Automatic Copyright Year
const copyrightYear = document.getElementById('copyrightYear');
copyrightYear.textContent = new Date().getFullYear();

// Site Visit Counter
const visitCounter = document.getElementById('visitCounter');
let visitCount = localStorage.getItem('visitCount') || 0;
visitCount = parseInt(visitCount) + 1;
localStorage.setItem('visitCount', visitCount);
visitCounter.textContent = visitCount;