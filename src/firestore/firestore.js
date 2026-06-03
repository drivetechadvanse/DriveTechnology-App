/*
  Capa base de Firestore para Drive MX.

  Este archivo prepara funciones reutilizables para la siguiente etapa de migración.
  Por ahora NO reemplaza automáticamente localStorage ni elimina funciones existentes.
*/

(function () {
  const firebaseBase = window.DriveMXFirebase;

  if (!firebaseBase || !firebaseBase.db) {
    console.error("Firestore no está disponible. Revisa src/firebase/firebase.js y los scripts de Firebase.");
    return;
  }

  const db = firebaseBase.db;

  function cleanForFirestore(value) {
    if (Array.isArray(value)) {
      return value.map(cleanForFirestore);
    }

    if (value && typeof value === "object") {
      const cleaned = {};

      Object.keys(value).forEach((key) => {
        if (value[key] !== undefined) {
          cleaned[key] = cleanForFirestore(value[key]);
        }
      });

      return cleaned;
    }

    return value;
  }

  async function setDocument(collectionName, documentId, data) {
    if (!collectionName || !documentId) {
      throw new Error("setDocument requiere collectionName y documentId.");
    }

    const safeData = cleanForFirestore(data || {});
    await db.collection(collectionName).doc(String(documentId)).set(safeData, { merge: true });
    return safeData;
  }

  async function getDocument(collectionName, documentId, fallback = null) {
    if (!collectionName || !documentId) {
      throw new Error("getDocument requiere collectionName y documentId.");
    }

    const snap = await db.collection(collectionName).doc(String(documentId)).get();
    return snap.exists ? { id: snap.id, ...snap.data() } : fallback;
  }

  async function deleteDocument(collectionName, documentId) {
    if (!collectionName || !documentId) {
      throw new Error("deleteDocument requiere collectionName y documentId.");
    }

    await db.collection(collectionName).doc(String(documentId)).delete();
    return true;
  }

  async function getCollection(collectionName) {
    if (!collectionName) {
      throw new Error("getCollection requiere collectionName.");
    }

    const snapshot = await db.collection(collectionName).get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  async function addDocument(collectionName, data) {
    if (!collectionName) {
      throw new Error("addDocument requiere collectionName.");
    }

    const safeData = cleanForFirestore(data || {});
    const ref = await db.collection(collectionName).add(safeData);
    return { id: ref.id, ...safeData };
  }

  // Nombres específicos que usaremos en las siguientes partes de la migración.
  async function saveUser(user) {
    if (!user || !user.id) {
      throw new Error("saveUser requiere un usuario con id.");
    }

    return setDocument("usuarios", user.id, user);
  }

  async function getUser(userId) {
    return getDocument("usuarios", userId, null);
  }

  async function getUsers() {
    return getCollection("usuarios");
  }

  async function saveWallet(userId, wallet) {
    return setDocument("wallets", userId, wallet || { saldo: 0, historial: [], trips: 0 });
  }

  async function getWallet(userId) {
    return getDocument("wallets", userId, {
      id: String(userId),
      saldo: 0,
      historial: [],
      trips: 0
    });
  }

  window.DriveMXFirestore = {
    db,
    cleanForFirestore,
    setDocument,
    getDocument,
    deleteDocument,
    getCollection,
    addDocument,
    saveUser,
    getUser,
    getUsers,
    saveWallet,
    getWallet
  };
})();


