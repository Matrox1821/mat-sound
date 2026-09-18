"use server";
import { setLoginCookies } from "@/shared/client/apiShared";
import { adminService } from "@/shared/server/admin/admin.service";
import { allAlbumsCounter } from "@/shared/server/album/album.repository";
import { allArtistsCounter } from "@/shared/server/artist/artist.repository";
import { getRecentActivity } from "@/shared/server/content/content.repository";
import { allGenresCounter } from "@/shared/server/genre/genre.repository";
import { allTracksCounter } from "@/shared/server/track/track.repository";
import { ImageSizes } from "@/types/common.types";
import { CustomError } from "@/types/error.type";

type ActionState = {
  success: boolean;
  errors: { message: string }[];
};

export async function loginAdminAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const { admin_token, user } = await adminService.login(username, password);
    await setLoginCookies(user.username, admin_token, true);
    return { success: true, errors: [] };
  } catch (error) {
    if (error instanceof CustomError) {
      return {
        success: false,
        errors: [{ message: error.message }],
      };
    }

    return {
      success: false,
      errors: [{ message: "Internal server error." }],
    };
  }
}

export async function getTotalData(): Promise<{
  tracks: number;
  albums: number;
  artists: number;
  genres: number;
}> {
  const [tracks, albums, artists, genres] = await Promise.all([
    allTracksCounter(),
    allAlbumsCounter(),
    allArtistsCounter(),
    allGenresCounter(),
  ]);

  return {
    tracks,
    albums,
    artists,
    genres,
  };
}

export async function getRecentData() {
  const rows = await getRecentActivity();

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    cover: row.cover as ImageSizes,
    type: row.type,
    createdAt: row.created_at,
    extra: row.extra ?? null,
  }));
}
