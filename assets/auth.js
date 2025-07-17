/* Login / registro vía RPC existentes */
import { SUPABASE_URL, HEADERS } from './supa.js';

/* Helpers fetch */
const rpc = (fn, body = {}) =>
  fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method : 'POST',
    headers: HEADERS,
    body   : JSON.stringify(body)
  }).then(r => r.json());

export async function signIn  (email, pass) {
  return rpc('verificar_password',   // ⇦ tu función
             { correo_input: email, password_input: pass });
}

export async function signUp  (email, pass) {
  return rpc('fn_registrar_usuario', // ⇦ tu función
             { p_email: email, p_pass: pass });
}

export async function signOut () {
  localStorage.clear();
}

export const supabase = null; // para no romper importaciones opcionales
