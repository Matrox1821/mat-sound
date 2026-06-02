import bcrypt from "bcryptjs";
import { logInUser } from "@/shared/client/apiShared";
import { CustomError } from "@shared-types/error.type";
import { HttpStatusCode } from "@shared-types/httpStatusCode";
import { adminRepository } from "./admin.repository";

export const adminService = {
  login: async (username: string, password: string) => {
    const admin = await adminRepository.findByUsername(username);

    if (!admin) {
      throw new CustomError({
        errors: [{ message: "Admin not found." }],
        msg: "Admin not found.",
        httpStatusCode: HttpStatusCode.NOT_FOUND,
      });
    }
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      throw new CustomError({
        errors: [{ message: "Invalid credentials." }],
        msg: "Invalid credentials.",
        httpStatusCode: HttpStatusCode.UNAUTHORIZED,
      });
    }

    const { password: _password, ...user } = admin;
    const jwt = logInUser(user);

    if (!jwt) {
      throw new CustomError({
        errors: [{ message: "Error generating token." }],
        msg: "Error generating token.",
        httpStatusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }

    return { admin_token: jwt, user };
  },
};
