import { create } from "zustand";
import type { MembreType } from "~/hooks/apiMembre";

interface storeInterface {
  user: MembreType | undefined,
  setUser: (user: MembreType) => void
}

export const useAppStore = create<storeInterface>((set) => ({
  user: undefined,
  setUser: (user) => set({ user })
}))
