import { create } from "zustand";

type Theme = "light" | "dark" | "system";

type UiPreferencesState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const useUiPreferencesStore = create<UiPreferencesState>((set) => ({
  theme: "system",
  setTheme: (theme) => set({ theme }),
}));

