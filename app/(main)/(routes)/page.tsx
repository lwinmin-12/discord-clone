import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/model-toggle";
const Home = () => {
  const state = true;
  return (
    <div className="flex flex-col">
      <UserButton afterSignOutUrl="/sign-in" />
      <ModeToggle/>

      <p className="text-3xl font-bold text-indigo-500">hello world</p>
      <Button>click</Button>
    </div>
  );
};

export default Home;
