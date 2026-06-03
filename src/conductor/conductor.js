async function saveDriverRequest() { 
        try {
            const { auth } = await getFirebaseServices();
            const firebaseUser = auth.currentUser;

            if (!firebaseUser || !currentUser) {
                alert('Debes iniciar sesión como pasajero antes de registrarte como conductor.');
                return;
            }

            const driverId = firebaseUser.uid;
            const ineFrontUrl = await subirInputFileStorage('ine-f-input', `conductores/${driverId}/documentos/ine-frontal`);
            const ineBackUrl = await subirInputFileStorage('ine-b-input', `conductores/${driverId}/documentos/ine-trasera`);
            const circUrl = await subirInputFileStorage('circ-input', `conductores/${driverId}/documentos/tarjeta-circulacion`);
            const vehiclePhotoUrl = await subirInputFileStorage('v-photo-input', `conductores/${driverId}/documentos/vehiculo`);

            const newDriver = {
                id: driverId,
                uid: driverId,
                name: currentUser.name || document.getElementById('dr-name').value,
                nombre: currentUser.nombre || currentUser.name || document.getElementById('dr-name').value,
                usuario: currentUser.usuario || currentUser.correo || firebaseUser.email,
                pass: '',
                phone: currentUser.phone || document.getElementById('dr-phone').value,
                telefono: currentUser.telefono || currentUser.phone || document.getElementById('dr-phone').value,
                foto: currentUser.foto || tempBase64Photo,
                status: 'activo',
                role: 'conductor',
                rolePassenger: true,
                roleDriver: true,
                driverStatus: 'activo',
                date: new Date().toLocaleDateString(),
                vehiculo: { 
                    marca: document.getElementById('v-brand').value,
                    modelo: document.getElementById('v-model').value,
                    placa: document.getElementById('v-plate').value,
                    anio: document.getElementById('v-year').value,
                    color: document.getElementById('v-color').value
                },
                documentos: {
                    ineFrontal: ineFrontUrl,
                    ineTrasera: ineBackUrl,
                    tarjetaCirculacion: circUrl,
                    fotoVehiculo: vehiclePhotoUrl
                }
            };

            await crearConductorFirestore(driverId, {
                vehiculo: newDriver.vehiculo,
                placas: newDriver.vehiculo.placa,
                licencia: '',
                documentos: newDriver.documentos,
                estado: 'activo'
            });

            await actualizarUsuarioFirestore(driverId, {
                rolePassenger: true,
                roleDriver: true,
                driverStatus: 'activo'
            });

            currentUser = {
                ...currentUser,
                ...newDriver
            };

            await saveWalletData(driverId, await getWalletData(driverId));
            showDriverPanel();

            alert('¡Bienvenido Driver! Tu acceso como conductor ha sido activado en la misma cuenta.');
            lucide.createIcons();
        } catch (error) {
            alert(error.message || 'No se pudo guardar el registro de conductor.');
        }
    }

function toggleDriverAvailability() {

        isAvailable = !isAvailable;

        const statusBadge = document.getElementById('status-badge');
        const statusDot = document.getElementById('status-dot');
        const statusText = document.getElementById('status-text');

        const mainMsg = document.getElementById('driver-main-msg');
        

        const pulse = document.getElementById('search-pulse-driver');
        

        

        

        if (isAvailable) {

            statusBadge.classList.remove('bg-red-600/20','border-red-600/30');
            statusBadge.classList.add('bg-green-600/20','border-green-600/30');

            statusDot.classList.remove('bg-red-600');
            statusDot.classList.add('bg-green-500');

            statusText.classList.remove('text-red-600');
            statusText.classList.add('text-green-500');
            statusText.innerText = 'Disponible';

            mainMsg.innerText = 'Buscando viajes cercanos';

            pulse.classList.remove('hidden');

            



        } else {

            statusBadge.classList.remove('bg-green-600/20','border-green-600/30');
            statusBadge.classList.add('bg-red-600/20','border-red-600/30');

            statusDot.classList.remove('bg-green-500');
            statusDot.classList.add('bg-red-600');

            statusText.classList.remove('text-green-500');
            statusText.classList.add('text-red-600');
            statusText.innerText = 'No Disponible';

            pulse.classList.add('hidden');

            
        }

        lucide.createIcons();
    }

function openDriverSidebar() {
        document.getElementById('driver-sidebar').classList.remove('-translate-x-full');
        document.getElementById('driver-sidebar-overlay').classList.remove('hidden');
    }

function closeDriverSidebar() {
        document.getElementById('driver-sidebar').classList.add('-translate-x-full');
        document.getElementById('driver-sidebar-overlay').classList.add('hidden');
    }

function renderMockServices() {
        const list = document.getElementById('driver-services-list');
        list.innerHTML = `
            <div class="bg-white p-4 rounded-2xl border-2 border-red-600 shadow-lg animate-bounce-custom">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <p class="text-[8px] font-black text-gray-400 uppercase italic">Nuevo Servicio</p>
                        <h5 class="text-sm font-black italic uppercase">Usuario: Maria G.</h5>
                    </div>
                    <span class="bg-green-100 text-green-600 text-[10px] font-black px-2 py-1 rounded-lg">$85.00</span>
                </div>
                <div class="space-y-2 mb-4">
                    <div class="flex items-center gap-2">
                        <i data-lucide="map-pin" class="w-3 h-3 text-red-600"></i>
                        <span class="text-[9px] font-bold text-gray-600 uppercase">Centro Histórico</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <i data-lucide="navigation" class="w-3 h-3 text-gray-400"></i>
                        <span class="text-[9px] font-bold text-gray-400 uppercase italic">A 1.2 km de ti</span>
                    </div>
                </div>
                <button onclick="alert('Viaje Aceptado')" class="w-full bg-green-600 text-white py-2 rounded-xl font-black text-[9px] uppercase italic">Aceptar Viaje</button>
            </div>
        `;
        lucide.createIcons();
    }

function applyToBeDriver() {
        registrationMode = 'driver'; closeAll();

        if (currentUser && currentUser.roleDriver === true) {
            showDriverPanel();
            return;
        }

        document.getElementById('passenger-view').classList.add('hidden');
        document.getElementById('driver-registration-view').classList.remove('hidden');
        document.getElementById('reg-main-title').innerHTML = 'REGISTRO <span class="text-red-600 uppercase">DRIVER</span>';
        document.getElementById('fields-account').classList.add('hidden');
        goToStep(1);
    }

function showDriverPanel() {
        closeAll();
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('passenger-view').classList.add('hidden');
        document.getElementById('admin-view').classList.add('hidden');
        document.getElementById('driver-selection-view').classList.add('hidden');
        document.getElementById('driver-registration-view').classList.add('hidden');

        document.getElementById('nav-passenger').classList.add('hidden');
        document.getElementById('nav-admin').classList.add('hidden');
        document.getElementById('user-profile-header').classList.add('hidden');
        document.getElementById('side-header-admin').classList.add('hidden');

        document.getElementById('driver-view-active').classList.remove('hidden');

        if(currentUser && currentUser.foto) {
            document.getElementById('active-driver-photo').src = currentUser.foto;
        }

        ensurePassengerButtonInDriverPanel();
        lucide.createIcons();
    }

function showPassengerPanel() {
        closeDriverSidebar();
        closeAll();
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('driver-view-active').classList.add('hidden');
        document.getElementById('admin-view').classList.add('hidden');
        document.getElementById('driver-selection-view').classList.add('hidden');
        document.getElementById('driver-registration-view').classList.add('hidden');

        document.getElementById('nav-admin').classList.add('hidden');
        document.getElementById('side-header-admin').classList.add('hidden');

        document.getElementById('passenger-view').classList.remove('hidden');
        document.getElementById('nav-passenger').classList.remove('hidden');
        document.getElementById('user-profile-header').classList.remove('hidden');

        if (currentUser) {
            currentUser.role = 'pasajero';
        }

        updateProfileUI();
        lucide.createIcons();
    }

function ensurePassengerButtonInDriverPanel() {
        const driverSidebar = document.getElementById('driver-sidebar');
        if (!driverSidebar) return;
        if (document.getElementById('btn-driver-to-passenger')) return;

        const content = driverSidebar.querySelector('.p-4');
        if (!content) return;

        content.innerHTML += `
            <button id="btn-driver-to-passenger" onclick="showPassengerPanel()" class="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-xl font-black text-[10px] uppercase italic active:scale-95 transition-all">
                <i data-lucide="user" class="w-4 h-4"></i> Pasajero
            </button>
        `;
    }

                
