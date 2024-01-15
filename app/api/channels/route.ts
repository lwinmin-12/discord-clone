import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import {
  dataResponse,
  errorResponse,
  unauthorizeResponse,
} from "@/lib/globalFunction";
import { MemberRole } from "@prisma/client";

export async function PATCH(req: Request) {
  try {
    const profile = await currentProfile();

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    const { name, type } = await req.json();

    if (!profile) {
      return unauthorizeResponse();
    }

    if (!serverId) {
      return errorResponse("server id is missing");
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
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });

    return dataResponse(server);
  } catch (e) {
    console.log("[CHANNEL_UPDATE_ERROR", e);
    return errorResponse("Internal server error", 500);

  }
}
