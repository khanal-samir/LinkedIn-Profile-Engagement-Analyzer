import { apifyClient } from "./client";
import { APIFY_ACTOR_IDS } from "../config/settings";
import {
  RawApifyEngagementItemSchema,
  IRawApifyEngagementItem,
} from "../types/apify";

export async function fetchRawEngagements(
  profileUrl: string
): Promise<IRawApifyEngagementItem[]> {
  const actorId = APIFY_ACTOR_IDS.LINKEDIN_ENGAGEMENT_SCRAPER;

  const actorInput = {
    username: profileUrl,
    page_number: 1,
    limit: 10, // didnt make it dynamic
  };
  console.log(`[Apify] Calling Engagement Scraper for: ${profileUrl}`);
  try {
    const run = await apifyClient.actor(actorId).call(actorInput);
    const { items } = await apifyClient
      .dataset(run.defaultDatasetId)
      .listItems();

    //zod runtime validation
    const validatedItems: IRawApifyEngagementItem[] = items
      .map((item: any) => {
        const result = RawApifyEngagementItemSchema.safeParse(item); //zod validation
        if (result.success) {
          return result.data;
        } else {
          console.error(
            `[Apify] Zod validation error for a raw engagement item. Skipping this item.`,
            `Error details:`,
            result.error.issues,
            `Problematic item:`,
            JSON.stringify(item, null, 2)
          );
          return null; //for filtering error data
        }
      })
      .filter(Boolean) as IRawApifyEngagementItem[]; // Boolean(null)===false

    return validatedItems;
  } catch (error) {
    console.error("[Apify] Error during engagement scraping:", error);
    throw new Error("Failed to retrieve engagement data from Apify.");
  }
}
