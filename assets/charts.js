/* Carga los 4 gráficos del dashboard */
import { supabase } from './auth.js';

function renderChart (canvasId, type, labels, data) {
  new Chart(
    document.getElementById(canvasId),
    { type,
      data: { labels, datasets:[{ data }] },
      options:{ responsive:true, maintainAspectRatio:false }
    }
  );
}

export async function cargarGraficos () {
  // 1. Stock por plataforma (ya existe)
  const { data: pl } = await supabase.rpc('fn_stock_plataformas');
  renderChart('grafPlata','bar', pl.map(x=>x.nombre_plataforma), pl.map(x=>x.total));

  // 2. Stock por género
  const { data: gn } = await supabase.rpc('fn_stock_generos');
  renderChart('grafGenero','doughnut', gn.map(x=>x.nombre_genero), gn.map(x=>x.total));

  // 3. Préstamos activos vs devueltos
  const { data: st } = await supabase.rpc('fn_prestamos_estado');
  renderChart('grafEstado','pie', st.map(x=>x.status), st.map(x=>x.qty));

  // 4. Top‑5 usuarios
  const { data: top } = await supabase.rpc('fn_top_usuarios');
  renderChart('grafTop','bar', top.map(x=>x.nombre_usuario), top.map(x=>x.total_prestamos));
}
