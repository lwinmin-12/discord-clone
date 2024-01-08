import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import {
  dataResponse,
  errorResponse,
  unauthorizeResponse,
} from "@/lib/globalFunction";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return unauthorizeResponse();
    }
    if (!params.serverId) {
      return errorResponse("server id is missing");
    }
    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });
    return dataResponse(server);
  } catch (e) {
    console.log("[SERVER_ID_PATCH]", e);

    return errorResponse("Internal Error", 500);
  }
}
