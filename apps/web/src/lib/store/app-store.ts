import { create } from "zustand";
import { persist } from "zustand/middleware";

type AppState = {
  theme: "light" | "dark" | "system";
  sidebarCollapsed: boolean;
  utilityPanelOpen: boolean;
  aiDrawerOpen: boolean;
  companyId: string;
  branchId: string;
  favorites: string[];
  recentPages: { title: string; href: string }[];
  setTheme: (theme: AppState["theme"]) => void;
  toggleSidebar: () => void;
  toggleUtilityPanel: () => void;
  toggleAiDrawer: () => void;
  setCompany: (id: string) => void;
  setBranch: (id: string) => void;
  addRecent: (title: string, href: string) => void;
  toggleFavorite: (href: string) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: "system",
      sidebarCollapsed: false,
      utilityPanelOpen: false,
      aiDrawerOpen: false,
      companyId: "co1",
      branchId: "br1",
      favorites: [],
      recentPages: [],
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      toggleUtilityPanel: () => set((s) => ({ utilityPanelOpen: !s.utilityPanelOpen })),
      toggleAiDrawer: () => set((s) => ({ aiDrawerOpen: !s.aiDrawerOpen })),
      setCompany: (companyId) => set({ companyId }),
      setBranch: (branchId) => set({ branchId }),
      addRecent: (title, href) => {
        const filtered = get().recentPages.filter((p) => p.href !== href);
        set({ recentPages: [{ title, href }, ...filtered].slice(0, 8) });
      },
      toggleFavorite: (href) => {
        const favs = get().favorites;
        set({
          favorites: favs.includes(href)
            ? favs.filter((f) => f !== href)
            : [...favs, href],
        });
      },
    }),
    {
      name: "againerp-prototype",
      version: 1,
      migrate: (persistedState, version) => {
        if (version < 1) {
          return { ...(persistedState as object), utilityPanelOpen: false };
        }
        return persistedState as AppState;
      },
    },
  ),
);
