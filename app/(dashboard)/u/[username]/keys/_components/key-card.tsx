"use client";

import { Input } from "@/components/ui/input";
import { CopyButton } from "./copy-button";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface KeyCardProps {
  value: string | null;
}
export const KeyCard = ({ value }: KeyCardProps) => {
  const [isShow, setIsShow] = useState(false);
  return (
    <div className="rounded-xl bg-muted p-6">
      <div className="flex items-center gap-x-10">
        <p className="font-semibold shrink-0">Stream Key</p>
        <div className="w-full space-y-2">
          <div className="w-full flex items-center gap-x-2">
            <Input
              value={value || ""}
              disabled
              type={isShow ? "text" : "password"}
              placeholder="Stream Key"
            />
            <CopyButton value={value || ""} />
          </div>

          <Button onClick={() => setIsShow(!isShow)} variant="link" size="sm">
            {isShow ? "Hide" : "Show"}
          </Button>
        </div>
      </div>
    </div>
  );
};
