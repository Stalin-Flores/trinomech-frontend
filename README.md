# TrinoMech · Frontend Angular

Frontend en Angular 18 + Tailwind CSS 3 conectado al backend Spring Boot de TrinoMech.

## 🧱 Stack
- Angular 18 (NgModules + lazy loading por módulos, signals)
- Tailwind CSS 3
- TypeScript 5.5
- Tipografía: Outfit + JetBrains Mono
- SweetAlert2 (alertas mejoradas)

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
│   ├── app.module.ts            # Módulo raíz
│   ├── app-routing.module.ts    # Rutas principales con lazy loading
│   ├── app.component.ts         # Root con <router-outlet/>
│   ├── core/
│   │   ├── services/
│   │   │   └── auth.service.ts  # Login, logout, token, signals de estado
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts  # Añade Bearer token + maneja 401
│   │   └── guards/
│   │       └── auth.guard.ts    # Bloquea rutas sin sesión
│   └── features/
│       ├── auth/
│       │   ├── auth.module.ts
│       │   ├── auth-routing.module.ts
│       │   └── login/
│       ├── dashboard/
│       │   ├── dashboard.module.ts
│       │   ├── dashboard-routing.module.ts
│       │   └── dashboard.component.ts
│       └── materiales/
│           ├── materiales.module.ts
│           ├── materiales-routing.module.ts
│           └── materiales.component.ts
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

## 📋 Cambios y Configuraciones Realizadas

### ✅ 1. Integración de SweetAlert2
Se agregó **SweetAlert2** para reemplazar los alertas nativos del navegador con alertas más amigables y personalizadas.

**Instalación:**
```bash
npm install sweetalert2
```

**Componentes actualizados:**
- `src/app/features/materiales/materiales.component.ts`

**Alertas implementadas:**
- ✓ Confirmación antes de eliminar material (con ícono ⚠️)
- ✓ Éxito al eliminar material (con ícono ✓)
- ✓ Error al eliminar material (con ícono ✗)
- ✓ Éxito al actualizar/guardar cambios (con ícono ✓)
- ✓ Error al actualizar material (con ícono ✗)

### ✅ 2. Configuración del Puerto Backend
El backend está configurado para correr en **puerto 8080** (por defecto en Spring Boot).

**Configuración en backend:**
```properties
# File: src/main/resources/application.properties
server.port=8080
```

**Configuración en frontend:**
```ts
// File: src/environments/environment.development.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'  // Base URL para todas las peticiones
};
```

### ✅ 3. Servicio de Materiales
Se utiliza el servicio `MaterialService` para manejar todas las operaciones CRUD con materiales.

**Endpoints disponibles:**
- `GET /api/materiales` - Listar todos los materiales
- `POST /api/materiales` - Crear nuevo material
- `GET /api/materiales/{id}` - Obtener material por ID
- `PUT /api/materiales/{id}` - Actualizar material
- `DELETE /api/materiales/{id}` - Eliminar material

### ✅ 4. Componente de Materiales - MaterialesComponent
Ubicación: `src/app/features/materiales/materiales.component.ts`

**Funcionalidades:**
- 📋 Listar todos los materiales con paginación
- 🔍 Búsqueda por nombre, proveedor, ubicación
- 🏷️ Filtrar por tipo (Fibra Óptica, HFC)
- 👁️ Ver detalles de cada material
- ✏️ Editar material con validación de campos numéricos
- 🗑️ Eliminar material con confirmación SweetAlert2
- 📄 Paginación configurable (4, 10, 20 por página)

**Signals utilizadas:**
```ts
loading = signal(true);                    // Estado de carga
errorMsg = signal<string | null>(null);   // Mensajes de error
materiales = signal<Material[]>([]);      // Lista de materiales
selectedMaterial = signal<Material | null>(null);  // Material en detalle
editingMaterial = signal<Material | null>(null);   // Material en edición
searchQuery = signal('');                 // Búsqueda actual
tipoFiltro = signal('Todos');            // Filtro de tipo
paginaActual = signal(1);                // Página actual
pageSize = signal(10);                   // Tamaño de página
```

**Computed signals:**
- `materialesFiltrados` - Materiales después de aplicar filtros y búsqueda
- `materialesPaginados` - Materiales de la página actual
- `totalPaginas` - Total de páginas disponibles
- `totalRegistrosPaginaInicio` - Número de registro inicial
- `totalRegistrosPaginaFin` - Número de registro final

### ✅ 5. Interfaz Material
```ts
interface Material {
  idMaterial: number;
  nombreMaterial: string;
  tipo: 'Fibra Optica' | 'HFC';
  unidadMedida: string;
  stockMinimo: number;
  stockActual: number;
  ubicacion: string;
  proveedor: string;
  costoUnitario: number;
}
```

### ✅ 6. Manejo de Errores HTTP
El interceptor `authInterceptor` maneja:
- Agregar token Bearer a todas las peticiones
- Redirigir a login si la respuesta es 401 (no autorizado)
- Logging automático de errores

### 🎨 Estilos y Diseño
Todos los componentes usan **Tailwind CSS 3** con:
- Color primario: Cyan (`cyan-500`, `cyan-700`)
- Color secundario: Ámbar para ediciones
- Color de peligro: Rojo (`rose-500`) para eliminaciones
- Animaciones y transiciones suaves
- Diseño responsivo (mobile-first)

### 📦 Dependencias principales
```json
{
  "dependencies": {
    "@angular/animations": "^18.0.0",
    "@angular/common": "^18.0.0",
    "@angular/compiler": "^18.0.0",
    "@angular/core": "^18.0.0",
    "@angular/forms": "^18.0.0",
    "@angular/platform-browser": "^18.0.0",
    "@angular/platform-browser-dynamic": "^18.0.0",
    "@angular/router": "^18.0.0",
    "rxjs": "~7.8.0",
    "sweetalert2": "^11.x.x",
    "tslib": "^2.3.0",
    "zone.js": "~0.14.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^18.0.0",
    "@angular/cli": "^18.0.0",
    "@angular/compiler-cli": "^18.0.0",
    "@types/node": "^22.0.0",
    "tailwindcss": "^3.3.0",
    "typescript": "~5.5.0"
  }
}
```

## 🔒 Seguridad y Autenticación

- **JWT Bearer Token**: Se envía en cada petición autenticada
- **localStorage**: Se usa para guardar el token (considera usar sessionStorage en producción)
- **authGuard**: Protege rutas que requieren autenticación
- **401 Auto-logout**: Si el token expira, se hace logout automático
