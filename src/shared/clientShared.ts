import { HttpStatusCode } from "@/types/httpStatusCode";
import { getBearerAdminToken, getBearerToken } from "./cookies";
/* import { getBearerToken, logoutUser } from "./cookies"; */

function defaultError({
  errors,
  message = "Unknown error",
}: {
  errors?: any;
  message?: string;
}) {
  return {
    errors: errors,
    message: message,
    data: undefined,
  };
}

const handleCustomApiRequest = async <T = any>(
  request: string,
  method: "POST" | "GET" | "PATCH" | "DELETE",
  body: any = undefined,
  withToken: boolean = false
) => {
  try {
    let headers: any[] = [];

    const parsedBody = body
      ? body instanceof FormData
        ? body
        : JSON.stringify(body)
      : undefined;

    if (withToken) {
      let token: { value: string };
      if (request.includes("admin")) {
        const { admin_token } = (await getBearerAdminToken()) as {
          admin_token: {
            value: string;
          };
        };
        token = admin_token;
      } else {
        const { token: user_token } = (await getBearerToken()) as {
          token: {
            value: string;
          };
        };
        token = user_token;
      }

      headers = [["Authorization", `${token}`]];
    }
    const fetching = await fetch(request, {
      method,
      body: parsedBody,
      next: { revalidate: 0 },
      headers,
    });
    const petition = await fetching.json(),
      statusCode = fetching.status;
    return handleStatusCode<T>(statusCode, petition);
  } catch (error: any) {
    console.error({ error, message: "hola" });
    return defaultError({ errors: error });
  }
};

const handleStatusCode = async <T>(
  statusCode: HttpStatusCode,
  petition: { message: string; data: string; errors: string[] }
) => {
  switch (statusCode) {
    case HttpStatusCode.UNAUTHORIZED:
      /* await logoutUser(); */
      return defaultError({
        errors: HttpStatusCode.UNAUTHORIZED,
        message: "Unauthorized",
      });
    case HttpStatusCode.OK:
      return {
        message: "Data request has succeeded",
        errors: [],
        data: petition.data as T,
      };

    default:
      return defaultError({
        message: petition.message,
        errors: petition.errors,
      });
  }
};

const randomKey = () =>
  new Date(new Date().valueOf() - Math.random() * 1e12).toString();

export { randomKey, handleCustomApiRequest };
