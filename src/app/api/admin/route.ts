import { onSuccessRequest, onThrowError } from "@/apiService";
import prisma from "@/app/config/db";
import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { logInUser } from "@/shared/apiShared";
export async function POST(req: NextRequest) {
  try {
    const body: { email: string; password: string } = await req.json();

    const request = await prisma.admin.findFirst({
      where: {
        email: body.email,
      },
    });
    if (!request)
      throw new CustomError({
        errors: [{ message: "Admin not found." }],
        msg: "Admin not found.",
        httpStatusCode: HttpStatusCode.NOT_FOUND,
      });

    const isMatch = await bcrypt.compare(body.password, request.password);

    if (!isMatch) {
      throw new CustomError({
        errors: [{ message: "Invalid credentials." }],
        msg: "Invalid credentials.",
        httpStatusCode: HttpStatusCode.UNAUTHORIZED,
      });
    }
    const { password, ...user } = request;
    const jwt = logInUser(user);

    return onSuccessRequest({
      httpStatusCode: 200,
      data: { admin_token: jwt, user },
    });
  } catch (error) {
    return onThrowError(error);
  }
}
