import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthGuard } from '../shared/components/guards/auth-guard';
import { BranchGuard } from '../shared/components/guards/branch-guard';
import { AuthLayout } from '../shared/layouts/auth-layout';
import { POSLayout } from '../shared/layouts/pos-layout';
import { ManagerLayout } from '../shared/layouts/manager-layout';
import { LoginPage } from '../modules/auth/pages/login-page';
import { SelectBranchPage } from '../modules/branch/pages/select-branch-page';
import { PosRouterPage } from '../modules/pos/pages/pos-router-page';
import { OpenCashPage } from '../modules/pos/pages/open-cash-page';
import { SalePage } from '../modules/pos/pages/sale-page';
import { DashboardPage } from '../modules/manager/pages/dashboard-page';
import { InventoryPage } from '../modules/manager/pages/inventory-page';
import { ProductsPage } from '../modules/manager/pages/products-page';
import { PricesPage } from '../modules/manager/pages/prices-page';
import { CustomersPage } from '../modules/manager/pages/customers-page';
import { CustomerDetailsPage } from '../modules/manager/pages/customer-details-page';
import { RoutesPage } from '../modules/manager/pages/routes-page';
import { BillingPage } from '../modules/manager/pages/billing-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/app" replace />
  },
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />
      }
    ]
  },
  {
    path: '/app',
    element: <AuthGuard />,
    children: [
      {
        index: true,
        element: <Navigate to="/app/select-branch" replace />
      },
      {
        path: 'select-branch',
        element: <SelectBranchPage />
      },
      {
        path: 'pos',
        element: <BranchGuard />,
        children: [
          {
            index: true,
            element: <PosRouterPage />
          },
          {
            element: <POSLayout />,
            children: [
              {
                path: 'cash/open',
                element: <OpenCashPage />
              },
              {
                path: 'sale',
                element: <SalePage />
              }
            ]
          }
        ]
      },
      {
        path: 'manager',
        element: <BranchGuard />,
        children: [
          {
            element: <ManagerLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="/app/manager/dashboard" replace />
              },
              {
                path: 'dashboard',
                element: <DashboardPage />
              },
              {
                path: 'inventory',
                element: <InventoryPage />
              },
              {
                path: 'products',
                element: <ProductsPage />
              },
              {
                path: 'prices',
                element: <PricesPage />
              },
              {
                path: 'customers',
                element: <CustomersPage />
              },
              {
                path: 'customers/:id',
                element: <CustomerDetailsPage />
              },
              {
                path: 'routes',
                element: <RoutesPage />
              },
              {
                path: 'billing',
                element: <BillingPage />
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <div className="p-8 text-center text-red-500 font-bold">404 - Not Found</div>
  }
]);
