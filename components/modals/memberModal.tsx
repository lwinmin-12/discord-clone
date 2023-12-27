"use client";

import qs from "query-string";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";

import {
  Check,
  Gavel,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";

import { useState } from "react";
import axios from "axios";
import { serverWithMembersWithProfile } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserAvatar from "@/components/userAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MemberRole } from "@prisma/client";
import { useRouter } from "next/navigation";

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
};

export const MemberModal = () => {
  const router = useRouter();
  const { isOpen, onClose, onOpen, type, data } = useModal();
  const { server } = data as { server: serverWithMembersWithProfile };
  const [loadingId, setLoadingId] = useState("");
  //   console.log(server?.members.length);

  const isModelOpen = isOpen && type === "members";

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });
      const response = await axios.delete(url);
      router.refresh();
      onOpen("members", { server: response.data });
    } catch (e) {
    } finally {
    }
  };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);

      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });

      const response = await axios.patch(url, { role });

      router.refresh();
      onOpen("members", { server: response.data });
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            {server?.members.length} members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] px-6">
          {server?.members?.map((ea) => (
            <div className="flex items-center gap-x-2 mb-6" key={ea.id}>
              <UserAvatar src={ea.profile.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {ea.profile.name}
                  {roleIconMap[ea.role]}
                </div>
                <p className="text-xs text-zinc-500">{ea.profile.email}</p>
              </div>

              {server.profileId !== ea.profileId && loadingId !== ea.id && (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="h-4 w-4 text-zinc-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center">
                          <ShieldQuestion className="w-4 h-4 mr-2" />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              onClick={() => onRoleChange(ea.id, "GUEST")}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Guest
                              {ea.role === "GUEST" && (
                                <Check className="h-4 w-4 ml-auto" />
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onRoleChange(ea.id, "MODERATOR")}
                            >
                              <ShieldCheck className="h-4 w-4 mr-2" />
                              Moderator
                              {ea.role === "MODERATOR" && (
                                <Check className="h-4 w-4 ml-auto" />
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                      onClick={() => onKick(ea.id)}
                      >
                        <Gavel className="h-4 w-4 mr-2" />
                        Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
