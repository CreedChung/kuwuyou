import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ConfigState {
  knowledgeId: string | null;
  setKnowledgeId: (id: string | null) => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      knowledgeId: null,
      setKnowledgeId: (id) => set({ knowledgeId: id }),
    }),
    {
      name: "config-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);