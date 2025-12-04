import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Theme = 'default' | 'tech';

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  setDarkMode: (isDark: boolean) => void;
  toggleDarkMode: () => void;
  applyTheme: (theme: Theme, isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'default',
      isDark: true,
      
      setTheme: (theme) => {
        set({ theme });
        const { isDark } = get();
        get().applyTheme(theme, isDark);
      },
      
      setDarkMode: (isDark) => {
        set({ isDark });
        const { theme } = get();
        get().applyTheme(theme, isDark);
      },
      
      toggleDarkMode: () => {
        const { isDark } = get();
        get().setDarkMode(!isDark);
      },
      
      applyTheme: (theme, isDark) => {
        if (typeof window === 'undefined') return;
        
        const root = document.documentElement;
        
        root.setAttribute('data-theme', theme);
        
        if (isDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);