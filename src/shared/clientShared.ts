import { supabase } from "../lib/supabase";
import { HttpStatusCode } from "../types/httpStatusCode";

const handleCustomApiRequest = async <T = any>(
  request: string,
  method: "POST" | "GET" | "PATCH" | "DELETE",
  body: any = undefined
) => {
  try {
    const fetching = await fetch(request, {
      method,
      body: body ? JSON.stringify(body) : undefined,
    });
    const petition = await fetching.json(),
      statusCode = fetching.status;
    console.log(petition);
    return handleStatusCode<T>(statusCode, petition);
  } catch (error: any) {
    return { errors: error, message: "Unknown error", data: undefined };
  }
};

const handleStatusCode = async <T>(
  statusCode: HttpStatusCode,
  petition: any
) => {
  switch (statusCode) {
    case HttpStatusCode.UNAUTHORIZED:
      await supabase.auth.signOut();
      return { message: "Unauthorized", errors: [], data: undefined };
    case HttpStatusCode.OK:
      return { message: undefined, errors: [], data: petition.data as T };

    default:
      return {
        message: petition.message,
        errors: petition.errors,
        data: undefined,
      };
  }
};

const randomKey = () =>
  new Date(new Date().valueOf() - Math.random() * 1e12).toString();

export { randomKey, handleCustomApiRequest };
