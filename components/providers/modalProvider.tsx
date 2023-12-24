"use client";

import React, { useEffect, useState } from "react";
import { CreateServerModal } from "@/components/modals/createServerModal";
import { InviteModal } from "@/components/modals/createInviteModal";

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
      <InviteModal/>
    </>
  );
};

export default ModalProvider;
