"use client";
import { EditProfile } from "@/components/features/dialogs/EditProfile";
import { EditUserForm } from "@/components/features/forms/userForm/editProfile";
import { SafeImage } from "@components/ui/images/SafeImage";
import { use } from "react";

export function Cover({
  userPromise,
  currentUser,
}: {
  userPromise: Promise<any>;
  currentUser?: string | null;
}) {
  const user = use(userPromise);
  if (!user) return;
  return (
    <figure className="w-full h-[calc(5/12*100vh)] absolute top-0 left-0 z-20 flex items-center justify-center after:content-[''] after:w-full after:h-[calc(5/12*100vh)] after:absolute after:left-0 after:top-0 after:bg-linear-to-t after:from-background/90 after:to-background-950/30 bg-black">
      <span className="h-full w-full overflow-hidden relative">
        <SafeImage
          src={user.avatar ? `${user.avatar}?t=${user.updatedAt}` : null}
          alt={user.name}
          sizes="100vw"
          fill
          priority
          quality={50}
          className="object-cover! w-full! h-full! blur-2xl! relative!"
        />
      </span>
      <span className="h-full w-full relative">
        <SafeImage
          src={user.avatar ? `${user.avatar}?t=${user.updatedAt}` : null}
          alt={user.name}
          sizes="100vw"
          fill
          priority
          quality={100}
          className="!object-cover !w-full !h-full"
        />
      </span>
      <span className="h-full w-full overflow-hidden relative flex items-end justify-center">
        <SafeImage
          src={user.avatar ? `${user.avatar}?t=${user.updatedAt}` : null}
          alt={user.name}
          sizes="100vw"
          fill
          priority
          quality={50}
          className="!object-cover !w-full !h-full !blur-2xl absolute"
        />
        <div className="absolute w-10/12 h-full flex flex-col items-center justify-between py-6 z-50">
          <div className="relative z-10 invisible h-10 w-3" />
          <p className="h-30 w-full mx-12 bg-background/40 backdrop-blur-xl p-3 overflow-y-auto rounded-xl border border-background-500/40 z-20">
            {user.biography && user.biography}
          </p>
          <div className="relative z-10">
            {user.username === currentUser ? (
              <EditProfile>
                <EditUserForm user={user} />
              </EditProfile>
            ) : (
              <div className="relative z-10 invisible h-15 w-3" />
            )}
          </div>
        </div>
      </span>
    </figure>
  );
}
