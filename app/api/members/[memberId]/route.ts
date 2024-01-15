import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import {
  dataResponse,
  errorResponse,
  successResponse,
  unauthorizeResponse,
} from "@/lib/globalFunction";

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();

    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    const { role } = await req.json();

    console.log(searchParams);

    if (!profile) {
      return unauthorizeResponse();
    }

    if (!serverId) {
      return errorResponse("server id is missing");
    }

    if (!params.memberId) {
      return errorResponse("server id is missing");
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return dataResponse(server);
  } catch (e) {
    console.log("[MEMBER_UPDATE_ERROR", e);
    errorResponse("Internal server error", 500);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
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

    if (!params.memberId) {
      return errorResponse("server id is missing");
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });
    return dataResponse(server);
  } catch (e) {
    console.log("[MEMBER_DELETE_ERROR", e);
    return errorResponse("Internal server error", 500);
  }
}
