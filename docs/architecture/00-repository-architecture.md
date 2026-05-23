# Tortilla Plus PWA — Repository Architecture V0.1

## Objetivo

Definir la arquitectura base del repositorio frontend antes de implementar vistas.

## Decisión principal

V1 usará una sola PWA React con módulos separados:

```txt
/src/modules/pos
/src/modules/manager
```

No separar todavía en dos aplicaciones. Separarlas ahora aumenta fricción operativa y duplica auth, guards, API client y configuración PWA.

## Stack objetivo

```txt
React
Vite
TypeScript
React Router
TanStack Query
Zustand
Zod
Tailwind CSS
shadcn/ui
vite-plugin-pwa
```

## Estructura raíz

```txt
/docs
/src
/public
```

## Estructura `/docs`

```txt
/docs
├─ architecture/
│  └─ 00-repository-architecture.md
├─ frontend/
│  ├─ 00-frontend-handoff-index.md
│  ├─ 01-frontend-foundation.md
│  ├─ 02-pos-flow.md
│  ├─ 03-pos-components-contract.md
│  ├─ 04-manager-pwa-flow.md
│  └─ 05-frontend-sprint-plan.md
└─ ui-ux/
   ├─ 01-uiux-design-handoff.md
   ├─ 02-uiux-screen-specification.md
   └─ 03-uiux-wireframe-checklist.md
```

## Estructura `/src`

```txt
/src
├─ app/
│  ├─ router.tsx
│  ├─ providers.tsx
│  ├─ query-client.ts
│  └─ app-shell.tsx
├─ api/
│  ├─ http-client.ts
│  ├─ api-error.ts
│  ├─ auth.api.ts
│  ├─ subscriptions.api.ts
│  ├─ branches.api.ts
│  ├─ cash.api.ts
│  ├─ sales.api.ts
│  ├─ products.api.ts
│  ├─ inventory.api.ts
│  ├─ customers.api.ts
│  ├─ delivery.api.ts
│  ├─ billing.api.ts
│  └─ reports.api.ts
├─ modules/
│  ├─ auth/
│  ├─ branch/
│  ├─ pos/
│  └─ manager/
├─ shared/
│  ├─ components/
│  ├─ layouts/
│  ├─ hooks/
│  ├─ stores/
│  ├─ schemas/
│  ├─ types/
│  └─ utils/
└─ styles/
   └─ globals.css
```

## Módulos

### Auth

Responsable de login, sesión, refresh, logout y usuario actual.

### Branch

Responsable de selección de sucursal activa.

### POS

Responsable de operación de cajero: caja, venta, cobro y errores operativos.

### Manager

Responsable de operación gerente: dashboard, caja, inventario, producción, productos, clientes, rutas, facturación y reportes.

## Stores globales mínimos

- `auth.store.ts`
- `branch.store.ts`
- `cash.store.ts`

## Guards mínimos

- `AuthGuard`
- `BranchGuard`
- `PermissionGuard`
- `FeatureGuard`

## Reglas

1. Frontend valida para UX; backend decide reglas de negocio.
2. No mezclar lógica de POS con gerente.
3. No implementar offline completo en V1.
4. No iniciar por dashboards; iniciar por foundation y POS caja.
5. Todo error backend debe mapearse a mensaje operativo.
