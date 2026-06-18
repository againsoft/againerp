"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type EssOfflineQueueItem = {
  id: string;
  type: "leave_apply" | "attendance_correction" | "document_upload" | "request";
  title: string;
  createdAt: string;
  status: "queued" | "syncing" | "failed";
};

type EssMobileState = {
  searchOpen: boolean;
  notificationsOpen: boolean;
  essAiOpen: boolean;
  offlineSimulated: boolean;
  offlineQueue: EssOfflineQueueItem[];
  setSearchOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  setEssAiOpen: (open: boolean) => void;
  toggleEssAi: () => void;
  setOfflineSimulated: (v: boolean) => void;
  enqueueOfflineAction: (item: Omit<EssOfflineQueueItem, "id" | "status">) => void;
  clearOfflineQueue: () => void;
};

export const useEssMobileStore = create<EssMobileState>()(
  persist(
    (set, get) => ({
      searchOpen: false,
      notificationsOpen: false,
      essAiOpen: false,
      offlineSimulated: false,
      offlineQueue: [],
      setSearchOpen: (open) => set({ searchOpen: open }),
      setNotificationsOpen: (open) => set({ notificationsOpen: open }),
      setEssAiOpen: (open) => set({ essAiOpen: open }),
      toggleEssAi: () => set((s) => ({ essAiOpen: !s.essAiOpen })),
      setOfflineSimulated: (v) => set({ offlineSimulated: v }),
      enqueueOfflineAction: (item) => {
        const id = `oq-${Date.now()}`;
        set({
          offlineQueue: [
            ...get().offlineQueue,
            { ...item, id, status: "queued" as const },
          ],
        });
      },
      clearOfflineQueue: () => set({ offlineQueue: [] }),
    }),
    {
      name: "againerp-ess-mobile",
      partialize: (s) => ({
        offlineQueue: s.offlineQueue,
        offlineSimulated: s.offlineSimulated,
      }),
    },
  ),
);
