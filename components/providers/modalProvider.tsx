"use client";

import React, { useEffect, useState } from "react";
import { CreateServerModal } from "@/components/modals/createServerModal";

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
    </>
  );
};

export default ModalProvider;
