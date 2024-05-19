"use client";
import { Box, SlidersHorizontal, Type, Star } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Toggle } from "~/components/ui/toggle";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "~/components/ui/dropdown-menu";

import { useGame } from "~/contexts/GameContext";
import { textSizeMapping } from "~/lib/utils";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { toast } from "sonner";

export default function Options({
  handle3DChange,
  handleTextSizeChange,
  show3D,
  textSize,
}: {
  handle3DChange: (pressed: boolean) => void;
  handleTextSizeChange: (value: string) => void;
  show3D: boolean;
  textSize: string;
}) {
  const { hasStartedState, cameraRef } = useGame();
  const [hasStarted] = hasStartedState;

  return (
    <div className="sticky top-0 z-50 flex w-full justify-center">
      <div className="flex flex-col justify-center xl:w-[75rem]">
        <div className="flex flex-row justify-between space-x-1 p-4">
          <div></div>
          <div className="flex flex-row justify-center space-x-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  <Type className="mr-2 h-4 w-4" />
                  {textSizeMapping[textSize]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Text Size</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={textSize}
                  onValueChange={handleTextSizeChange}
                >
                  <DropdownMenuRadioItem value="sm">
                    Small
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="md">
                    Medium
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="2xl">
                    Large
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Toggle
              defaultPressed={show3D}
              onPressedChange={handle3DChange}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              <Box className="mr-2 h-4 w-4" />
              3D
            </Toggle>
            {show3D && (
              <Sheet>
                <SheetTrigger asChild>
                  <Toggle size="sm" variant="outline" className="text-xs">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Camera
                  </Toggle>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Camera Settings</SheetTitle>
                    <SheetDescription>
                      Configure the 3D camera to your liking.
                    </SheetDescription>
                    {cameraRef.current && <div></div>}
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            )}
          </div>
          <div className="flex items-center">
            <button
              onClick={() => {
                toast.success("Quote has been added to your favorites");
              }}
            >
              <Star className="h-4 w-4 cursor-pointer" />
            </button>
            {hasStarted && (
              <Button size="sm" variant="default" className="text-xs">
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
