<!-- README.md  ------------------------------------------------------------
     ✨ PuertoGames – Sistema de Videoclub con Supabase ✨
     Copia TODO este bloque tal‑cual en tu README.md
------------------------------------------------------------------------- -->

<h1 align="center">🎮&nbsp;PuertoGames — Sistema de Videoclub con Supabase</h1>

<p align="center">
  <em>Evaluación&nbsp;Parcial&nbsp;3 — versión <strong>profesional</strong></em><br>
  <sub>Full‑stack serverless • Tailwind CSS • Chart.js v4 • SweetAlert2 • DataTables • Supabase (Postgres + Auth + Storage)</sub>
</p>

<hr>

<h2>👥 Equipo</h2>

<ul>
  <li><strong>Guillermo Cerda</strong> — Back‑end SQL &amp; seguridad</li>
  <li><strong>Manuel Díaz</strong> — Integración Supabase &amp; autentificación</li>
  <li><strong>Martín Díaz</strong> — Front‑end (Tailwind + Chart.js) &amp; UX</li>
</ul>

<hr>

<h2>📸 Capturas de Pantalla</h2>

> ⚠️ Coloca tus imágenes en <code>public/assets/capturas/</code> y ajusta los nombres.<br>
> GitHub mostrará automáticamente las imágenes.

<p align="center">
  <img alt="Login" src="public/assets/capturas/login.png" width="400">
  <img alt="Dashboard" src="public/assets/capturas/dashboard.png" width="400">
</p>

<hr>

<h2>📑 Cumplimiento de la rúbrica</h2>

<table>
  <thead><tr><th>#</th><th>Requisito</th><th>Estado</th><th>Dónde revisarlo</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Registro + Login seguro (bcrypt, SweetAlert2)</td><td>✅</td><td><code>public/index.html</code>, RPC <code>fn_registrar_usuario</code> / <code>verificar_password</code></td></tr>
    <tr><td>2</td><td>Dashboard protegido + sesión persistente</td><td>✅</td><td><code>public/dashboard.html</code>, <code>assets/session.js</code></td></tr>
    <tr><td>3</td><td>4 gráficos con datos reales</td><td>✅</td><td>Funciones: <code>fn_stock_plataformas</code>, <code>fn_stock_generos</code>, <code>fn_prestamos_estado</code>, <code>fn_top_usuarios</code></td></tr>
    <tr><td>4‑a</td><td>≥ 7 consultas avanzadas</td><td>✅</td><td><code>sql/advanced_queries.sql</code></td></tr>
    <tr><td>4‑b</td><td>≥ 2 functions (dashboard)</td><td>✅</td><td>ver #3 (hay 4)</td></tr>
    <tr><td>4‑c</td><td>≥ 2 vistas</td><td>✅</td><td><code>vista_prestamos_detalle</code>, <code>vista_stock_generos</code>...</td></tr>
    <tr><td>4‑d</td><td>≥ 4 triggers</td><td>✅</td><td><code>tg_set_fecha_modificacion</code>, <code>tg_prevent_stock_negativo</code>, …</td></tr>
    <tr><td>4‑e</td><td>≥ 4 procedures</td><td>✅</td><td><code>sp_prestar_juego</code>, <code>sp_devolver_juego</code>, …</td></tr>
    <tr><td>5</td><td>≥ 2 tecnologías extra</td><td>✅</td><td>Tailwind CSS, SweetAlert2, DataTables.js, Day.js</td></tr>
    <tr><td>6</td><td>README profesional</td><td>🤏</td><td>¡Estás leyéndolo! <em>Añade tus capturas si falta.</em></td></tr>
  </tbody>
</table>

<hr>

<h2>📂 Estructura de carpetas</h2>

<pre><code>PuertoGames/
├─ public/
│  ├─ assets/
│  │  ├─ supa.js            # URL Supabase + anon‑key + headers genéricos
│  │  ├─ alert.js           # Funciones SweetAlert2
│  │  ├─ session.js         # getSession / clearSession
│  │  └─ capturas/          # ← tus imágenes .png / .gif
│  ├─ index.html            # Login / Registro
│  ├─ dashboard.html        # Dashboard protegido
│  └─ styles.css            # Tailwind compilado (solo producción)
└─ sql/
   ├─ schema.sql            # Tablas, RLS, triggers, funciones
   ├─ procedures.sql        # sp_* obligatorios
   ├─ demo_data.sql         # Datos de ejemplo (25 juegos + 20 préstamos)
   └─ advanced_queries.sql  # 7 consultas avanzadas
</code></pre>

<hr>

<h2>🗄️ Modelo relacional</h2>

<p>El proyecto se apoya en 5 tablas principales:</p>

<ul>
  <li><code>usuarios</code> — credenciales y roles (<em>bcrypt</em>)</li>
  <li><code>plataformas</code> — catálogo (PC, PS5…)</li>
  <li><code>generos</code> — catálogo (Acción, Deporte…)</li>
  <li><code>videojuegos</code> — inventario con FK a géneros y plataformas</li>
  <li><code>prestamos</code> — historial con estado <code>prestado/devuelto</code></li>
</ul>

Triggers garantizan coherencia de stock y marca de tiempo de modificación.

<hr>

<h2>🔐 Seguridad</h2>

<ol>
  <li><strong>Contraseñas bcrypt</strong>: <code>crypt(p_pass, gen_salt('bf'))</code>.</li>
  <li><strong>RLS</strong> en <code>usuarios</code>; política <code>select_self</code>.</li>
  <li><strong>RPC</strong> con <code>SECURITY DEFINER</code> para encapsular lógica.</li>
  <li><strong>Triggers</strong>: anti‑stock-negativo, auditoría de fechas y gestión automática de stock en préstamos.</li>
</ol>

<hr>

<h2>📊 Dashboard: gráficos <em>vs.</em> SQL</h2>

<table>
  <thead><tr><th>Gráfico (Chart.js)</th><th>Tipo</th><th>Fuente SQL</th></tr></thead>
  <tbody>
    <tr><td>Stock por plataforma</td><td>Bar</td><td><code>fn_stock_plataformas()</code></td></tr>
    <tr><td>Stock por género</td><td>Doughnut</td><td><code>fn_stock_generos()</code></td></tr>
    <tr><td>Préstamos activos vs devueltos</td><td>Pie</td><td><code>fn_prestamos_estado()</code></td></tr>
    <tr><td>Top 5 usuarios</td><td>Horizontal Bar</td><td><code>fn_top_usuarios()</code></td></tr>
  </tbody>
</table>

La tabla “Historial de préstamos” se nutre de la vista <code>vista_prestamos_detalle</code> y se presenta con DataTables.js (búsqueda, ordenación, exportación).

<hr>

<h2>⚙️ Procedimientos de negocio</h2>

<ul>
  <li><code>sp_prestar_juego</code> — crea un préstamo y descuenta stock.</li>
  <li><code>sp_devolver_juego</code> — marca préstamo como devuelto y repone stock.</li>
  <li><code>sp_new_game</code> — alta de videojuego (admin).</li>
  <li><code>sp_delete_game</code> — baja de videojuego (admin).</li>
</ul>

<hr>

<h2>🚀 Cómo desplegarlo en 3 pasos</h2>

<ol>
  <li><strong>Clonar y servir estáticos</strong>
  <pre><code>git clone https://github.com/tu-user/PuertoGamesBDD.git
cd PuertoGamesBDD
npx live-server public   # ó npx serve public
</code></pre></li>

  <li><strong>Importar la base en Supabase</strong>
  <ol>
    <li>Entra en <em>Database → SQL Editor</em>.</li>
    <li>Ejecuta, en orden: <code>schema.sql → procedures.sql → demo_data.sql → advanced_queries.sql</code>.</li>
    <li>Cada script finaliza con:<br>
    <code>select pg_notify('pgrst','reload schema');</code></li>
  </ol></li>

  <li><strong>Abrir</strong> <code>http://localhost:8080</code>, registrarte e ingresar.</li>
</ol>

<hr>

<h2>🛡️ Buenas prácticas adicionales</h2>

<ul>
  <li>Índice <code>users_email_lower_idx</code> para email case‑insensitive.</li>
  <li>Solo <em>anon‑key</em> en el cliente; <em>service_role</em> permanece privada.</li>
  <li>Estructura modular: SQL separado del front, fácil de versionar.</li>
  <li>Preparado para añadir Supabase Storage (portadas de juegos) y WebSockets.</li>
</ul>

<hr>

<h2 align="center">✔️ Estado final: ¡100 % cumplido!</h2>

<p align="center">
  PuertoGames demuestra una solución <em>full‑stack serverless</em> con<br>
  seguridad real, dashboard interactivo y un back‑end SQL avanzado.<br>
  <strong>¡Gracias por revisar el proyecto — y que comience el juego!</strong> 🎉
</p>
