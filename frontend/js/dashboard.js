// Giris yapilmamissa login'e yonlendir
if (!getToken()) {
  window.location.href = 'index.html';
}

let selectedVehicleId = null;

// Sayfa yuklenince araclari getir
document.addEventListener('DOMContentLoaded', () => {
  loadVehicles();
});

// Cikis
function logout() {
  removeToken();
  window.location.href = 'index.html';
}

// Toast mesaj goster
function showToast(text, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = text;
  toast.className = `toast ${type}`;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

// ============ ARACLAR ============

async function loadVehicles() {
  try {
    const result = await apiCall('/api/vehicles');
    const list = document.getElementById('vehiclesList');

    if (result.data.length === 0) {
      list.innerHTML = '<p class="empty">Henuz arac eklemediniz. "+ Yeni Arac" ile baslayin!</p>';
      return;
    }

    list.innerHTML = result.data.map(v => `
      <div class="vehicle-card" onclick="selectVehicle('${v._id}', '${v.make} ${v.model}')">
        <div class="vehicle-icon">🚗</div>
        <h3>${v.make} ${v.model}</h3>
        <p class="plate">${v.plate}</p>
        <div class="vehicle-details">
          <span>${v.year}</span>
          <span>${v.currentKm.toLocaleString()} km</span>
          <span>${v.fuelType}</span>
        </div>
        <div class="vehicle-actions" onclick="event.stopPropagation()">
          <button class="btn-small" onclick="editVehicle('${v._id}')">Duzenle</button>
          <button class="btn-small btn-danger" onclick="deleteVehicle('${v._id}')">Sil</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Arac sec -> bakim kayitlarini goster
function selectVehicle(id, name) {
  selectedVehicleId = id;
  document.getElementById('maintenanceSection').classList.remove('hidden');
  document.getElementById('maintenanceTitle').textContent = `${name} - Bakim Kayitlari`;
  document.getElementById('typeFilter').value = '';
  loadMaintenance();
  document.getElementById('maintenanceSection').scrollIntoView({ behavior: 'smooth' });
}

// Arac Modal
function openVehicleModal() {
  document.getElementById('vehicleModalTitle').textContent = 'Yeni Arac';
  document.getElementById('vehicleForm').reset();
  document.getElementById('vehicleId').value = '';
  document.getElementById('vehicleModal').classList.remove('hidden');
}

function closeVehicleModal() {
  document.getElementById('vehicleModal').classList.add('hidden');
}

async function editVehicle(id) {
  try {
    const result = await apiCall(`/api/vehicles/${id}`);
    const v = result.data;
    document.getElementById('vehicleModalTitle').textContent = 'Arac Duzenle';
    document.getElementById('vehicleId').value = v._id;
    document.getElementById('vMake').value = v.make;
    document.getElementById('vModel').value = v.model;
    document.getElementById('vYear').value = v.year;
    document.getElementById('vPlate').value = v.plate;
    document.getElementById('vKm').value = v.currentKm;
    document.getElementById('vFuel').value = v.fuelType;
    document.getElementById('vehicleModal').classList.remove('hidden');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function deleteVehicle(id) {
  if (!confirm('Bu araci silmek istediginize emin misiniz?')) return;

  try {
    await apiCall(`/api/vehicles/${id}`, { method: 'DELETE' });
    showToast('Arac silindi');
    loadVehicles();
    // Eger silinen arac secili ise bakim bolumunu gizle
    if (selectedVehicleId === id) {
      document.getElementById('maintenanceSection').classList.add('hidden');
      selectedVehicleId = null;
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Arac formu submit
document.getElementById('vehicleForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('vehicleId').value;
  const vehicleData = {
    make: document.getElementById('vMake').value,
    model: document.getElementById('vModel').value,
    year: parseInt(document.getElementById('vYear').value),
    plate: document.getElementById('vPlate').value,
    currentKm: parseInt(document.getElementById('vKm').value),
    fuelType: document.getElementById('vFuel').value
  };

  try {
    if (id) {
      // Guncelleme
      await apiCall(`/api/vehicles/${id}`, { method: 'PUT', body: vehicleData });
      showToast('Arac guncellendi');
    } else {
      // Yeni
      await apiCall('/api/vehicles', { method: 'POST', body: vehicleData });
      showToast('Arac eklendi');
    }
    closeVehicleModal();
    loadVehicles();
  } catch (error) {
    showToast(error.message, 'error');
  }
});

// ============ BAKIM KAYITLARI ============

async function loadMaintenance() {
  if (!selectedVehicleId) return;

  const typeFilter = document.getElementById('typeFilter').value;
  let endpoint = `/api/maintenance/vehicle/${selectedVehicleId}`;
  if (typeFilter) {
    endpoint += `?type=${encodeURIComponent(typeFilter)}`;
  }

  try {
    // Bakimlari getir
    const result = await apiCall(endpoint);
    const list = document.getElementById('maintenanceList');

    if (result.data.length === 0) {
      list.innerHTML = '<p class="empty">Bu arac icin bakim kaydi yok.</p>';
    } else {
      list.innerHTML = result.data.map(m => `
        <div class="maintenance-card">
          <div class="maintenance-header">
            <span class="maintenance-type">${m.type}</span>
            <span class="maintenance-cost">${m.cost.toLocaleString()} TL</span>
          </div>
          <div class="maintenance-body">
            <p>📅 ${new Date(m.date).toLocaleDateString('tr-TR')}</p>
            <p>🔢 ${m.kmAtService.toLocaleString()} km</p>
            ${m.serviceName ? `<p>🔧 ${m.serviceName}</p>` : ''}
            ${m.notes ? `<p>📝 ${m.notes}</p>` : ''}
          </div>
          <button class="btn-small btn-danger" onclick="deleteMaintenance('${m._id}')">Sil</button>
        </div>
      `).join('');
    }

    // Maliyet ozetini getir (BONUS)
    loadCostSummary();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function loadCostSummary() {
  try {
    const result = await apiCall(`/api/maintenance/vehicle/${selectedVehicleId}/summary`);
    const summary = result.data;
    const div = document.getElementById('costSummary');

    if (summary.totalRecords === 0) {
      div.innerHTML = '';
      return;
    }

    div.innerHTML = `
      <div class="summary-total">
        <span>Toplam Harcama</span>
        <strong>${summary.grandTotal.toLocaleString()} TL</strong>
        <small>${summary.totalRecords} kayit</small>
      </div>
    `;
  } catch (error) {
    // Sessizce gec
  }
}

function openMaintenanceModal() {
  document.getElementById('maintenanceForm').reset();
  document.getElementById('mDate').valueAsDate = new Date();
  document.getElementById('maintenanceModal').classList.remove('hidden');
}

function closeMaintenanceModal() {
  document.getElementById('maintenanceModal').classList.add('hidden');
}

async function deleteMaintenance(id) {
  if (!confirm('Bu bakim kaydini silmek istediginize emin misiniz?')) return;

  try {
    await apiCall(`/api/maintenance/${id}`, { method: 'DELETE' });
    showToast('Bakim kaydi silindi');
    loadMaintenance();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Bakim formu submit
document.getElementById('maintenanceForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const maintenanceData = {
    type: document.getElementById('mType').value,
    date: document.getElementById('mDate').value,
    kmAtService: parseInt(document.getElementById('mKm').value),
    cost: parseFloat(document.getElementById('mCost').value),
    serviceName: document.getElementById('mService').value,
    notes: document.getElementById('mNotes').value
  };

  try {
    await apiCall(`/api/maintenance/vehicle/${selectedVehicleId}`, {
      method: 'POST',
      body: maintenanceData
    });
    showToast('Bakim kaydi eklendi');
    closeMaintenanceModal();
    loadMaintenance();
  } catch (error) {
    showToast(error.message, 'error');
  }
});