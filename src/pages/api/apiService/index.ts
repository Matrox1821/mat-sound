import { supabase } from "../../../lib/supabase";
import { HttpStatusCode } from "../../../types/httpStatusCode";

const validateOrReject = async (input: any) => {};

const generateErrorMessage = <E = any>({
  httpStatusCode,
  errors,
  message,
}: {
  httpStatusCode: HttpStatusCode;
  errors: E | E[];
  message?: string;
}) => {
  return {
    httpStatusCode,
    errors,
    message,
  };
};

const generateSuccessMessage = <E = any>({
  httpStatusCode,
  data,
  message,
}: {
  httpStatusCode: HttpStatusCode;
  data: E | E[];
  message?: string;
}) => {
  return {
    httpStatusCode,
    data,
    message,
  };
};

const onSuccessRequest = <E = any>({
  httpStatusCode,
  data,
  message,
}: {
  httpStatusCode: HttpStatusCode;
  data: E | E[];
  message?: string;
}) => {
  return new Response(JSON.stringify({ httpStatusCode, data, message }), {
    status: httpStatusCode,
  });
};

const customError = <E = any>({
  httpStatusCode,
  errors,
  message,
}: {
  httpStatusCode: HttpStatusCode;
  errors?: E | E[];
  message?: string;
}) => {
  return new Response(
    JSON.stringify(
      generateErrorMessage({
        httpStatusCode: httpStatusCode,
        errors: errors,
        message: message,
      })
    ),
    { status: httpStatusCode }
  );
};

const onThrowError = (error: any) => {
  return new Response(
    JSON.stringify(
      generateErrorMessage({
        httpStatusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        errors: [{ message: error.message }],
        message: "Unexpected error.",
      })
    ),
    { status: 500 }
  );
};

export {
  validateOrReject,
  generateErrorMessage,
  onThrowError,
  generateSuccessMessage,
  onSuccessRequest,
  customError,
};
