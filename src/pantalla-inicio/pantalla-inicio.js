function startPassengerRegistration() {
        registrationMode = 'passenger';
        const stepsToHide = ['step-ine-front', 'step-ine-back', 'step-vehicle', 'step-circ', 'step-v-photo'];
        stepsToHide.forEach(s => document.getElementById(s).classList.add('hidden'));
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('driver-registration-view').classList.remove('hidden');
        document.getElementById('reg-main-title').innerHTML = 'REGISTRO <span class="text-red-600 uppercase">USER</span>';
        document.getElementById('fields-account').classList.remove('hidden');
        goToStep(1);
        lucide.createIcons();
    }

function processImage(i) { 
        if (i.files[0]) { 
            const reader = new FileReader();
            reader.onload = function(e) {
                tempBase64Photo = e.target.result;
                document.getElementById('driver-photo-preview').src = tempBase64Photo; 
                document.getElementById('driver-photo-preview').classList.remove('hidden'); 
                document.getElementById('placeholder-icon').classList.add('hidden'); 
                document.getElementById('btn-photo-next').disabled = false; 
                document.getElementById('btn-photo-next').classList.replace('bg-gray-300', 'bg-red-600'); 
            };
            reader.readAsDataURL(i.files[0]);
        } 
    }

function handleAuth() {
        const userIn = document.getElementById('login-email').value.trim();
        const passIn = document.getElementById('login-pass').value.trim();
        
        if (userIn === 'admincentral' && passIn === '9271@') {
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('admin-view').classList.remove('hidden');
            document.getElementById('nav-admin').classList.remove('hidden');
            document.getElementById('side-header-admin').classList.remove('hidden');
            renderAdminRequests();
        } else {
            const db = JSON.parse(localStorage.getItem('db_usuarios_permanente') || '[]');
            const user = db.find(u => (u.usuario === userIn.toLowerCase() || u.correo === userIn.toLowerCase()) && u.pass === passIn);
            
            if (user) { 
                currentUser = user;
                document.getElementById('login-screen').classList.add('hidden'); 
                
                if (user.role === 'conductor') {

                    document.getElementById('passenger-view').classList.add('hidden');
                    document.getElementById('admin-view').classList.add('hidden');
                    document.getElementById('driver-selection-view').classList.add('hidden');

                    document.getElementById('nav-passenger').classList.add('hidden');
                    document.getElementById('nav-admin').classList.add('hidden');

                    document.getElementById('user-profile-header').classList.add('hidden');
                    document.getElementById('side-header-admin').classList.add('hidden');

                    document.getElementById('driver-view-active').classList.remove('hidden');

                    if(user.foto) {
                        document.getElementById('active-driver-photo').src = user.foto;
                    }

                } else {
                    document.getElementById('passenger-view').classList.remove('hidden');
                    document.getElementById('nav-passenger').classList.remove('hidden');
                    document.getElementById('user-profile-header').classList.remove('hidden');
                    updateProfileUI();
                }
            } else { alert('Usuario o contraseña incorrectos'); }
        }
        lucide.createIcons();
    }

function goToStep(n) {
        const steps = ['step-photo', 'step-name', 'step-ine-front', 'step-ine-back', 'step-vehicle', 'step-circ', 'step-v-photo', 'step-phone', 'step-finish-driver', 'step-finish-passenger'];
        steps.forEach(s => { const el = document.getElementById(s); if(el) el.classList.add('hidden'); });
        const normalSteps = ['step-photo', 'step-name', 'step-ine-front', 'step-ine-back', 'step-vehicle', 'step-circ', 'step-v-photo', 'step-phone'];
        if (normalSteps[n - 1]) document.getElementById(normalSteps[n - 1]).classList.remove('hidden');
        currentStep = n;
        lucide.createIcons();
    }

function processFile(i, p, b) { 
        if (i.files[0]) { 
            document.getElementById(p).src = URL.createObjectURL(i.files[0]); 
            document.getElementById(p).classList.remove('hidden'); 
            document.getElementById(b).disabled = false; 
            document.getElementById(b).classList.replace('bg-gray-300', 'bg-red-600'); 
        } 
    }

function checkName(i) { const b = document.getElementById('btn-name-next'); if(i.value.length > 3) { b.disabled = false; b.classList.replace('bg-gray-300', 'bg-red-600'); } }

function checkVehicle() { document.getElementById('btn-v-next').disabled = false; document.getElementById('btn-v-next').classList.replace('bg-gray-300', 'bg-red-600'); }

function checkPhone(i) { const b = document.getElementById('btn-phone-next'); if(i.value.length >= 10) { b.disabled = false; b.classList.replace('bg-gray-300', 'bg-red-600'); } }

function handleStepNameNext() { 
        if (registrationMode === 'passenger') goToStep(8); 
        else goToStep(3); 
    }

function handleStepPhoneNext() {
        const steps = ['step-photo', 'step-name', 'step-ine-front', 'step-ine-back', 'step-vehicle', 'step-circ', 'step-v-photo', 'step-phone'];
        steps.forEach(s => { const el = document.getElementById(s); if(el) el.classList.add('hidden'); });
        if (registrationMode === 'passenger') document.getElementById('step-finish-passenger').classList.remove('hidden');
        else document.getElementById('step-finish-driver').classList.remove('hidden');
        lucide.createIcons();
    }

function handleDriverBack() { document.getElementById('driver-registration-view').classList.add('hidden'); document.getElementById('login-screen').classList.remove('hidden'); }
