// Giris yapilmamissa login'e yonlendir
if (!getToken()) {
  window.location.href = 'index.html';
}

let selectedVehicleId = null;

document.addEventListener('DOMContentLoaded', () => {
  loadVehicles();
});

function logout() {
  removeToken();
  window.location.href = 'index.html';
}

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

function selectVehicle(id, name) {
  selectedVehicleId = id;
  document.getElementById('maintenanceSection').classList.remove('hidden');
  document.getElementById('maintenanceTitle').textContent = `${name} - Bakim Kayitlari`;
  document.getElementById('typeFilter').value = '';
  loadMaintenance();
  document.getElementById('maintenanceSection').scrollIntoView({ behavior: 'smooth' });
}

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
    if (selectedVehicleId === id) {
      document.getElementById('maintenanceSection').classList.add('hidden');
      selectedVehicleId = null;
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

document.getElementById('vehicleForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('vehicleId').value;

  const year = parseInt(document.getElementById('vYear').value);
  const km = parseInt(document.getElementById('vKm').value);
  const currentYear = new Date().getFullYear();

  if (isNaN(year) || year < 1900 || year > currentYear + 1) {
    showToast('Yil 1900 ile ' + (currentYear + 1) + ' arasinda olmali', 'error');
    return;
  }
  if (isNaN(km) || km < 0) {
    showToast('Kilometre 0 veya pozitif olmali', 'error');
    return;
  }

  const vehicleData = {
    make: document.getElementById('vMake').value,
    model: document.getElementById('vModel').value,
    year: year,
    plate: document.getElementById('vPlate').value,
    currentKm: km,
    fuelType: document.getElementById('vFuel').value
  };

  try {
    if (id) {
      await apiCall(`/api/vehicles/${id}`, { method: 'PUT', body: vehicleData });
      showToast('Arac guncellendi');
    } else {
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
          <div class="maintenance-actions">
            <button class="btn-small" onclick='editMaintenance(${JSON.stringify(m)})'>Duzenle</button>
            <button class="btn-small btn-danger" onclick="deleteMaintenance('${m._id}')">Sil</button>
          </div>
        </div>
      `).join('');
    }

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
  document.getElementById('maintenanceId').value = '';
  document.getElementById('maintenanceModalTitle').textContent = 'Yeni Bakim Kaydi';
  document.getElementById('mDate').valueAsDate = new Date();
  document.getElementById('maintenanceModal').classList.remove('hidden');
}

function editMaintenance(m) {
  document.getElementById('maintenanceModalTitle').textContent = 'Bakim Kaydi Duzenle';
  document.getElementById('maintenanceId').value = m._id;
  document.getElementById('mType').value = m.type;
  document.getElementById('mDate').value = m.date ? m.date.split('T')[0] : '';
  document.getElementById('mKm').value = m.kmAtService;
  document.getElementById('mCost').value = m.cost;
  document.getElementById('mService').value = m.serviceName || '';
  document.getElementById('mNotes').value = m.notes || '';
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

document.getElementById('maintenanceForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const km = parseInt(document.getElementById('mKm').value);
  const cost = parseFloat(document.getElementById('mCost').value);

  if (isNaN(km) || km < 0) {
    showToast('Kilometre 0 veya pozitif olmali', 'error');
    return;
  }
  if (isNaN(cost) || cost < 0) {
    showToast('Maliyet 0 veya pozitif olmali', 'error');
    return;
  }

  const maintenanceData = {
    type: document.getElementById('mType').value,
    date: document.getElementById('mDate').value,
    kmAtService: km,
    cost: cost,
    serviceName: document.getElementById('mService').value,
    notes: document.getElementById('mNotes').value
  };

  const id = document.getElementById('maintenanceId').value;

  try {
    if (id) {
      await apiCall(`/api/maintenance/${id}`, { method: 'PUT', body: maintenanceData });
      showToast('Bakim kaydi guncellendi');
    } else {
      await apiCall(`/api/maintenance/vehicle/${selectedVehicleId}`, {
        method: 'POST',
        body: maintenanceData
      });
      showToast('Bakim kaydi eklendi');
    }
    closeMaintenanceModal();
    loadMaintenance();
  } catch (error) {
    showToast(error.message, 'error');
  }
});