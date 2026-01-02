import { handleCustomApiRequest } from "@/shared/client/clientShared";
import { GET_URL } from "@/shared/utils/constants";
import { ContentType } from "@/types";
import { APIContent } from "@/types/apiTypes";

interface TrackQuery {
  type?: ContentType[];
  limit?: number;
  remove?: string;
  filter?: { type: ContentType; id: string };
}

const getContent = async ({
  type = ["tracks"],
  limit = 8,
  remove = "",
  filter = { type: "none", id: "" },
}: TrackQuery) => {
  const searchParams = new URLSearchParams();
  type.forEach((t) => searchParams.append("type", t));
  searchParams.set("limit", limit.toString());
  searchParams.set("remove", remove);
  searchParams.set("filter", filter.type);
  searchParams.set("filter_id", filter.id);

  const response = await handleCustomApiRequest<APIContent[]>(
    GET_URL + "/api/content" + "?" + searchParams.toString(),
    "GET",
    null
  );
  /* 
  if (response.errors?.length) {
    throw new Error(response.message || "Error en la petición");
  } */
  return response.data;
};

export const contentApi = {
  getContent,
};
