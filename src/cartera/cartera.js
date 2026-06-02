function getWalletData(userId) {
        return JSON.parse(localStorage.getItem(`wallet_${userId}`)) || { saldo: 0.00, historial: [], trips: 0 };
    }

function saveWalletData(userId, data) {
        localStorage.setItem(`wallet_${userId}`, JSON.stringify(data));
    }

function addMovement(userId, tipo, monto, descripcion) {
        let wallet = getWalletData(userId);
        if (tipo === 'sumar') wallet.saldo += monto;
        else wallet.saldo -= monto;
        wallet.historial.unshift({ fecha: new Date().toLocaleString(), tipo: tipo, monto: monto, desc: descripcion });
        saveWalletData(userId, wallet);
        return wallet;
    }

function updateWalletDisplay() {
        if (!currentUser) return;
        const wallet = getWalletData(currentUser.id);
        document.getElementById('display-saldo').innerText = `$${wallet.saldo.toFixed(2)} MXN`;
    }

function setPay(btn, method) { document.querySelectorAll('.payment-opt').forEach(b => b.classList.remove('selected')); btn.classList.add('selected'); appState.selectedPayment = method; }
