/**
 * @type {import("astro").MiddlewareHandler}
 */
import { defineMiddleware } from "astro:middleware";
export const onRequest = defineMiddleware((context, next) => {
  const pathname = context.url.pathname;
  const isAdminManagerRoute = pathname.includes("manager");
  /*  const basicAuth = context.request.headers.get("authorization");
  if (isAdminManagerRoute && !basicAuth) {
    return Response.redirect(new URL("/", context.url));
  } */
  return next();
});
