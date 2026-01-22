import { handleCustomApiRequest } from "@/shared/client/clientShared";
import { GET_URL } from "@/shared/utils/constants";
import { ContentType } from "@/types/common.types";
import { ContentElement } from "@/types/content.types";

interface TrackQuery {
  type?: ContentType[];
  limit?: number;
  remove?: string;
  filter?: { type: ContentType; id: string };
  userId?: string;
}

const getContent = async ({
  type = ["tracks"],
  limit = 8,
  remove = "",
  filter = { type: "none", id: "" },
  userId = "",
}: TrackQuery): Promise<ContentElement[] | null> => {
  const searchParams = new URLSearchParams();
  type.forEach((t) => searchParams.append("type", t));
  searchParams.set("limit", limit.toString());
  searchParams.set("remove", remove);
  searchParams.set("filter", filter.type);
  searchParams.set("filter_id", filter.id);
  searchParams.set("user_id", userId);
  try {
    const response = await handleCustomApiRequest<ContentElement[]>(
      GET_URL + "/api/content" + "?" + searchParams.toString(),
      "GET",
      null,
    );
    if (response.errors?.length || !response.data) {
      throw new Error(response.message || "Error en la petición");
    }
    return response.data;
  } catch {
    return null;
  }
};

export const contentApi = {
  getContent,
};
