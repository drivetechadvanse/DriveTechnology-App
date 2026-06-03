/*
  Configuración base de Firebase para Drive MX.

  IMPORTANTE:
  - Este archivo NO cambia todavía la lógica existente de la app.
  - Solo inicializa Firebase y deja Firestore disponible en window.
  - Se usa Firebase compat porque el proyecto actualmente carga scripts normales
    desde index.html, no módulos ES con type="module".
*/

(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyArxcpA3jVFonv-j0ZKUN6Y_2xnh17BxO8",
    authDomain: "drivemx-app-f78a7.firebaseapp.com",
    projectId: "drivemx-app-f78a7",
    storageBucket: "drivemx-app-f78a7.firebasestorage.app",
    messagingSenderId: "828579163831",
    appId: "1:828579163831:web:4ecbd760642bf466e12732",
    measurementId: "G-FCY36DZ8DM"
  };

  if (!window.firebase) {
    console.error("Firebase SDK no está cargado. Revisa los scripts de Firebase en index.html.");
    return;
  }

  const app = firebase.apps.length
    ? firebase.app()
    : firebase.initializeApp(firebaseConfig);

  const db = firebase.firestore();

  let analytics = null;
  try {
    if (firebase.analytics && firebaseConfig.measurementId) {
      analytics = firebase.analytics();
    }
  } catch (error) {
    console.warn("Firebase Analytics no se pudo inicializar. La app puede continuar sin Analytics.", error);
  }

  window.DriveMXFirebase = {
    app,
    db,
    analytics,
    firebaseConfig
  };
})();

