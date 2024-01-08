import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { channel } from "diagnostics_channel";
import { redirect } from "next/navigation";
import React from "react";
import ServerHeader from "./serverHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import ServerSearch from "./serverSearch";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import ServerSection from "./serverSection";
import ServerChannel from "./serverChannel";
import ServerMember from "./serverMember";

interface serverSideBarDocument {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
};

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
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5] ">
      <ServerHeader server={server} role={role} />
      <div className="mt-2">
        <ScrollArea>
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannel?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannel?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannel?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </ScrollArea>
      </div>
      <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />

      {!!textChannel?.length && (
        <div className="mb-2 px-2">
          <ServerSection
            sectionType="channels"
            channelType={ChannelType.TEXT}
            role={role}
            label="Text Channels"
          />
          {textChannel.map((ea) => (
            <ServerChannel
              key={ea.id}
              channel={ea}
              role={role}
              server={server}
            />
          ))}
        </div>
      )}

      {!!audioChannel?.length && (
        <div className="mb-2 px-2">
          <ServerSection
            sectionType="channels"
            channelType={ChannelType.TEXT}
            role={role}
            label="Audio Channels"
          />
          {audioChannel.map((ea) => (
            <ServerChannel
              key={ea.id}
              channel={ea}
              role={role}
              server={server}
            />
          ))}
        </div>
      )}

      {!!videoChannel?.length && (
        <div className="mb-2 px-2">
          <ServerSection
            sectionType="channels"
            channelType={ChannelType.TEXT}
            role={role}
            label="Video Channels"
          />
          {videoChannel.map((ea) => (
            <ServerChannel
              key={ea.id}
              channel={ea}
              role={role}
              server={server}
            />
          ))}
        </div>
      )}

      {!!members?.length && (
        <div className="mb-2 px-2">
          <ServerSection
            sectionType="channels"
            channelType={ChannelType.TEXT}
            role={role}
            label="member"
          />
          {members.map((ea) => (
            // <ServerChannel
            //   key={ea.id}
            //   channel={ea}
            //   role={role}
            //   server={server}
            // />
            <ServerMember key={ea.id} member={ea} server={server} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServerSideBar;
