/* public/assets/session.js */
const KEY = 'sesion_pg';

export function setSession (usuario, ttlMs = 2 * 60 * 60 * 1000) {  // 2 horas
  const payload = { usuario, exp: Date.now() + ttlMs };
  localStorage.setItem(KEY, JSON.stringify(payload));
}

export function getSession () {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const { usuario, exp } = JSON.parse(raw);
    return Date.now() > exp ? (clearSession(), null) : usuario;
  } catch { clearSession(); return null; }
}

export function clearSession () {
  localStorage.removeItem(KEY);
}
