"use client";

import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/useModalStore";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Copy, RefreshCw } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required.",
  }),
  imageUrl: z.string().min(1, {
    message: "Server image is required.",
  }),
});

export const InviteModal = () => {
  const { isOpen, onClose, type } = useModal();

  const isModelOpen = isOpen && type === "invite";

  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <label
            className="uppercase text-xs font-bold 
          text-zinc-500 dark:text-secondary/70
          "
          >
            Server invite link
          </label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              value="invite-link"
              className="bg-zinc-300/50 border-0 focus-visible:right-0 text-black focus-visible:right-offset-0"
            />
            <Button size="icon">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <Button
            variant="link"
            size="sm"
            className="text-xs text-zinc-500 mt-4"
          >
            Generate a new link
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
