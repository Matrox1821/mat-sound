"use client";

import { useUserAvatarStore } from "@/store/userAvatarStore";
import { use, useEffect } from "react";

export function UserAvatarHydrator({
  userAvatarPromise,
}: {
  userAvatarPromise: Promise<{ avatar: string | null; updatedAt: Date } | null>;
}) {
  const user = use(userAvatarPromise);
  const hydrate = useUserAvatarStore((s) => s.hydrate);

  useEffect(() => {
    if (!user) return;
    hydrate(user);
  }, [hydrate, user]);

  return null;
}
