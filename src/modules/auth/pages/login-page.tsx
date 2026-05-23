import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../shared/stores/auth.store';

export function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const form = e.target as HTMLFormElement;
      const email = (form.elements[0] as HTMLInputElement).value;
      const password = (form.elements[1] as HTMLInputElement).value;

      const { httpClient } = await import('../../../api/http-client');
      const response = await httpClient.post<any>('/auth/login', { email, password });
      
      // Guardar tokens temporalmente para que httpClient.get los use
      login({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        user: null as any // Temporal
      });

      // Obtener el perfil del usuario (roles, nombre, etc)
      const userProfile = await httpClient.get<any>('/auth/me');
      
      // Actualizar el store con el usuario real
      login({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        user: userProfile
      });
      navigate('/app/select-branch');
    } catch (error) {
      alert('Error de autenticación. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-center mb-6">Iniciar Sesión</h2>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input 
            type="email" 
            defaultValue="demo@tortillaplus.com"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
          <input 
            type="password" 
            defaultValue="password"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
        >
          {loading ? 'Iniciando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
