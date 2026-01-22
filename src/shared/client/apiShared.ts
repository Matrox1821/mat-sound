import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";

const secret = process.env.JWT_SECRET_KEY || "";

const setCookie = async (cookieKey: string, value: any) => {
  try {
    const cookie = await cookies();
    cookie.set({
      name: cookieKey,
      value: value,
      maxAge: 3600,
      path: "/",
    });
    return true;
  } catch {
    return false;
  }
};

const setLoginCookies = async (user: string, token?: string, isAdmin: boolean = false) => {
  console.log({ user, token, isAdmin });
  await setUserCookie(user, isAdmin);
  if (token) await setCookie(isAdmin ? "admin_token" : "token", token);
};

const setUserCookie = async (user: string, isAdmin?: boolean) => {
  await setCookie(isAdmin ? "admin" : "current_user", user);
};

const logInUser = (user: any) => {
  try {
    const data = {
      time: new Date(),
      ...user,
    };
    const options = {
      expiresIn: 3600, // 1 hour
    };
    const token = jwt.sign(data, secret, options);
    return token;
  } catch {
    return null;
  }
};

const removeCookie = async (cookieKey: string) => {
  try {
    const cookie = await cookies();
    cookie.set({ name: cookieKey, maxAge: 0, value: "" });
    return true;
  } catch {
    return false;
  }
};

const verifyToken = (token: string | null) => {
  try {
    if (!token) return undefined;
    return jwt.verify(token, secret);
  } catch {
    return undefined;
  }
};

const verifyUserAuth = (req: NextRequest) => {
  const token = req.headers.get("Authorization");
  const isLoggedIn = verifyToken(token);
  if (!token || !isLoggedIn)
    throw new CustomError({
      errors: [],
      httpStatusCode: HttpStatusCode.UNAUTHORIZED,
      msg: "Error at authorization.",
    });
};

export {
  verifyUserAuth,
  verifyToken,
  setCookie,
  removeCookie,
  logInUser,
  setLoginCookies,
  setUserCookie,
};
