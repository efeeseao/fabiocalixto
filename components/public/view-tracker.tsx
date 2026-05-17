"use client";

import { useEffect, useRef } from "react";
import { trackPageView } from "@/app/actions/tracking";

export function ViewTracker({ path }: { path: string }) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!hasTracked.current) {
      trackPageView(path);
      hasTracked.current = true;
    }
  }, [path]);

  return null;
}
