function saveDriverRequest() { 
        const driverId = "DRV_" + Date.now();
        const newDriver = {
            id: driverId,
            name: document.getElementById('dr-name').value,
            usuario: document.getElementById('reg-user').value || 'driver_' + Date.now(),
            pass: document.getElementById('reg-pass').value || '1234',
            phone: document.getElementById('dr-phone').value,
            foto: tempBase64Photo,
            status: 'activo',
            role: 'conductor',
            date: new Date().toLocaleDateString(),
            vehiculo: { 
                marca: document.getElementById('v-brand').value,
                modelo: document.getElementById('v-model').value,
                placa: document.getElementById('v-plate').value
            }
        };

        // Guardar en base de datos de usuarios (como activo por petición de acceso directo)
        let db = JSON.parse(localStorage.getItem('db_usuarios_permanente') || '[]');
        db.push(newDriver);
        localStorage.setItem('db_usuarios_permanente', JSON.stringify(db));
        
        // Crear cartera
        saveWalletData(driverId, { saldo: 0.00, historial: [], trips: 0 });

        // Acceso Automático
        currentUser = newDriver;
        
        // Ocultar registro, mostrar panel driver
        document.getElementById('driver-registration-view').classList.add('hidden');
        document.getElementById('driver-view-active').classList.remove('hidden');
        
        // Cargar foto en el panel driver
        if(tempBase64Photo) {
            document.getElementById('active-driver-photo').src = tempBase64Photo;
        }
        
        alert('¡Bienvenido Driver! Tu cuenta ha sido activada automáticamente.');
        lucide.createIcons();
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
        document.getElementById('passenger-view').classList.add('hidden');
        document.getElementById('driver-registration-view').classList.remove('hidden');
        document.getElementById('reg-main-title').innerHTML = 'REGISTRO <span class="text-red-600 uppercase">DRIVER</span>';
        document.getElementById('fields-account').classList.add('hidden');
        goToStep(1);
    }
