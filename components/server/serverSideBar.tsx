import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { channel } from "diagnostics_channel";
import { redirect } from "next/navigation";
import React from "react";
import ServerHeader from "./serverHeader";

interface serverSideBarDocument {
  serverId: string;
}

const ServerSideBar = async ({ serverId }: serverSideBarDocument) => {
  const profile = await currentProfile();

  if (!profile) return redirect("/");

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
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

  const textChannel = server?.channels.filter(
    (ea) => ea.type == ChannelType.TEXT
  );

  const audioChannel = server?.channels.filter(
    (ea) => ea.type == ChannelType.AUDIO
  );

  const videoChannel = server?.channels.filter(
    (ea) => ea.type == ChannelType.VIDEO
  );

  const members = server?.members.filter((ea) => ea.profileId != profile.id);
  
  const role = server?.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  if (!server || !role) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
    </div>
  );
};

export default ServerSideBar;
