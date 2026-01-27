import { CustomError } from "@shared-types/error.type";
import { HttpStatusCode } from "@shared-types/httpStatusCode";
import { onSuccessRequest, onThrowError } from "@/apiService";
import { NextRequest } from "next/server";
import { getFavoritesToUserContent } from "@/shared/server/user/user.service";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username?: string }> },
) {
  try {
    const param = await params;
    if (!param?.username) {
      throw new CustomError({
        errors: [
          {
            message: "User not found",
          },
        ],
        msg: "User not found",
        httpStatusCode: HttpStatusCode.NOT_FOUND,
      });
    }
    const userLibrary = await getFavoritesToUserContent({ username: param.username });

    return onSuccessRequest({
      httpStatusCode: HttpStatusCode.OK,
      data: userLibrary,
    });
  } catch (error) {
    console.log(error);
    return onThrowError(error);
  }
}
