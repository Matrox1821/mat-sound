import { prisma } from "@config/db";

export const adminRepository = {
  findByUsername: async (username: string) => {
    return prisma.admin.findFirst({
      where: { username },
    });
  },
};
