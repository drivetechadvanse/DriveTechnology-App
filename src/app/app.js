lucide.createIcons();
let currentStep = 1;
let registrationMode = 'driver'; 
let currentAdminView = 'requests'; 
let selectedIds = [];
let currentUser = null;
let isAvailable = false; // Estado del conductor
let appState = {
    selectedPayment: 'efectivo',
    precioViaje: 120.00
};
let tempBase64Photo = "";
let userTargetAdmin = null;

setTimeout(() => { 
    const splash = document.getElementById('splash');
    if(splash) splash.style.opacity = '0'; 
    setTimeout(() => { 
        if(splash) splash.style.display = 'none'; 
        document.getElementById('login-screen').classList.remove('hidden'); 
    }, 500); 
}, 1500);

function openMenu() {

        if(currentUser && currentUser.role === 'conductor') {
            openDriverSidebar();
            return;
        }

        document.getElementById('sidebar').classList.add('open');
        document.getElementById('overlay').classList.add('opacity-100', 'pointer-events-auto');
    }

function closeAll() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('cost-sheet').classList.remove('active'); document.getElementById('overlay').classList.remove('opacity-100', 'pointer-events-auto'); }

function toggleAccordion(id) { document.getElementById(id).classList.toggle('expanded'); }
