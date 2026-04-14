const API_BASE = 'http://localhost:5000/api';

const api = {
  // ── Auth ──────────────────────────────────────────────
  async login(email, password) {
    return await request('POST', '/auth/login', { email, password });
  },
  async register(name, email, password, role) {
    return await request('POST', '/auth/register', { name, email, password, role });
  },
  async getProfile() {
    return await request('GET', '/auth/profile');
  },

  // ── Transactions ──────────────────────────────────────
  async getTransactions() {
    return await request('GET', '/transactions');
  },
  async addTransaction(data) {
    return await request('POST', '/transactions', data);
  },

  // ── Maintenance ───────────────────────────────────────
  async getAllMaintenance() {
    return await request('GET', '/maintenance');
  },
  async getMyMaintenance() {
    return await request('GET', '/maintenance/mybills');
  },
  async generateBill(data) {
    return await request('POST', '/maintenance', data);
  },
  async updateBillStatus(id, status) {
    return await request('PUT', `/maintenance/${id}/pay`, { status });
  }
};

async function request(method, path, body) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(API_BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// ── Auth Helpers ──────────────────────────────────────
function saveSession(user, token) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}
function getUser() {
  try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
}
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}
function requireAuth() {
  if (!localStorage.getItem('token')) { window.location.href = 'index.html'; return null; }
  return getUser();
}
function redirectIfLoggedIn() {
  if (localStorage.getItem('token')) window.location.href = 'dashboard.html';
}

// ── UI Helpers ────────────────────────────────────────
function showAlert(id, msg, type = 'error') {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = `alert alert-${type} show`;
  el.innerHTML = (type === 'error' ? '⚠️ ' : '✅ ') + msg;
  setTimeout(() => { el.className = 'alert'; }, 4000);
}
function formatCurrency(n) {
  return '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });
}
function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function setLoading(btnId, spinnerId, loading) {
  const btn = document.getElementById(btnId);
  const sp  = document.getElementById(spinnerId);
  if (!btn) return;
  btn.disabled = loading;
  if (sp) sp.style.display = loading ? 'block' : 'none';
}
