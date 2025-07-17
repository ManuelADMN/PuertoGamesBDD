import { supabase } from './auth.js';

let table;
export async function cargarTabla () {
  const { data, error } = await supabase
    .from('vista_prestamos_detalle')
    .select('*')
    .order('fecha_prestamo',{ ascending:false });

  if (error) { console.error(error); return; }

  if (table) {
    table.clear().rows.add(data).draw();
    return;
  }
  table = $('#tbl-loans').DataTable({
    data,
    columns:[
      { data:'usuario' },
      { data:'videojuego' },
      { data:'fecha_prestamo',
        render:d=> d? dayjs(d).format('DD/MM/YYYY HH:mm') : '' },
      { data:'fecha_devolucion',
        render:d=> d? dayjs(d).format('DD/MM/YYYY HH:mm') : 'Pendiente' }
    ]
  });
}
