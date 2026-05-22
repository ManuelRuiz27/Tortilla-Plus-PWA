# Tortilla Plus — PWA Frontend

Repositorio frontend de **Tortilla Plus — V1 Operativa Comercial**.

Este repo contendrá una sola PWA con módulos separados:

```txt
Tortilla Plus PWA
├─ POS Cajero
└─ PWA Gerente
```

## Alcance frontend

- Login.
- Selección de sucursal.
- POS cajero.
- Apertura de caja.
- Venta por kilo, monto, paquete y retail.
- Cobro efectivo, tarjeta y mixto.
- PWA gerente.
- Dashboard operativo.
- Caja, retiros, inventario, producción, productos, precios, clientes, rutas, facturación y reportes.
- Guards por sesión, sucursal, permisos y features del plan.

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

## Estructura base

```txt
/docs
├─ architecture/
├─ frontend/
└─ ui-ux/

/src
├─ app/
├─ api/
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
```

## Estado

Arquitectura inicial creada. Siguiente paso: **FE-0 — Frontend Foundation**.

## Regla operativa

No implementar pantallas finales antes de crear foundation: router, providers, API client, stores, guards, layouts y mocks base.
