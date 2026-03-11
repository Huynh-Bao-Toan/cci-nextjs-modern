import { create } from "zustand";
import { devtools } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

type UiPreferencesState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const useUiPreferencesStore = create<UiPreferencesState>()(
  devtools(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }, undefined, "ui-preferences/setTheme"),
    }),
    {
      name: "ui-preferences-store",
    },
  ),
);
