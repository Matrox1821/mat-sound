import { contentApi } from "@/queryFn/client/contentApi";
import { contentProps, ContentType } from "@/types/common.types";
import { parseContent } from "../parsers/contentParser";

export const fetchContentData = async ({
  remove,
  options,
  filter,
  userId = "",
}: {
  remove?: {
    artistId?: string;
    albumId?: string;
    trackId?: string;
  };
  options?: {
    limit?: number;
    isRecomendation?: boolean;
    type?: ContentType[];
  };
  filter?: { type: ContentType; id: string };
  userId?: string;
}): Promise<contentProps[] | undefined> => {
  const dataToRemove = remove?.artistId || remove?.albumId || remove?.trackId || "";
  const content = await contentApi.getContent({
    type: options?.type || ["tracks"],
    limit: options?.limit || 8,
    remove: dataToRemove,
    filter,
    userId,
  });
  if (!content) return;
  return parseContent(content);
};
