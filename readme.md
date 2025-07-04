# 🎮 Videoclub – Supabase Starter

Proyecto demostrativo que cumple **todos** los requisitos del enunciado:

* base de datos relacional en Supabase
* autenticación segura con contraseñas bcrypt
* consultas SQL intermedias + vistas, funciones y triggers
* frontend responsivo (Tailwind) con gráficos Chart.js y mensajes SweetAlert2

---

## 📂 Estructura

```
public/
├── assets/
│   ├── supa.js          ← URL + anon-key + headers comunes
│   └── alert.js         ← helpers SweetAlert2
├── index.html           ← login / registro
├── dashboard.html       ← gráficos + logout
└── schema.sql           ← script completo de BD
```

---

## 1  Base de datos (≥ 5 tablas)

```sql
create table public.usuarios   ( -- PK serial, email único, bcrypt
  id serial primary key,
  email varchar(100) unique not null,
  password_hash text not null,
  rol varchar(20) check (rol in ('usuario','admin')),
  fecha_creacion timestamp default now()
);

create table public.plataformas (
  id serial primary key,
  nombre varchar(50) unique not null
);

create table public.generos (
  id serial primary key,
  nombre varchar(50) unique not null
);

create table public.videojuegos (
  id serial primary key,
  titulo varchar(100) not null,
  id_genero int references public.generos(id),
  id_plataforma int references public.plataformas(id),
  fecha_lanzamiento date,
  stock int default 1 check (stock >= 0)
);

create table public.prestamos (            -- FK a usuarios y videojuegos
  id serial primary key,
  id_usuario int references public.usuarios(id),
  id_videojuego int references public.videojuegos(id),
  fecha_prestamo timestamp default now(),
  fecha_devolucion timestamp,
  estado varchar(20) check (estado in ('prestado','devuelto')),
  fecha_modificacion timestamp default now()
);
```

*Se insertan datos demo para 4 videojuegos, 5 géneros y 4 plataformas.*

---

## 2  Autenticación (login + registro)

### RPC de registro con **bcrypt**

```sql
create or replace function public.fn_registrar_usuario(p_email text, p_pass text)
returns json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare v_id int;
begin
  insert into public.usuarios(email,password_hash,rol)
  values(lower(p_email), crypt(p_pass, gen_salt('bf')), 'usuario')
  returning id into v_id;

  return json_build_object('success',true,
           'usuario',json_build_object('id',v_id,'email',lower(p_email),'rol','usuario'));
exception
  when unique_violation then
    return json_build_object('success',false,'message','El correo ya está registrado');
end $$;
grant execute on function public.fn_registrar_usuario(text,text) to anon;
```

### Formulario y validación (extracto de `index.html`)

```html
<form id="loginTab" ...>
  <input name="email" type="email" placeholder="Correo" required>
  <input name="password" type="password" placeholder="Contraseña" required>
  ...
</form>

<script type="module">
import { SUPABASE_URL, HEADERS } from './assets/supa.js';
import { alertError, alertSuccess, showLoader, closeLoader } from './assets/alert.js';

document.getElementById('loginTab').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const { email, password } = e.target;
  showLoader();
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/verificar_password`,{
    method:'POST', headers:HEADERS,
    body: JSON.stringify({ correo_input: email.value, password_input: password.value })
  });
  const d = await r.json(); closeLoader();
  d.success ? alertSuccess('Bienvenido', ()=>location='dashboard.html')
            : alertError(d.message);
});
</script>
```

*SweetAlert2 muestra pop-ups de éxito / error; el botón 👁️ permite ver la contraseña.*

---

## 3  Consultas SQL avanzadas

| Categoría    | Ejemplo en `schema.sql`                                                                                                      |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| **JOIN**     | `select u.email, v.titulo from prestamos p join usuarios u on u.id=p.id_usuario join videojuegos v on v.id=p.id_videojuego;` |
| **CASE**     | Clasificación de stock en `videojuegos` (`Sin stock / Bajo / Suficiente`).                                                   |
| **HAVING**   | Plataformas con > 1 juego.                                                                                                   |
| **EXISTS**   | Usuarios con préstamo activo.                                                                                                |
| **ANY**      | Juegos con stock inferior al promedio de su plataforma.                                                                      |
| **VIEW**     | `vista_prestamos_usuarios`, `vista_stock_plataformas`.                                                                       |
| **FUNCTION** | `fn_stock_plataformas()` y `fn_stock_generos()`.                                                                             |
| **TRIGGER**  | `tg_set_fecha_modificacion`, `tg_prevent_stock_negativo`, `tg_reducir_stock`, `tg_incrementar_stock`.                        |

---

## 4  Frontend + Chart.js

### Doble gráfico en `dashboard.html`

```html
<main class="grid md:grid-cols-2 gap-8 p-6">
  <div class="h-72"><canvas id="grafPlata"></canvas></div>
  <div class="h-72"><canvas id="grafGenero"></canvas></div>
</main>

<script type="module">
const resPl = await fetch(`${URL}/rpc/fn_stock_plataformas`,{method:'POST',headers:H,body:'{}'});
const pl = await resPl.json();
new Chart('#grafPlata',{type:'bar',data:{labels:pl.map(x=>x.nombre_plataforma),
                                         datasets:[{data:pl.map(x=>x.total)}]},
                       options:{maintainAspectRatio:false}});

const resGn = await fetch(`${URL}/rpc/fn_stock_generos`,{method:'POST',headers:H,body:'{}'});
const gn = await resGn.json();
new Chart('#grafGenero',{type:'doughnut',
                        data:{labels:gn.map(x=>x.nombre_genero),
                              datasets:[{data:gn.map(x=>x.total)}]},
                        options:{maintainAspectRatio:false}});
</script>
```

*Los gráficos son responsivos; una barra para stock por plataforma y un doughnut para stock por género.*

---

## ▶️ Cómo ponerlo en marcha

1. **Clonar y servir estáticos**

```bash
git clone <repo>
cd videoclub-supabase
npx serve public       # ó live-server public
```

2. **Importar la base**

* Copia el contenido de `schema.sql` en el **SQL Editor** de tu proyecto
  Supabase y ejecuta “Run”.
* Ejecuta también:

```sql
notify pgrst, 'reload schema';   -- refresca el esquema REST
```

3. **Abrir** `http://localhost:3000`
   Regístrate → inicia sesión → visualiza el dashboard.

---

## 🔐 Seguridad y buenas prácticas

* Contraseñas hash bcrypt (`crypt()` + `gen_salt('bf')`).
* RPC ejecutadas con `SECURITY DEFINER` para evitar exponer lógica interna.
* Solo se usa la **anon-key** en el cliente; no se exponen service keys.
* Checks y triggers protegen consistencia de stock.

---

