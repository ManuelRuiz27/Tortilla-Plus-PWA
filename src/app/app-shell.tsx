import { RouterProvider } from 'react-router-dom';
import { Providers } from './providers';
import { router } from './router';

export function AppShell() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}
