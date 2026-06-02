function renderAdminPassengers() {
        currentAdminView = 'passengers';
        selectedIds = [];

        const container = document.getElementById('admin-requests-container');

        const reqs = JSON.parse(
            localStorage.getItem('db_usuarios_permanente') || '[]'
        ).filter(user => user.role === 'pasajero');

        document.getElementById('admin-list-title').innerText = "Pasajeros Registrados";

        container.innerHTML = reqs.length === 0
            ? '<p class="text-center text-[9px] uppercase py-10">Sin pasajeros</p>'
            : '';

        reqs.forEach(req => {
            container.innerHTML += `
                <div id="card-${req.id}" onclick="toggleCardSelection('${req.id}')" class="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col gap-4 cursor-pointer relative transition-all">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <img src="${req.foto || ''}" class="w-12 h-12 bg-gray-900 rounded-2xl object-cover shadow-lg">
                            <div>
                                <h4 class="text-[12px] font-black uppercase italic text-gray-900 leading-none">${req.name}</h4>
                                <p class="text-[8px] font-bold text-gray-400 mt-1">ID: ${req.id} | TEL: ${req.phone || 'N/A'}</p>
                            </div>
                        </div>
                        <span class="text-[8px] font-black px-3 py-1 bg-green-100 text-green-600 rounded-full uppercase italic border border-green-200">Activo</span>
                    </div>
                </div>`;
        });

        lucide.createIcons();
    }

function renderAdminRequests() {
        currentAdminView = 'requests';
        selectedIds = [];

        const container = document.getElementById('admin-requests-container');

        const reqs = JSON.parse(
            localStorage.getItem('db_usuarios_permanente') || '[]'
        ).filter(user => user.role === 'conductor');

        document.getElementById('admin-list-title').innerText = "Conductores Registrados";

        container.innerHTML = reqs.length === 0
            ? '<p class="text-center text-[9px] uppercase py-10">Sin conductores</p>'
            : '';

        reqs.forEach(req => {
            container.innerHTML += `
                <div id="card-${req.id}" onclick="toggleCardSelection('${req.id}')" class="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col gap-4 cursor-pointer relative transition-all">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <img src="${req.foto || ''}" class="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center object-cover shadow-lg">
                            <div>
                                <h4 class="text-[12px] font-black uppercase italic text-gray-900 leading-none">${req.name}</h4>
                                <p class="text-[8px] font-bold text-gray-400 mt-1">TEL: ${req.phone || 'NO REGISTRADO'}</p>
                                <p class="text-[8px] font-black text-red-600 uppercase mt-0.5">${req.vehiculo?.marca || 'Conductor'} - ${req.date}</p>
                            </div>
                        </div>
                        <span class="text-[8px] font-black px-3 py-1 bg-red-100 text-red-600 rounded-full uppercase italic">Conductor</span>
                    </div>
                </div>`;
        });

        lucide.createIcons();
    }

function toggleCardSelection(id) {
        const card = document.getElementById(`card-${id}`);
        const idx = selectedIds.indexOf(String(id));
        if (idx > -1) { selectedIds.splice(idx, 1); card.classList.remove('card-selected'); }
        else { selectedIds.push(String(id)); card.classList.add('card-selected'); }
    }

function eliminarSeleccionados() {
        if (selectedIds.length === 0) { alert("Selecciona registros para eliminar"); return; }
        const key = (currentAdminView === 'passengers') ? 'db_usuarios_permanente' : 'driver_requests';
        let data = JSON.parse(localStorage.getItem(key) || '[]');
        const newData = data.filter(item => !selectedIds.includes(String(item.id)));
        localStorage.setItem(key, JSON.stringify(newData));
        if (currentAdminView === 'passengers') renderAdminPassengers();
        else renderAdminRequests();
        selectedIds = []; alert("Registros eliminados.");
    }

function openAdminWallet() { 
        closeAll(); document.getElementById('admin-dashboard').classList.add('hidden'); 
        document.getElementById('admin-wallet-section').classList.remove('hidden');
        document.getElementById('admin-menu-btn').classList.add('hidden');
        document.getElementById('admin-back-btn').classList.remove('hidden');
        document.getElementById('admin-title').innerHTML = 'CARTERA <span class="text-red-600 text-lg">ADMIN</span>';
    }

function closeAdminWallet() { 
        document.getElementById('admin-dashboard').classList.remove('hidden');
        document.getElementById('admin-wallet-section').classList.add('hidden');
        document.getElementById('admin-menu-btn').classList.remove('hidden');
        document.getElementById('admin-back-btn').classList.add('hidden');
        document.getElementById('admin-title').innerHTML = 'PANEL <span class="text-red-600 text-lg">ADMIN</span>';
    }

function searchPassengerInWallet() {
        const term = document.getElementById('admin-search-user').value.toLowerCase().trim();
        const pasajeros = JSON.parse(localStorage.getItem('db_usuarios_permanente') || '[]');
        userTargetAdmin = pasajeros.find(u => u.name.toLowerCase().includes(term) || u.correo.toLowerCase().includes(term) || u.usuario === term);
        const disp = document.getElementById('admin-view-saldo');
        if (userTargetAdmin) {
            const wallet = getWalletData(userTargetAdmin.id);
            disp.innerText = `$${wallet.saldo.toFixed(2)} MXN`;
            document.getElementById('admin-search-status').innerText = `Pasajero: ${userTargetAdmin.name}`;
            renderHistorial(wallet.historial, document.getElementById('admin-movimientos-list'));
        } else { disp.innerText = "No encontrado"; }
    }

function renderHistorial(hist, container) {
        container.innerHTML = hist.length === 0 ? '<p class="text-[8px] text-center uppercase py-4">Sin movimientos</p>' : '';
        hist.forEach(m => {
            const color = m.tipo === 'sumar' ? 'text-green-600' : 'text-red-600';
            container.innerHTML += `<div class="bg-white p-3 rounded-xl border flex justify-between items-center"><div><p class="text-[9px] uppercase italic font-black">${m.desc}</p></div><p class="text-[10px] font-black ${color}">$${m.monto.toFixed(2)}</p></div>`;
        });
    }

function adminModificarSaldo(tipo) {
        if (!userTargetAdmin) return;
        const monto = parseFloat(document.getElementById('admin-monto-input').value);
        if (isNaN(monto) || monto <= 0) return;
        addMovement(userTargetAdmin.id, tipo, monto, tipo === 'sumar' ? 'Recarga Admin' : 'Ajuste Admin');
        document.getElementById('admin-monto-input').value = ''; searchPassengerInWallet();
    }
