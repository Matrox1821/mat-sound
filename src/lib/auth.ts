import { prisma } from "@config/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";
import { v7 as uuidv7 } from "uuid";
import { GET_URL } from "@/shared/utils/constants";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? GET_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  advanced: {
    database: {
      generateId: () => uuidv7(),
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  user: {
    additionalFields: {
      displayUsername: { type: "string", required: true },
    },
    username: { type: "string" },
  },
  plugins: [username(), nextCookies()],
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await prisma.collection.create({
            data: {
              userId: user.id,
            },
          });
          return;
        },
      },
    },
  },
});
