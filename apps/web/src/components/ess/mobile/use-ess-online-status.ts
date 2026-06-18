"use client";

import { useEffect, useState } from "react";
import { useEssMobileStore } from "@/components/ess/mobile/ess-mobile-store";

/** Tracks browser online status + optional offline simulation for prototype */
export function useEssOnlineStatus() {
  const offlineSimulated = useEssMobileStore((s) => s.offlineSimulated);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return {
    isOnline: online && !offlineSimulated,
    browserOnline: online,
    offlineSimulated,
  };
}
