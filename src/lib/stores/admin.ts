import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  isAuthenticated: boolean;
  adminEmail: string | null;
  login: (email: string) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      adminEmail: null,
      login: (email) => set({ isAuthenticated: true, adminEmail: email }),
      logout: () => set({ isAuthenticated: false, adminEmail: null }),
    }),
    { name: 'nabiart-admin' }
  )
);
