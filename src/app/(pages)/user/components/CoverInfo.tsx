"use client";
import { EditProfile } from "@components/features/dialogs/EditProfile";
import { EditUserForm } from "@components/features/forms/userForm/editProfile";
import { SafeImage } from "@components/ui/images/SafeImage";
import { UserData } from "@shared-types/user.types";
import { use } from "react";

export default function CoverInfo({ userPromise }: { userPromise: Promise<UserData | null> }) {
  const user = use(userPromise);
  console.log(user);
  if (!user) return;
  return (
    <article className="flex items-center gap-4 z-30 relative h-[calc(5/12*100vh)]">
      <SafeImage
        src={user.avatar && user.avatar.md}
        alt={user.displayUsername}
        width={1080}
        height={1080}
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

        <EditProfile>
          <EditUserForm user={user} />
        </EditProfile>
      </span>
      {user.biography && (
        <p className="w-[60ch] h-30 bg-black-600/30 backdrop-blur-xl p-3 overflow-y-auto rounded-xl border border-background-500/30 ">
          {user.biography}
        </p>
      )}
    </article>
  );
}
