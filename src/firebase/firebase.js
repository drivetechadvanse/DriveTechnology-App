const firebaseConfig = {
    apiKey: "AIzaSyArxcpA3jVFonv-j0ZKUN6Y_2xnh17BxO8",
    authDomain: "drivemx-app-f78a7.firebaseapp.com",
    projectId: "drivemx-app-f78a7",
    storageBucket: "drivemx-app-f78a7.firebasestorage.app",
    messagingSenderId: "828579163831",
    appId: "1:828579163831:web:4ecbd760642bf466e12732",
    measurementId: "G-FCY36DZ8DM"
};

function loadFirebaseScript(src) {
    return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
            existing.addEventListener('load', resolve);
            existing.addEventListener('error', reject);
            if (existing.dataset.loaded === 'true') resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            script.dataset.loaded = 'true';
            resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

window.firebaseReadyPromise = (async function initFirebaseApp() {
    await loadFirebaseScript('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js');
    await loadFirebaseScript('https://www.gstatic.com/firebasejs/10.12.5/firebase-auth-compat.js');
    await loadFirebaseScript('https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore-compat.js');
    await loadFirebaseScript('https://www.gstatic.com/firebasejs/10.12.5/firebase-storage-compat.js');

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    window.firebaseAuth = firebase.auth();
    window.firebaseDb = firebase.firestore();
    window.firebaseStorage = firebase.storage();

    return {
        app: firebase.app(),
        auth: window.firebaseAuth,
        db: window.firebaseDb,
        storage: window.firebaseStorage
    };
})();

async function getFirebaseServices() {
    return await window.firebaseReadyPromise;
}
