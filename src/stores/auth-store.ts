import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'RECRUITER' | 'CANDIDATE';
  image?: string | null;
  onboardingCompleted: boolean;
}

interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<{ success: boolean; redirectTo: string }>;
  register: (name: string, email: string, password: string, role?: string) => Promise<{ success: boolean; redirectTo: string }>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser, token: string) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      setUser: (user, token) => set({ user, token }),

      clearError: () => set({ error: null }),

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          const data = await res.json();

          if (!res.ok) {
            const msg = typeof data.error === 'string' ? data.error : 'Invalid credentials';
            set({ error: msg, isLoading: false });
            return { success: false, redirectTo: '' };
          }

          set({ user: data.user, token: data.token, isLoading: false });

          if (!data.user.onboardingCompleted) return { success: true, redirectTo: '/onboarding' };
          if (data.user.role === 'RECRUITER') return { success: true, redirectTo: '/recruiter/dashboard' };
          if (data.user.role === 'ADMIN') return { success: true, redirectTo: '/admin' };
          return { success: true, redirectTo: '/candidate/dashboard' };
        } catch {
          set({ error: 'Network error. Please try again.', isLoading: false });
          return { success: false, redirectTo: '' };
        }
      },

      register: async (name, email, password, role = 'CANDIDATE') => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch('/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role }),
          });

          const data = await res.json();

          if (!res.ok) {
            const msg = typeof data.error === 'string' ? data.error : 'Registration failed';
            set({ error: msg, isLoading: false });
            return { success: false, redirectTo: '' };
          }

          set({ user: data.user, token: data.token, isLoading: false });
          return { success: true, redirectTo: '/onboarding' };
        } catch {
          set({ error: 'Network error. Please try again.', isLoading: false });
          return { success: false, redirectTo: '' };
        }
      },

      logout: async () => {
        await fetch('/api/v1/auth/logout', { method: 'POST' });
        set({ user: null, token: null, error: null });
      },
    }),
    {
      name: 'interviewai-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
