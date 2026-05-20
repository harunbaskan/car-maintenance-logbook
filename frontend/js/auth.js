// Eger zaten giris yapilmissa direkt dashboard'a yonlendir
if (getToken()) {
  window.location.href = 'dashboard.html';
}

// Login/Register tab gecisleri
function showLogin() {
  document.getElementById('loginForm').classList.remove('hidden');
  document.getElementById('registerForm').classList.add('hidden');
  document.getElementById('loginTab').classList.add('active');
  document.getElementById('registerTab').classList.remove('active');
  hideMessage();
}

function showRegister() {
  document.getElementById('registerForm').classList.remove('hidden');
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('registerTab').classList.add('active');
  document.getElementById('loginTab').classList.remove('active');
  hideMessage();
}

// Mesaj goster
function showMessage(text, type = 'error') {
  const msg = document.getElementById('message');
  msg.textContent = text;
  msg.className = `message ${type}`;
  msg.classList.remove('hidden');
}

function hideMessage() {
  document.getElementById('message').classList.add('hidden');
}

// LOGIN
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const result = await apiCall('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    });

    saveToken(result.data.token);
    showMessage('Giris basarili! Yonlendiriliyorsunuz...', 'success');

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);
  } catch (error) {
    showMessage(error.message);
  }
});

// REGISTER
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('registerUsername').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  // Frontend validation
  if (password.length < 6) {
    showMessage('Sifre en az 6 karakter olmali');
    return;
  }

  try {
    await apiCall('/api/auth/register', {
      method: 'POST',
      body: { username, email, password }
    });

    showMessage('Kayit basarili! Simdi giris yapabilirsiniz.', 'success');
    
    // 1.5 saniye sonra login formuna gec
    setTimeout(() => {
      showLogin();
      document.getElementById('loginEmail').value = email;
    }, 1500);
  } catch (error) {
    showMessage(error.message);
  }
});