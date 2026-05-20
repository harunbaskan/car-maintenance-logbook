// API'nin temel adresi
const API_BASE = 'http://localhost:3000';

// Token'i localStorage'dan al
function getToken() {
  return localStorage.getItem('token');
}

// Token'i kaydet
function saveToken(token) {
  localStorage.setItem('token', token);
}

// Token'i sil (logout)
function removeToken() {
  localStorage.removeItem('token');
}

/**
 * Genel API cagri fonksiyonu
 * @param {String} endpoint - /api/vehicles gibi
 * @param {Object} options - method, body vb.
 */
async function apiCall(endpoint, options = {}) {
  const token = getToken();

  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Token varsa header'a ekle
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // Body varsa ekle
  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  // Hata varsa firlatil
  if (!response.ok) {
    throw new Error(data.message || 'Bir hata olustu');
  }

  return data;
}