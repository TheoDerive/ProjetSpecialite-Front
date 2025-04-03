import { create } from "zustand";
import { combine, persist } from "zustand/middleware";
import type { MembreType } from "~/hooks/apiMembre";
import type { Me } from "~/hooks/useAuth";

export const useAppStore = create((set) => ({
  newEvent: [] as { date: [number, number] }[],
  setEvent: (newEvent: { date: [number, number] }[]) => set({ newEvent }),
}));

export const useAccountStore = create(
  persist(
    combine(
      {
        account: undefined as null | undefined | Me,
      },
      (set) => ({
        setAccount: (account: Me | null) => set({ account }),
      })
    ),
    { name: "user" }
  )
);
