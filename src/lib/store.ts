import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { encrypt, decrypt, generateId } from './encryption';

export interface Token {
  id: string;
  service: string;
  token: string;
  description: string;
  category: string;
  status: 'ACTIVE' | 'EXPIRED' | 'EXPIRING';
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'COPY' | 'REVEAL' | 'PARSE';
  service: string;
  timestamp: string;
  details?: string;
}

interface ToknState {
  // Auth state
  isAuthenticated: boolean;
  user: { email: string; name: string } | null;
  
  // Theme
  theme: 'dark' | 'light';
  
  // Tokens
  tokens: Token[];
  
  // Activities
  activities: Activity[];
  
  // Auth actions
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (email: string, name: string, password: string) => boolean;
  
  // Theme actions
  toggleTheme: () => void;
  
  // Token actions
  addToken: (token: Omit<Token, 'id' | 'createdAt' | 'updatedAt'>) => Token;
  updateToken: (id: string, updates: Partial<Token>) => void;
  deleteToken: (id: string) => void;
  getToken: (id: string) => Token | undefined;
  
  // Activity actions
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  clearActivities: () => void;
  
  // Export actions
  exportToEnv: () => string;
  exportToJson: () => string;
}

export const useToknStore = create<ToknState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      theme: 'dark',
      tokens: [],
      activities: [],
      
      // Auth actions
      login: (email: string, _password: string) => {
        // Demo mode - accept any email/password
        if (email && _password.length >= 4) {
          set({
            isAuthenticated: true,
            user: { email, name: email.split('@')[0] },
          });
          get().addActivity({
            action: 'CREATE',
            service: 'SESSION',
            details: 'User logged in',
          });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
        });
      },
      
      register: (email: string, name: string, _password: string) => {
        // Demo mode - accept any registration
        if (email && _password.length >= 4) {
          set({
            isAuthenticated: true,
            user: { email, name },
          });
          get().addActivity({
            action: 'CREATE',
            service: 'ACCOUNT',
            details: 'New account created',
          });
          return true;
        }
        return false;
      },
      
      // Theme actions
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
        document.documentElement.classList.toggle('light', newTheme === 'light');
      },
      
      // Token actions
      addToken: (tokenData) => {
        const now = new Date().toISOString();
        const newToken: Token = {
          id: generateId(),
          ...tokenData,
          token: encrypt(tokenData.token),
          createdAt: now,
          updatedAt: now,
        };
        
        set((state) => ({
          tokens: [...state.tokens, newToken],
        }));
        
        get().addActivity({
          action: 'CREATE',
          service: tokenData.service,
          details: 'Token added',
        });
        
        return newToken;
      },
      
      updateToken: (id, updates) => {
        set((state) => ({
          tokens: state.tokens.map((t) =>
            t.id === id
              ? {
                  ...t,
                  ...updates,
                  token: updates.token ? encrypt(updates.token) : t.token,
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        }));
        
        const token = get().getToken(id);
        if (token) {
          get().addActivity({
            action: 'UPDATE',
            service: token.service,
            details: 'Token updated',
          });
        }
      },
      
      deleteToken: (id) => {
        const token = get().getToken(id);
        set((state) => ({
          tokens: state.tokens.filter((t) => t.id !== id),
        }));
        
        if (token) {
          get().addActivity({
            action: 'DELETE',
            service: token.service,
            details: 'Token deleted',
          });
        }
      },
      
      getToken: (id) => {
        return get().tokens.find((t) => t.id === id);
      },
      
      // Activity actions
      addActivity: (activity) => {
        const newActivity: Activity = {
          id: generateId(),
          ...activity,
          timestamp: new Date().toISOString(),
        };
        
        set((state) => ({
          activities: [newActivity, ...state.activities].slice(0, 100), // Keep last 100
        }));
      },
      
      clearActivities: () => {
        set({ activities: [] });
      },
      
      // Export actions
      exportToEnv: () => {
        const tokens = get().tokens;
        return tokens
          .map((t) => {
            const serviceName = t.service.toUpperCase().replace(/\s+/g, '_');
            const tokenValue = decrypt(t.token);
            return `${serviceName}=${tokenValue}`;
          })
          .join('\n');
      },
      
      exportToJson: () => {
        const tokens = get().tokens.map((t) => ({
          service: t.service,
          token: decrypt(t.token),
          category: t.category,
          description: t.description,
          status: t.status,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        }));
        return JSON.stringify(tokens, null, 2);
      },
    }),
    {
      name: 'tokn-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        theme: state.theme,
        tokens: state.tokens,
        activities: state.activities,
      }),
    }
  )
);

// Helper hook to get decrypted token
export function useDecryptedToken(id: string): string | null {
  const token = useToknStore((state) => state.getToken(id));
  if (!token) return null;
  return decrypt(token.token);
}

// Helper to decrypt a token string
export function getDecryptedToken(encrypted: string): string {
  return decrypt(encrypted);
}
