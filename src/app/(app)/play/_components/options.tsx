"use client";
import Icon3D from "~/icons/3d-icon";
import TextIcon from "~/icons/text-icon";

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

import { useGameSettings } from "~/contexts/GameSettingsContext";
import { useGame } from "~/contexts/GameContext";
import { textSizeMapping } from "~/lib/utils";
import { HAdjustmentsIcon } from "~/icons/h-adjustments-icon";
import ResetIcon from "~/icons/reset-icon";

export default function Options({
  handle3DChange,
  handleTextSizeChange,
  show3D,
}: {
  handle3DChange: (pressed: boolean) => void;
  handleTextSizeChange: (value: string) => void;
  show3D: boolean;
}) {
  const { has3D, textSize } = useGameSettings();
  const { hasStartedState } = useGame();
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
                  <TextIcon className="mr-2 h-4 w-4" />
                  {textSizeMapping[textSize.current]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Text Size</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={textSize.current}
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
              defaultPressed={has3D.current}
              onPressedChange={handle3DChange}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              <Icon3D className="mr-2 h-4 w-4" />
              3D
            </Toggle>
            {show3D && (
              <Button size="sm" variant="outline">
                <HAdjustmentsIcon className="mr-2 h-4 w-4" />
                Camera
              </Button>
            )}
          </div>
          <div className="flex">
            {hasStarted && (
              <Button size="sm" variant="default" className="text-xs">
                <ResetIcon className="mr-2 h-4 w-4" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
