async function updateProfileUI() {
        if (!currentUser) return;
        const sidePhoto = document.getElementById('side-user-photo');
        const sideName = document.getElementById('side-user-name');
        const sideTrips = document.getElementById('side-user-trips');
        const topPhoto = document.getElementById('top-user-photo');
        const topIcon = document.getElementById('top-user-icon');

        sideName.innerText = currentUser.name;
        if (currentUser.foto) {
            sidePhoto.src = currentUser.foto;
            topPhoto.src = currentUser.foto;
            topPhoto.classList.remove('hidden');
            topIcon.classList.add('hidden');
        }

        const wallet = await getWalletData(currentUser.uid || currentUser.id);
        sideTrips.innerText = wallet.trips || 0;
        await updateWalletDisplay();
    }

function openCosts() { document.getElementById('cost-sheet').classList.add('active'); document.getElementById('overlay').classList.add('opacity-100', 'pointer-events-auto'); }

