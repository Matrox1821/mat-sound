"use client";
import { useNavigationStore } from "@/store/navigationStore";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useNavigation() {
  const router = useRouter();

  // selectors (leer funciones o valores directamente)
  const backFromStore = useNavigationStore((s) => s.back);
  const forwardFromStore = useNavigationStore((s) => s.forward);
  const canGoBack = useNavigationStore((s) => s.canGoBack());
  const canGoForward = useNavigationStore((s) => s.canGoForward());
  const goToIndex = useNavigationStore((s) => s.goToIndex);

  const back = useCallback(() => {
    const route = backFromStore();
    if (route) router.push(route);
  }, [backFromStore, router]);

  const forward = useCallback(() => {
    const route = forwardFromStore();
    if (route) router.push(route);
  }, [forwardFromStore, router]);

  const jumpTo = useCallback(
    (index: number) => {
      const route = goToIndex(index);
      if (route) router.push(route);
    },
    [goToIndex, router]
  );

  return { back, forward, canGoBack, canGoForward, jumpTo };
}
