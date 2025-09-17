import { NextRequest } from "next/server";
import { onSuccessRequest, onThrowError } from "@/apiService";
import { getContent } from "@/shared/services/contentService";

export async function GET(req: NextRequest) {
  try {
    const response = await getContent(req);

    return onSuccessRequest({
      httpStatusCode: 200,
      data: response,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
