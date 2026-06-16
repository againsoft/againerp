import { create } from "zustand";
import { persist } from "zustand/middleware";
import { propagateMediaUpdate } from "@/lib/media/media-propagate";
import {
  applyMediaItemPatch,
  mediaLibraryItems,
  type MediaLibraryItem,
} from "@/lib/mock-data/media-library";

type MediaPatch = Partial<Pick<MediaLibraryItem, "name" | "title" | "alt">>;

type MediaState = {
  items: MediaLibraryItem[];
  getById: (id: string) => MediaLibraryItem | undefined;
  prependItems: (items: MediaLibraryItem[]) => void;
  patchMediaItem: (id: string, patch: MediaPatch) => void;
};

export const useMediaStore = create<MediaState>()(
  persist(
    (set, get) => ({
      items: mediaLibraryItems,

      getById: (id) => get().items.find((item) => item.id === id),

      prependItems: (items) =>
        set((state) => ({
          items: [...items, ...state.items],
        })),

      patchMediaItem: (id, patch) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? applyMediaItemPatch(item, patch) : item,
          ),
        }));
        propagateMediaUpdate(id);
      },
    }),
    {
      name: "againerp-media",
      version: 1,
    },
  ),
);
