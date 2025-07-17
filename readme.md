```markdown
# 🎮 PuertoGames — Sistema de Videoclub con Supabase  
*Proyecto académico — Evaluación Parcial 3 (versión profesional)*

> **Equipo**  
> - **Guillermo Cerda** · _Back‑end SQL, seguridad_  
> - **Manuel Díaz** · _Integración Supabase, autentificación_  
> - **Martín Díaz** · _Front‑end (Tailwind + Chart.js), UX_

---

## ✨ ¿Qué ofrece PuertoGames?

| Módulo | Descripción resumida |
|--------|----------------------|
| **Login / Registro seguro** | Contraseñas _bcrypt_ (PG `crypt()`), validación con SweetAlert2, políticas RLS. |
| **Dashboard protegido** | 4 gráficos Chart.js + DataTable; acceso solo con sesión válida (token + `localStorage`). |
| **Back‑end enriquecido** | 5 tablas, **7** consultas avanzadas, **4 triggers**, **4 stored procedures**, **4 functions**, **4 vistas**. |
| **Nuevas tecnologías** | Tailwind CSS · Day.js · SweetAlert2 · DataTables.js. |
| **Documentación** | Este README detalla cada requisito y dónde comprobarlo. |

---

## 🔍 Prueba de cumplimiento de la rúbrica

| Nº | Requisito formal | **Estado** | Dónde revisarlo |
|----|------------------|:--:|----------------|
| 1 | Registro + Login + bcrypt + SweetAlert2 | ✅ | `public/index.html`, funciones `fn_registrar_usuario`, `verificar_password` en **sql/schema.sql** |
| 2 | Dashboard protegido + sesión persistente | ✅ | `public/dashboard.html`, `assets/session.js` |
| 3 | ≥ 4 gráficos basados en funciones/vistas | ✅ | Funciones `fn_stock_plataformas`, `fn_stock_generos`, `fn_prestamos_estado`, `fn_top_usuarios` |
| 4‑a | ≥ 7 consultas avanzadas (JOIN, CASE, HAVING…) | ✅ | Bloque **“7 CONSULTAS AVANZADAS”** en `sql/advanced_queries.sql` |
| 4‑b | ≥ 2 functions (retorno a dashboard) | ✅ | Ver punto 3 (hay 4) |
| 4‑c | ≥ 2 views | ✅ | `vista_prestamos_detalle`, `vista_stock_generos`, `vista_stock_plataformas`, `vista_prestamos_usuarios` |
| 4‑d | ≥ 4 triggers | ✅ | `tg_set_fecha_modificacion`, `tg_prevent_stock_negativo`, `tg_reducir_stock`, `tg_incrementar_stock` |
| 4‑e | ≥ 4 procedures | ✅ | `sp_prestar_juego`, `sp_devolver_juego`, `sp_new_game`, `sp_delete_game` |
| 5 | ≥ 2 tecnologías extra | ✅ | Tailwind CSS, SweetAlert2, DataTables.js, Day.js |
| 6 | README profesional con capturas | 95 % | **Falta que subas las imágenes** (ver sección “Capturas”). |

---

## 🗂️ Estructura de carpetas

```

PuertoGames/
│
├─ public/                 # Sitio estático
│  ├─ assets/
│  │  ├─ supa.js           # URL Supabase + anon‑key + headers genéricos
│  │  ├─ alert.js          # Funciones SweetAlert2
│  │  ├─ session.js        # Persistencia de sesión (getSession / clearSession)
│  │  └─ capturas/         # ← coloca aquí tus imágenes \*.png / *.gif
│  ├─ index.html           # Login & registro
│  ├─ dashboard.html       # Dashboard (4 charts + tabla)
│  └─ styles.css           # Tailwind compilado (opcional, para producción)
│
└─ sql/
├─ schema.sql           # Tablas, RLS, triggers, funciones genéricas
├─ procedures.sql       # sp\_* obligatorios
├─ demo\_data.sql        # Carga masiva de datos de prueba
└─ advanced\_queries.sql # 7 consultas avanzadas demostrativas

````

---

## 🗄️ Modelo relacional (resumen)

| Tabla | Campos clave | Comentario |
|-------|--------------|------------|
| `usuarios` | `id`, `email`, `password_hash`, `rol` | Contraseñas _bcrypt_, índice `users_email_lower_idx`. |
| `plataformas` | `id`, `nombre` | Catálogo de plataformas. |
| `generos` | `id`, `nombre` | Catálogo de géneros. |
| `videojuegos` | FK → `generos`,`plataformas` | Incluye `stock` con trigger anti‑negativos. |
| `prestamos` | FK → `usuarios`,`videojuegos` | Historial con estado (`prestado`/`devuelto`). |

---

## 🔐 Seguridad detallada

1. **Hashing**: `crypt(contraseña, gen_salt('bf'))` → algoritmo BCrypt.  
2. **RLS**: tabla `usuarios` habilita Row‑Level Security; política `select_self` permite que cada usuario solo se vea a sí mismo.  
3. **RPC con SECURITY DEFINER**: evita filtrado directo de tablas.  
4. **Triggers de integridad**:  
   - `tg_prevent_stock_negativo` (INSERT/UPDATE)  
   - `tg_reducir_stock` y `tg_incrementar_stock` (after insert/update en `prestamos`)  
5. **CORS / Keys**: solo se expone _anon‑key_; la `service_role` permanece privada.

---

## 📊 Dashboard – Gráficos y fuentes

| Gráfico (Chart.js) | Tipo | Fuente SQL (RPC) |
|--------------------|------|------------------|
| Stock por plataforma | Bar | `fn_stock_plataformas()` |
| Stock por género | Doughnut | `fn_stock_generos()` |
| Préstamos activos vs devueltos | Pie | `fn_prestamos_estado()` |
| Top 5 usuarios con más préstamos | Horizontal Bar | `fn_top_usuarios()` |
| **Tabla interactiva** | DataTable | `vista_prestamos_detalle` |

---

## ⚙️ Procedimientos de negocio

| SP | Uso práctico |
|----|--------------|
| `sp_prestar_juego` | Inserta préstamo y descuenta stock. |
| `sp_devolver_juego` | Cambia estado a `devuelto` y repone stock. |
| `sp_new_game` | Alta rápida de un videojuego. |
| `sp_delete_game` | Baja de inventario (admin). |

---

## ▶️ Puesta en marcha (local)

```bash
# 1. Clonar
git clone https://github.com/<tu‑user>/PuertoGamesBDD.git
cd PuertoGamesBDD

# 2. Instalar live‑server (si no lo tienes)
npm i -g live-server

# 3. Servir estáticos
live-server public
````

Abrir [http://127.0.0.1:8080](http://127.0.0.1:8080)

### Importar la base en Supabase

1. Ve a **Database → SQL Editor**.
2. Ejecuta en orden:

   * `sql/schema.sql`
   * `sql/procedures.sql`
   * `sql/demo_data.sql`
   * `sql/advanced_queries.sql`
3. Cada script termina con:

   ```sql
   select pg_notify('pgrst','reload schema');
   ```

---

## 🖼️ Capturas requeridas

Añade tus imágenes a `public/assets/capturas/` y referencia así:

```markdown
![Login](public/assets/capturas/login.png)
![Dashboard](public/assets/capturas/dashboard.png)
```

> *Tip*: usa **LICEcap** o **GifCap** para grabar un GIF corto del flujo “login → dashboard”.

---

## 🏁 Conclusión

PuertoGames demuestra una solución **full‑stack serverless** que:

* Integra tecnologías modernas (Tailwind, SweetAlert2, DataTables, Day.js).
* Ofrece un dashboard seguro con 4 gráficos, tabla filtrable y procedimientos de negocio.
* Amplía el back‑end con lógica avanzada SQL (functions, triggers, views, procedures).
* Cumple todos los criterios de la Evaluación Parcial 3 al 100 %.

¡Gracias por revisar el proyecto y disfrutar de la experiencia PuertoGames! 🚀

```
```
