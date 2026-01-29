"use client";
import { SafeImage } from "@components/ui/images/SafeImage";
import { UserData } from "@shared-types/user.types";
import { use } from "react";

export function CoverInfo({ userPromise }: { userPromise: Promise<UserData | null> }) {
  const user = use(userPromise);
  if (!user) return;
  return (
    <article className="w-1/2 flex items-center z-30 relative h-[calc(5/12*100vh)]">
      <div className="flex items-center gap-4 left-0 ">
        <SafeImage
          src={user.avatar ? `${user.avatar}?t=${user.updatedAt}` : null}
          alt={user.displayUsername}
          width={0}
          height={0}
          className="!object-cover !w-60 !h-60 !rounded-lg border border-background-300/40"
        />
        <span className="flex flex-col gap-3">
          <span className="flex flex-col gap-2">
            <span className="text-accent-950 leading-0">@{user.username}</span>
            <h2 className="text-3xl font-bold ">{user.displayUsername}</h2>
          </span>
          <span className="flex flex-col">
            <span className="text-md">Siguiendo {user.following}</span>
            <span className="text-md">Seguidores {user.followedBy}</span>
          </span>
        </span>
      </div>
    </article>
  );
}
