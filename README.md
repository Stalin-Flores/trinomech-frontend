# TrinoMech · Frontend Angular

Frontend en Angular 18 + Tailwind CSS 3 conectado al backend Spring Boot de TrinoMech.

## 🧱 Stack
- Angular 18 (standalone components, signals)
- Tailwind CSS 3
- TypeScript 5.5
- Tipografía: Outfit + JetBrains Mono

## 🚀 Cómo correrlo

### 1) Requisitos
- Node.js 18+ instalado
- El backend Spring Boot corriendo en `http://localhost:8080`

### 2) Instalar dependencias
Dentro de la carpeta del proyecto:
```bash
npm install
```

### 3) Levantar el dev server
```bash
npm start
```
La app abre en `http://localhost:4200`.

### 4) Probar el login
Usa cualquiera de estas credenciales:

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `admin123` | Administrador |
| `danny` | `danny123` | Operador |

## 📁 Estructura

```
src/
├── app/
│   ├── app.component.ts         # Root con <router-outlet/>
│   ├── app.config.ts            # Providers (Router, HttpClient + interceptor)
│   ├── app.routes.ts            # Rutas con lazy loading
│   ├── core/
│   │   ├── services/
│   │   │   └── auth.service.ts  # Login, logout, token, signals de estado
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts  # Añade Bearer token + maneja 401
│   │   └── guards/
│   │       └── auth.guard.ts    # Bloquea rutas sin sesión
│   └── features/
│       ├── auth/login/          # Pantalla de login
│       └── dashboard/           # Dashboard simple post-login
├── environments/
│   ├── environment.ts
│   └── environment.development.ts  # apiUrl: http://localhost:8080/api
├── index.html
├── main.ts
└── styles.css                   # Tailwind base
```

## 🔌 Cómo se conecta al backend

- El servicio `AuthService` hace `POST /api/auth/login` y guarda el token JWT en `localStorage`.
- El `authInterceptor` añade automáticamente el header `Authorization: Bearer <token>` a todas las peticiones siguientes.
- El `authGuard` protege las rutas internas y redirige a `/login` si no hay sesión.
- Si el backend devuelve `401` en alguna petición autenticada, el interceptor hace logout automático.

## 🔧 Cambiar la URL del backend

Edita `src/environments/environment.development.ts`:
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'  // ← cambiar aquí
};
```
