import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import {
  dataResponse,
  errorResponse,
  unauthorizeResponse,
} from "@/lib/globalFunction";
import { MemberRole } from "@prisma/client";

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return unauthorizeResponse();
    }

    if (!serverId) {
      return errorResponse("server id is missing");
    }

    if (!params.channelId) {
      return errorResponse("Channel ID missing");
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: params.channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    return dataResponse(server);
  } catch (e) {
    console.log("[CHANNEL_DELETE_ERROR", e);
    errorResponse("Internal server error", 500);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return unauthorizeResponse();
    }

    if (!serverId) {
      return errorResponse("Server ID missing");
    }

    if (!params.channelId) {
      return errorResponse("Channel ID missing");
    }

    if (name === "general") {
      return errorResponse("Name cannot be 'general'");
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: params.channelId,
              NOT: {
                name: "general",
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });

    return dataResponse(server);
  } catch (error) {
    console.log("[CHANNEL_ID_PATCH]", error);
    errorResponse("Internal server error", 500);
  }
}
