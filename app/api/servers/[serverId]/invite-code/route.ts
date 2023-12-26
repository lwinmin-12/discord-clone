import { currentProfile } from "@/lib/currentProfile";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import {
  dataResponse,
  errorResponse,
  unauthorizeResponse,
} from "@/lib/globalFunction";
import { NextResponse } from "next/server";

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
      return errorResponse("Sever Id is Missing");
    }
    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });
    return dataResponse(server);
  } catch (e) {
    console.log("[SERVER_ID", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
