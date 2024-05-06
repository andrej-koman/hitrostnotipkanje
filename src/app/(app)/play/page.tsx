import { getRandomQuote } from "~/server/queries";
import { calculateCarSpeed } from "~/lib/utils";
import { GameProvider } from "~/contexts/GameContext";
import Play from "./_components/play";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function PlayPage() {
  const quote = (await getRandomQuote())[0];
  const layout = cookies().get("react-resizable-panels:layout");
  const has3D = cookies().get("has3D")?.value === "true" ? true : false;
  const textSize = cookies().get("textSize")?.value ?? "2xl";

  if (!quote) {
    throw new Error("No quotes found. Please add some quotes to the database.");
  }

  const carSpeed = calculateCarSpeed(quote.text.length);
  const defaultLayout = layout
    ? (JSON.parse(layout.value) as number[])
    : undefined;

  return (
    <GameProvider>
      <div className="flex h-[calc(100vh-3.6rem)] w-screen flex-col items-center justify-center p-0">
        <Play
          textSize={textSize}
          has3D={has3D}
          defaultLayout={defaultLayout}
          quote={quote}
          carSpeed={carSpeed}
        />
      </div>
    </GameProvider>
  );
}
