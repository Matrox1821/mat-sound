/**
 * @type {import("astro").MiddlewareHandler}
 */
import { defineMiddleware } from "astro:middleware";
export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;
  const cookie = context.request.headers.get("cookie");
  let cookies = { "sb-access-token": "", "sb-refresh-token": "" };
  cookie?.split("; ").map((cookieText) => {
    if (cookieText.includes("sb-access-token"))
      cookies = { ...cookies, "sb-access-token": cookieText.split("=")[1] };
    if (cookieText.includes("sb-refresh-token"))
      cookies = { ...cookies, "sb-refresh-token": cookieText.split("=")[1] };
  });
  const isAdminManagerRoute = pathname.includes("/admin");
  if (
    !cookie &&
    (!cookies["sb-access-token"] || !cookies["sb-refresh-token"]) &&
    isAdminManagerRoute
  ) {
    return Response.redirect(new URL("/", context.url));
  }

  return next();
});
