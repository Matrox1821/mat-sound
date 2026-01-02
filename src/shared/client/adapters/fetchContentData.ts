import { contentApi } from "@/queryFn/client/contentApi";
import { contentProps, ContentType } from "@/types";
import { parseContent } from "../parsers/contentParser";

export const fetchContentData = async ({
  remove,
  options,
  filter,
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
}): Promise<contentProps[] | undefined> => {
  let dataToRemove = remove?.artistId || remove?.albumId || remove?.trackId || "";
  const content = await contentApi.getContent({
    type: options?.type || ["tracks"],
    limit: options?.limit || 8,
    remove: dataToRemove,
    filter,
  });

  if (!content) return;
  return parseContent(content);
};
