async function savePassengerRequest() {
        const userValue = document.getElementById('reg-email').value.toLowerCase().trim();
        const passValue = document.getElementById('reg-pass').value;

        try {
            const { auth } = await getFirebaseServices();
            const credential = await auth.createUserWithEmailAndPassword(userValue, passValue);
            const firebaseUser = credential.user;
            const fotoUrl = await subirArchivoBase64Storage(tempBase64Photo, `usuarios/${firebaseUser.uid}/perfil/foto-perfil`);

            const newRequest = {
                id: firebaseUser.uid,
                uid: firebaseUser.uid,
                name: document.getElementById('dr-name').value,
                nombre: document.getElementById('dr-name').value,
                usuario: userValue,
                pass: '',
                correo: userValue,
                email: userValue,
                phone: document.getElementById('dr-phone').value,
                telefono: document.getElementById('dr-phone').value,
                foto: fotoUrl || tempBase64Photo,
                status: 'activo',
                role: 'pasajero',
                rolePassenger: true,
                roleDriver: false,
                driverStatus: 'no_registrado',
                date: new Date().toLocaleDateString()
            };

            await crearUsuarioFirestore(firebaseUser.uid, {
                nombre: newRequest.nombre,
                correo: newRequest.correo,
                telefono: newRequest.telefono,
                foto: newRequest.foto,
                roleDriver: false,
                driverStatus: 'no_registrado'
            });

            await saveWalletData(firebaseUser.uid, { saldo: 0.00, historial: [], trips: 0 });
            currentUser = newRequest;

            alert(`Cuenta creada correctamente.`);
            document.getElementById('driver-registration-view').classList.add('hidden');
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('passenger-view').classList.remove('hidden');
            document.getElementById('nav-passenger').classList.remove('hidden');
            document.getElementById('user-profile-header').classList.remove('hidden');
            updateProfileUI();
            lucide.createIcons();
        } catch (error) {
            alert(error.message || 'No se pudo crear la cuenta.');
        }
    }

async function handleRequest() {
        const wallet = await getWalletData(currentUser.uid || currentUser.id);
        if (wallet.saldo < 0) { alert("Saldo negativo. Recarga para continuar."); return; }
        if (appState.selectedPayment === 'cartera' && wallet.saldo < appState.precioViaje) { 
            alert('Saldo insuficiente.'); return; 
        }
        if (appState.selectedPayment === 'cartera') { 
            await addMovement(currentUser.uid || currentUser.id, 'restar', appState.precioViaje, 'Pago Viaje'); 
        }
        wallet.trips = (wallet.trips || 0) + 1;
        await saveWalletData(currentUser.uid || currentUser.id, wallet);
        await updateProfileUI();
        startRadar();
    }

function startRadar() {
        closeAll();
        document.getElementById('radar').classList.remove('hidden');
        document.getElementById('search-msg').classList.remove('hidden');
        document.getElementById('p-banners').classList.add('hidden-view');
        document.getElementById('p-wallet').classList.add('hidden-view');
        document.getElementById('p-header').classList.add('hidden-view');
        setTimeout(() => { showDriverSelection(); }, 3000);
    }

function showDriverSelection() {
        document.getElementById('radar').classList.add('hidden');
        document.getElementById('search-msg').classList.add('hidden');
        document.getElementById('passenger-view').classList.add('hidden');
        document.getElementById('driver-selection-view').classList.remove('hidden');
        renderAvailableDrivers();
    }

function renderAvailableDrivers() {
        const container = document.getElementById('driver-cards-container');
        container.innerHTML = '';
        const drivers = [
            { id: 'd1', name: "Luis Jiménez", rating: "4.9", vehicle: "Nissan Versa", plate: "ABC-123-D", time: "3 min" },
            { id: 'd2', name: "Sofía Martínez", rating: "4.7", vehicle: "Chevrolet Aveo", plate: "XYZ-789-M", time: "5 min" }
        ];
        drivers.forEach(dr => {
            container.innerHTML += `
                <div class="bg-white p-5 rounded-[2rem] shadow-lg border flex flex-col space-y-4">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white font-black italic border-2 border-white">${dr.name.charAt(0)}</div>
                        <div class="flex-1">
                            <h4 class="font-black italic uppercase text-xs">${dr.name}</h4>
                            <p class="text-[9px] font-bold text-gray-400 uppercase">${dr.vehicle} • ${dr.plate}</p>
                        </div>
                        <div class="text-right">
                             <p class="text-[10px] font-black text-yellow-500">★ ${dr.rating}</p>
                             <p class="text-[8px] font-bold text-gray-400 uppercase">${dr.time}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <button onclick="alert('Conductor aceptado'); location.reload()" class="bg-green-600 text-white py-3 rounded-2xl text-[10px] font-black uppercase italic active:scale-95 transition-all">Aceptar</button>
                        <button onclick="this.closest('.bg-white').remove()" class="bg-gray-200 text-gray-600 py-3 rounded-2xl text-[10px] font-black uppercase italic active:scale-95 transition-all">Rechazar</button>
                    </div>
                </div>`;
        });
        lucide.createIcons();
    }

