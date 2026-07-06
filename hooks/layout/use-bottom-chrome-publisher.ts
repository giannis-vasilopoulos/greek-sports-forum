"use client";

import { useCallback, useEffect, useState } from "react";

import {
  clearBottomChromeHeight,
  setBottomChromeHeight,
} from "@/lib/layout/bottom-chrome";

function publishElementHeight(element: HTMLElement) {
  const height = element.offsetHeight;
  if (height > 0) {
    setBottomChromeHeight(height);
  } else {
    clearBottomChromeHeight();
  }
}

export function useBottomChromePublisher(enabled: boolean) {
  const [element, setElement] = useState<HTMLElement | null>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!enabled || !element) {
      clearBottomChromeHeight();
      return;
    }

    publishElementHeight(element);

    const observer = new ResizeObserver(() => {
      publishElementHeight(element);
    });
    observer.observe(element);

    return () => {
      observer.disconnect();
      clearBottomChromeHeight();
    };
  }, [enabled, element]);

  return ref;
}
