"use client";

import React, { useEffect, useState } from "react";
import { CreateServerModal } from "@/components/modals/createServerModal";
import { InviteModal } from "@/components/modals/createInviteModal";
import { EditServerModal } from "../modals/editServerModal";
import { MemberModal } from "../modals/memberModal";
import { CreateChanelModal } from "../modals/createChannelModal";
import { LeaveServerModal } from "../modals/leaveServerModal";
import { DeleteServerModal } from "../modals/deleteServerModal";
import { DeleteChannelModal } from "../modals/deleteChannelModal";

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
      <DeleteChannelModal/>
    </>
  );
};

export default ModalProvider;
