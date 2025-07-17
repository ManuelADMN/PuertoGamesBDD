import { supabase } from './auth.js';
import { cargarTabla } from './datatables.js';

export async function prestarJuego (userId, gameId) {
  const { error } = await supabase.rpc('sp_prestar_juego',
                      { p_id_usuario:userId, p_id_videojuego:gameId });
  if (error) alert(error.message); else cargarTabla();
}

export async function devolverJuego (prestamoId) {
  const { error } = await supabase.rpc('sp_devolver_juego',
                      { p_id_prestamo: prestamoId });
  if (error) alert(error.message); else cargarTabla();
}
