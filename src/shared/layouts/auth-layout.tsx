import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full p-6">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">TP</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Tortilla Plus</h1>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
