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
    const { name, imageUrl } = await req.json();

    if (!profile) {
      return unauthorizeResponse();
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });

    return dataResponse(server);
  } catch (error) {
    console.log("[SERVER_ID_PATCH]", error);
    return errorResponse("Internal Error", 500);
  }
}
