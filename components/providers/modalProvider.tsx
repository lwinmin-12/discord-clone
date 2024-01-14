"use client";

import React, { useEffect, useState } from "react";
import { CreateServerModal } from "@/components/modals/createServerModal";
import { InviteModal } from "@/components/modals/createInviteModal";
import { EditServerModal } from "@/components/modals/editServerModal";
import { MemberModal } from "@/components/modals/memberModal";
import { CreateChanelModal } from "@/components/modals/createChannelModal";
import { LeaveServerModal } from "@/components/modals/leaveServerModal";
import { DeleteServerModal } from "@/components/modals/deleteServerModal";
import { DeleteChannelModal } from "@/components/modals/deleteChannelModal";
import { EditChannelModal } from "@/components/modals/editChannelModal";
import { MessageFileModal } from "@/components/modals/messageFileModal";
import { DeleteMessageModal } from "../modals/deleteMessageModal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MemberModal />
      <CreateChanelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <EditChannelModal />
      <MessageFileModal />
      <DeleteMessageModal />
    </>
  );
};

export default ModalProvider;
