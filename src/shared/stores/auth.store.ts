import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
  organizationId: string;
  branches?: any[];
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: CurrentUser;
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: CurrentUser | null;
  isAuthenticated: boolean;
  login: (payload: LoginResponse) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      
      login: (payload: LoginResponse) => {
        set({
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
          user: payload.user,
          isAuthenticated: true,
        });
      },
      
      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'tortillaplus-auth',
    }
  )
);
