document.addEventListener('DOMContentLoaded', () => {
  
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
        unlockSite();
    }
});

//  الادوار لي كاين  
function chooseRole(role) {
  
    localStorage.setItem('userRole', role);
    unlockSite();

    const messages = {
        'doctor': 'Welcome, Doctor! You can now issue prescriptions.',
        'patient': 'Welcome! You can now check your medical history.',
        'salesperson': 'Welcome! Inventory management is now active.'
    };

    console.log(messages[role]);
}

function unlockSite() {
    const modal = document.getElementById('role-modal');
    const mainContent = document.getElementById('main-content');

    if (modal) modal.style.display = 'none';
    if (mainContent) {
        mainContent.classList.remove('blurred');
        mainContent.style.pointerEvents = 'auto'; 
    }
}