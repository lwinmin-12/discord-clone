import { Server, Member, Profile } from "@prisma/client";

export type serverWithMembersWithProfile = Server & {
  members: (Member & { profile: Profile })[];
};
