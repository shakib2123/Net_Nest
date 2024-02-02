"use client";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/store/use-sidebar";
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";
import React from "react";

const Toggle = () => {
  const { collapsed, onExpend, onCollapse } = useSidebar((state) => state);

  const label = collapsed ? "Expend" : "Collapse";
  return (
    <>
      {collapsed && (
        <div className="hidden lg:flex w-full items-center justify-center pt-4 mb-4">
          <Hint label={label} side="right" asChild><Button
            onClick={onExpend}
            size="sm"
            variant="ghost"
            className="h-auto p-2"
          >
            <ArrowRightFromLine className="h-4 w-4" />
          </Button></Hint>
        </div>
      )}
      {!collapsed && (
        <div className="flex items-center p-3 pl-6 mb-2 w-full ">
          <p className="font-semibold text-primary">For you</p>
          <Hint label={label} side="right" asChild>
            <Button
              onClick={onCollapse}
              className="h-auto p-2 ml-auto "
              variant="ghost"
            >
              <ArrowLeftFromLine className="h-4 w-4" />
            </Button>
          </Hint>
        </div>
      )}
    </>
  );
};

export default Toggle;
