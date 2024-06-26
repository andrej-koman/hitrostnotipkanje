import { eq, sql, count, and } from "drizzle-orm";
import { db } from "./db";
import { favorites, quotes, stats } from "./db/schema";
import { convertSearchBy } from "~/lib/search";
import { currentUser } from "@clerk/nextjs/server";
import { type RowList } from "postgres";

/**
 * Get all the quotes from the db
 */
export async function getQuotes(): Promise<Quote[]> {
  const quotes = await db.query.quotes.findMany({
    orderBy: (model, { desc }) => desc(model.created_at),
  });

  return quotes;
}

/**
 * Filter quotes by a query and a searchBy parameter and return them.
 */
export async function getFilteredQuotes(
  query: string,
  searchBy: SearchBy,
  page: number,
  pageSize = 10,
): Promise<Quote[]> {
  const equals = convertSearchBy(searchBy);

  const offset = (page - 1) * pageSize;

  const user = await currentUser();
  let userId = user?.id;

  if (!userId) {
    // This is a hack, it wont find nothing if the user is not logged in
    userId = "nothing";
  }

  const allQuotes = await db
    .select()
    .from(quotes)
    .where(sql`LOWER(${equals}) LIKE LOWER(${`%${query}%`})`)
    .limit(pageSize)
    .offset(offset);

  return allQuotes;
}

/**
 * Count quotes by a query and a searchBy parameter and return the count.
 */
export async function countFilteredQuotes(
  query: string,
  searchBy: SearchBy,
): Promise<number> {
  const equals = convertSearchBy(searchBy);

  const quotesCount = await db
    .select({ count: count() })
    .from(quotes)
    .where(sql`LOWER(${equals}) LIKE LOWER(${`%${query}%`})`);

  if (quotesCount[0] === undefined) {
    throw new Error("No quotes found");
  }

  return quotesCount[0].count;
}

/**
 *  Get a quote by its id
 */
export async function getQuoteById(id: number): Promise<Quote> {
  // Check if a quote with that id exists
  const quote = await db
    .select()
    .from(quotes)
    .where(eq(quotes.id, id))
    .limit(1);

  if (quote[0] === undefined) {
    throw new Error("Quote not found");
  }

  return quote[0];
}

/**
 * Check if quote is favorited by a user
 */
export async function isQuoteFavoritedByUser(
  quoteId: number,
): Promise<boolean> {
  const user = await currentUser();
  const userId = user?.id;

  if (!userId || !quoteId) {
    return false;
  }

  const favorite = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.quote_id, quoteId), eq(favorites.user_id, userId)))
    .limit(1);

  return favorite[0] !== undefined;
}

/**
 * Get a random quote
 */
export async function getRandomQuote(): Promise<Quote[]> {
  // Get number of quotes
  const numQuotes = (await db.query.quotes.findMany()).length;

  const randomIndex = Math.floor(Math.random() * numQuotes);
  // Get random index

  return db
    .select()
    .from(quotes)
    .where(eq(quotes.id, randomIndex + 1));
}

/**
 * Check if a user has a stats object
 * in the database
 *
 */
export async function userHasStatsObject(userId: string): Promise<boolean> {
  const userStats = await db
    .select()
    .from(stats)
    .where(eq(stats.user_id, userId))
    .limit(1);

  return userStats[0] !== undefined;
}

/**
 * Get a users stats object
 */
export async function getUserStatsForUser(userId: string): Promise<Stats> {
  const userStats = await db
    .select()
    .from(stats)
    .where(eq(stats.user_id, userId))
    .limit(1);

  if (userStats[0] === undefined) {
    throw new Error("Stats object not found");
  }

  return userStats[0];
}

/**
 *  Create a stats object for a user
 */
export async function createUserStats(userId: string): Promise<{
  status: string;
  object: RowList<never[]>;
}> {
  return await db
    .insert(stats)
    .values({
      user_id: userId,
    })
    .then((res) => {
      return {
        status: "success",
        object: res,
      };
    });
}
