async function crearUsuarioFirestore(uid, data) {
    const { db } = await getFirebaseServices();
    await db.collection('usuarios').doc(uid).set({
        uid: uid,
        nombre: data.nombre || data.name || '',
        correo: data.correo || data.email || '',
        telefono: data.telefono || data.phone || '',
        foto: data.foto || '',
        rolePassenger: true,
        roleDriver: data.roleDriver === true,
        driverStatus: data.driverStatus || 'no_registrado',
        createdAt: data.createdAt || firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
}

async function obtenerUsuarioFirestore(uid) {
    const { db } = await getFirebaseServices();
    const snap = await db.collection('usuarios').doc(uid).get();
    return snap.exists ? snap.data() : null;
}

async function actualizarUsuarioFirestore(uid, data) {
    const { db } = await getFirebaseServices();
    await db.collection('usuarios').doc(uid).set(data, { merge: true });
}

async function crearConductorFirestore(uid, data) {
    const { db } = await getFirebaseServices();
    await db.collection('conductores').doc(uid).set({
        uid: uid,
        vehiculo: data.vehiculo || {},
        placas: data.placas || '',
        licencia: data.licencia || '',
        documentos: data.documentos || {},
        estado: data.estado || 'activo'
    }, { merge: true });
}

async function obtenerConductorFirestore(uid) {
    const { db } = await getFirebaseServices();
    const snap = await db.collection('conductores').doc(uid).get();
    return snap.exists ? snap.data() : null;
}

async function obtenerUsuariosFirestore() {
    const { db } = await getFirebaseServices();
    const snap = await db.collection('usuarios').get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function subirArchivoBase64Storage(base64, ruta) {
    if (!base64) return '';
    const { storage } = await getFirebaseServices();
    const ref = storage.ref().child(ruta);
    await ref.putString(base64, 'data_url');
    return await ref.getDownloadURL();
}

async function subirInputFileStorage(inputId, ruta) {
    const input = document.getElementById(inputId);
    if (!input || !input.files || !input.files[0]) return '';
    const { storage } = await getFirebaseServices();
    const file = input.files[0];
    const ref = storage.ref().child(`${ruta}/${Date.now()}_${file.name}`);
    await ref.put(file);
    return await ref.getDownloadURL();
}

async function asegurarCarteraFirestore(uid) {
    const { db } = await getFirebaseServices();
    const ref = db.collection('carteras').doc(uid);
    const snap = await ref.get();

    if (!snap.exists) {
        const dataInicial = {
            uid: uid,
            saldo: 0.00,
            ingresos: 0.00,
            egresos: 0.00,
            saldoDisponible: 0.00,
            trips: 0,
            ultimaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
        };
        await ref.set(dataInicial, { merge: true });
        return dataInicial;
    }

    return snap.data();
}

async function obtenerCarteraFirestore(uid) {
    const cartera = await asegurarCarteraFirestore(uid);
    return {
        uid: uid,
        saldo: Number(cartera.saldo || 0),
        ingresos: Number(cartera.ingresos || 0),
        egresos: Number(cartera.egresos || 0),
        saldoDisponible: Number(cartera.saldoDisponible ?? cartera.saldo ?? 0),
        trips: Number(cartera.trips || 0),
        ultimaActualizacion: cartera.ultimaActualizacion || null
    };
}

async function guardarCarteraFirestore(uid, data) {
    const { db } = await getFirebaseServices();
    const saldo = Number(data.saldo || 0);
    const ingresos = Number(data.ingresos || 0);
    const egresos = Number(data.egresos || 0);
    const saldoDisponible = Number(data.saldoDisponible ?? saldo);

    await db.collection('carteras').doc(uid).set({
        uid: uid,
        saldo: saldo,
        ingresos: ingresos,
        egresos: egresos,
        saldoDisponible: saldoDisponible,
        trips: Number(data.trips || 0),
        ultimaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return await obtenerCarteraFirestore(uid);
}

async function registrarMovimientoFirestore(uid, tipo, monto, descripcion, origen) {
    const { db } = await getFirebaseServices();
    const movimiento = {
        uid: uid,
        tipo: tipo,
        monto: Number(monto || 0),
        descripcion: descripcion || '',
        origen: origen || 'cartera',
        fecha: firebase.firestore.FieldValue.serverTimestamp()
    };

    const ref = await db.collection('movimientos').add(movimiento);
    return { id: ref.id, ...movimiento };
}

async function obtenerMovimientosFirestore(uid) {
    const { db } = await getFirebaseServices();
    const snap = await db.collection('movimientos')
        .where('uid', '==', uid)
        .orderBy('fecha', 'desc')
        .limit(50)
        .get();

    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function modificarSaldoCarteraFirestore(uid, tipo, monto, descripcion, origen) {
    const { db } = await getFirebaseServices();
    const carteraRef = db.collection('carteras').doc(uid);
    const movimientoRef = db.collection('movimientos').doc();
    const montoNumero = Number(monto || 0);

    const resultado = await db.runTransaction(async transaction => {
        const snap = await transaction.get(carteraRef);
        const actual = snap.exists ? snap.data() : {};

        const saldoActual = Number(actual.saldo || 0);
        const ingresosActuales = Number(actual.ingresos || 0);
        const egresosActuales = Number(actual.egresos || 0);
        const tripsActuales = Number(actual.trips || 0);

        const esIngreso = tipo === 'sumar' || tipo === 'ingreso' || tipo === 'recarga';
        const nuevoSaldo = esIngreso ? saldoActual + montoNumero : saldoActual - montoNumero;
        const nuevosIngresos = esIngreso ? ingresosActuales + montoNumero : ingresosActuales;
        const nuevosEgresos = esIngreso ? egresosActuales : egresosActuales + montoNumero;

        const carteraActualizada = {
            uid: uid,
            saldo: nuevoSaldo,
            ingresos: nuevosIngresos,
            egresos: nuevosEgresos,
            saldoDisponible: nuevoSaldo,
            trips: tripsActuales,
            ultimaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
        };

        const movimiento = {
            uid: uid,
            tipo: tipo,
            monto: montoNumero,
            descripcion: descripcion || '',
            origen: origen || 'cartera',
            fecha: firebase.firestore.FieldValue.serverTimestamp()
        };

        transaction.set(carteraRef, carteraActualizada, { merge: true });
        transaction.set(movimientoRef, movimiento);

        return { ...carteraActualizada, movimientoId: movimientoRef.id };
    });

    return resultado;
}

