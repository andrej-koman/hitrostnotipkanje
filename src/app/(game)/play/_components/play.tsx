"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";

import GameText from "./game-text";
import Game3DModel from "./game3d";
import Options from "./options";

import { useState, useEffect } from "react";
import { useGame } from "~/contexts/GameContext";
import { TooltipProvider } from "~/components/ui/tooltip";

export default function Play({
  quote,
  carSpeed,
  defaultLayout = [50, 50],
  settings,
}: {
  quote: Quote;
  carSpeed: number;
  defaultLayout?: number[];
  settings: {
    has3D: boolean;
    textSize: string;
    isFavorite: boolean;
  };
}) {
  const [show3D, setShow3D] = useState(settings.has3D);
  const [useTextSize, setUseTextSize] = useState(settings.textSize);
  quote.isFavorite = settings.isFavorite;

  const { hasStartedState, carStartRotationRef, carStartPositionRef, carRef } =
    useGame();
  const [hasStarted, setHasStarted] = hasStartedState;

  const handle3DChange = (pressed: boolean) => {
    setShow3D(pressed);
    settings.has3D = pressed;
    document.cookie = `gameSettings=${JSON.stringify(settings)}; max-age=${24 * 60 * 60 * 365};`;
  };

  const handleTextSizeChange = (value: string) => {
    setUseTextSize(value);
    settings.textSize = value;
    document.cookie = `gameSettings=${JSON.stringify(settings)}; max-age=${24 * 60 * 60 * 365};`;
  };

  const handleRestartGame = () => {
    const correctLetters = document.querySelectorAll(".letter.correct");

    // For some reason, this is how you have to do it
    Array.prototype.forEach.call(correctLetters, (letter: Element) => {
      letter.classList.remove("correct");
    });

    // TODO
    // Move the car back aswell - Something is not right, the car's position does not get reset
    if (
      carRef.current &&
      carStartRotationRef.current &&
      carStartPositionRef.current
    ) {
      carRef.current.setRotationFromEuler(carStartRotationRef.current);
      carRef.current.position.set(
        carStartPositionRef.current.x,
        carStartPositionRef.current.y,
        carStartPositionRef.current.z,
      );
    }

    setHasStarted(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey) {
        if (e.key.toLowerCase() === "r") {
          e.preventDefault();
          handleRestartGame();
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const OptionsMounted = (
    <Options
      handle3DChange={handle3DChange}
      handleTextSizeChange={handleTextSizeChange}
      handleRestartGame={handleRestartGame}
      show3D={show3D}
      textSize={useTextSize}
      quote={quote}
      hasStarted={hasStarted}
    />
  );

  return (
    <TooltipProvider>
      {show3D ? (
        <ResizablePanelGroup
          direction="vertical"
          onLayout={(sizes: number[]) => {
            document.cookie = `react-resizable-panels:layout=${JSON.stringify(
              sizes,
            )}; max-age=${24 * 60 * 60 * 365};`;
          }}
        >
          <ResizablePanel minSize={30} defaultSize={defaultLayout[0]}>
            {OptionsMounted}
            <div
              className={`-mt-12 flex h-[100%] items-center justify-center text-${useTextSize}`}
            >
              <GameText carSpeed={carSpeed} quote={quote} has3D={show3D} />
            </div>
          </ResizablePanel>
          <ResizableHandle
            withHandle
            className={hasStarted ? "opacity-0" : ""}
          />
          <ResizablePanel minSize={40} defaultSize={defaultLayout[1]}>
            <Game3DModel />
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <>
          {OptionsMounted}
          <div
            className={`mb-32 flex h-[100%] items-center justify-center text-${useTextSize}`}
          >
            <GameText carSpeed={carSpeed} quote={quote} has3D={show3D} />
          </div>
        </>
      )}
    </TooltipProvider>
  );
}
