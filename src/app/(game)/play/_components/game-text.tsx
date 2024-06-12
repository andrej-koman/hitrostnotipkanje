"use client";
import { useEffect, useRef } from "react";
import { type Quaternion, Vector3 } from "three";
import { useGame } from "~/contexts/GameContext";

export default function GameText({
  quote,
  carSpeed,
  className,
  has3D,
}: {
  quote: Quote;
  carSpeed: number;
  className?: string;
  has3D: boolean;
}) {
  const {
    carRef,
    curveRef,
    textRef,
    currentWordIndexRef,
    currentLetterIndexRef,
    targetQuaternionRef,
    tRef,
    hasStartedState,
  } = useGame();
  const [hasStarted, setHasStarted] = hasStartedState;

  const words = useRef<NodeListOf<Element>>(
    [] as unknown as NodeListOf<Element>,
  );

  // TODO
  // - Dodaj, da se game nekak konča
  // - Dodaj, da se spaci upoštevajo / ugotovi kako jih upoštevati
  // - Naredi, da se ob prvem začetku tipkanja skrijejo nepomembne stvari
  useEffect(() => {
    words.current = document.querySelectorAll(".word");
    const handleKeyDown = (e: { key: string }) => {
      if (!e.key.match(/^[a-zA-ZčšžČŠŽ!?:,;. ]{1}$/)) return;

      const currentWord = words.current[currentWordIndexRef.current];
      const letters = currentWord?.querySelectorAll(".letter");
      const currentLetter =
        currentWord?.children[currentLetterIndexRef.current];

      if (!currentLetter || !currentWord || !letters) return;

      if (e.key === " ") {
        moveCar();
        updateText();
        return;
      }

      if (e.key === currentLetter.textContent) {
        if (!hasStarted) {
          setHasStarted(true);
        }

        currentLetter.classList.add("correct");
        currentLetterIndexRef.current++;

        // Check if the word is completed
        if (currentLetterIndexRef.current >= letters.length) {
          currentWordIndexRef.current++;
          currentLetterIndexRef.current = 0;
        }

        // Move the car
        moveCar();
        // Update the text
        updateText();

        // Check if the game is finished
        if (currentWordIndexRef.current >= words.current.length) {
          currentLetter.classList.remove("cursor");
          console.log("Game finished");
        }

        // Move the cursor to the next letter
        if (currentWordIndexRef.current < words.current.length) {
          // Remove the cursor from the current letter
          currentLetter.classList.remove("cursor");

          const nextWord = words.current[currentWordIndexRef.current];
          if (!nextWord) return;
          const nextLetter = nextWord.children[currentLetterIndexRef.current];
          if (!nextLetter) return;
          nextLetter.classList.add("cursor");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moveCar = () => {
    if (carRef.current && curveRef.current && has3D) {
      // update the car's position to create the animation
      // eslint-disable-next-line react-hooks/exhaustive-deps
      tRef.current += carSpeed;

      // Make the car stop at the end of the curve
      tRef.current = Math.min(1, tRef.current);
      const point = curveRef.current.getPointAt(tRef.current);
      const tangent = curveRef.current.getTangentAt(tRef.current);
      carRef.current.position.set(point.x, point.y - 0.5, point.z + 8);

      // Calculate the target rotation
      if (targetQuaternionRef) {
        (targetQuaternionRef.current as Quaternion).setFromAxisAngle(
          new Vector3(0, 1, 0),
          -Math.atan2(-tangent.x, tangent.z),
        );

        // Gradually rotate the car towards the target rotation
        carRef.current.quaternion.slerp(
          targetQuaternionRef.current as Quaternion,
          0.5,
        );
      }
    }
  };

  const updateText = () => {
    if (textRef.current) {
      // TODO
      // - Implement basic camera settings, which will be saved in local storage
      // - Implement the camera settings in the game
      /*
      (textRef.current as unknown as Object3D).lookAt(
      );
      */
    }
  };

  return (
    <div
      className={`noselect flex w-[60rem] flex-row flex-wrap justify-center ${className ?? ""}`}
    >
      {quote.text.split(" ").map((word, index) => (
        <span key={`${index} ${word}`} className="word">
          {word.split("").map((letter, index) => (
            <span key={`${index} ${letter}`} className="letter">
              {letter}
            </span>
          ))}
          &nbsp;
        </span>
      ))}
    </div>
  );
}
