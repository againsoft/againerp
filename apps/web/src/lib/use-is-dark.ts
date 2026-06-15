"use client";

import { useSyncExternalStore } from "react";
import { useAppStore } from "@/lib/store/app-store";

function subscribePrefersDark(onChange: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function useIsDark() {
  const theme = useAppStore((s) => s.theme);
  const prefersDark = useSyncExternalStore(subscribePrefersDark, getPrefersDark, () => false);
  return theme === "dark" || (theme === "system" && prefersDark);
}
