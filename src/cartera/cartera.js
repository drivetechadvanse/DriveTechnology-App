async function getWalletData(userId) {
        const { auth } = await getFirebaseServices();
        const uid = userId || auth.currentUser?.uid || currentUser?.uid || currentUser?.id;
        if (!uid) return { saldo: 0.00, ingresos: 0.00, egresos: 0.00, saldoDisponible: 0.00, historial: [], trips: 0 };

        const cartera = await obtenerCarteraFirestore(uid);
        const movimientos = await obtenerMovimientosFirestore(uid);

        return {
            uid: uid,
            saldo: Number(cartera.saldo || 0),
            ingresos: Number(cartera.ingresos || 0),
            egresos: Number(cartera.egresos || 0),
            saldoDisponible: Number(cartera.saldoDisponible ?? cartera.saldo ?? 0),
            historial: movimientos.map(m => ({
                id: m.id,
                fecha: m.fecha?.toDate ? m.fecha.toDate().toLocaleString() : new Date().toLocaleString(),
                tipo: m.tipo,
                monto: Number(m.monto || 0),
                desc: m.descripcion || m.desc || '',
                descripcion: m.descripcion || m.desc || '',
                origen: m.origen || 'cartera'
            })),
            trips: Number(cartera.trips || 0),
            ultimaActualizacion: cartera.ultimaActualizacion || null
        };
    }

async function saveWalletData(userId, data) {
        const { auth } = await getFirebaseServices();
        const uid = userId || auth.currentUser?.uid || currentUser?.uid || currentUser?.id;
        if (!uid) return { saldo: 0.00, ingresos: 0.00, egresos: 0.00, saldoDisponible: 0.00, historial: [], trips: 0 };

        const carteraActual = await obtenerCarteraFirestore(uid);
        const datosFinales = {
            saldo: Number(data?.saldo ?? carteraActual.saldo ?? 0),
            ingresos: Number(data?.ingresos ?? carteraActual.ingresos ?? 0),
            egresos: Number(data?.egresos ?? carteraActual.egresos ?? 0),
            saldoDisponible: Number(data?.saldoDisponible ?? data?.saldo ?? carteraActual.saldoDisponible ?? carteraActual.saldo ?? 0),
            trips: Number(data?.trips ?? carteraActual.trips ?? 0)
        };

        return await guardarCarteraFirestore(uid, datosFinales);
    }

async function addMovement(userId, tipo, monto, descripcion) {
        const { auth } = await getFirebaseServices();
        const uid = userId || auth.currentUser?.uid || currentUser?.uid || currentUser?.id;
        if (!uid) return { saldo: 0.00, ingresos: 0.00, egresos: 0.00, saldoDisponible: 0.00, historial: [], trips: 0 };

        await modificarSaldoCarteraFirestore(uid, tipo, monto, descripcion, 'cartera');
        return await getWalletData(uid);
    }

async function updateWalletDisplay() {
        if (!currentUser) return;
        const wallet = await getWalletData(currentUser.uid || currentUser.id);
        const displaySaldo = document.getElementById('display-saldo');
        if (displaySaldo) displaySaldo.innerText = `$${wallet.saldo.toFixed(2)} MXN`;
    }

function setPay(btn, method) { document.querySelectorAll('.payment-opt').forEach(b => b.classList.remove('selected')); btn.classList.add('selected'); appState.selectedPayment = method; }

