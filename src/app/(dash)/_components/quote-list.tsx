"use client";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";
import { useRouter } from "next/navigation";
import { Badge } from "~/components/ui/badge";

export default function QuoteList({ quotes }: { quotes: Quote[] }) {
  const router = useRouter();

  return (
    <ScrollArea className="h-full px-3">
      <div className="flex flex-col space-y-4">
        {quotes.length > 0 ? (
          <>
            <div className="flex w-full justify-end">
              <small className="text-muted-foreground">
                {quotes.length} found
              </small>
            </div>
            {quotes.map((quote) => (
              <button
                key={quote.id}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                  //quote.selected === item.id && "bg-muted",
                  "",
                )}
                onClick={() => {
                  router.push(`/play/${quote.id}`);
                }}
                /*
            onClick={() =>
              setMail({
                ...mail,
                selected: item.id,
              })
            }
            */
              >
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="font-semibold">{quote.source}</div>
                  </div>
                  <div className="text-xs font-medium">{quote.author}</div>
                </div>
                <div className="line-clamp-2 text-xs text-muted-foreground">
                  {quote.text.substring(0, 300)}
                </div>
                <div className="flex flex-col items-center">
                  <Badge variant="default" className="capitalize">
                    {quote.lengthWord}
                  </Badge>
                </div>
              </button>
            ))}
          </>
        ) : (
          <div className="flex w-full justify-center">
            <small className="text-muted-foreground">No quotes found</small>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
