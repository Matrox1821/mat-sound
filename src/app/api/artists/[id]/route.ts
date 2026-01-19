import { onSuccessRequest, onThrowError } from "@/apiService";
import { prisma } from "@config/db";
export async function GET({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const response = await prisma.artist.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        mainCover: true,
        description: true,
        covers: true,
        isVerified: true,
        listeners: true,
        socials: true,
        regionalListeners: true,
        followersDefault: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    return onSuccessRequest({
      httpStatusCode: 200,
      data: response,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
