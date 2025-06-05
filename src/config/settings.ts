import "dotenv/config";
export const APIFY_API_TOKEN = process.env.APIFY_API_KEY;
if (!APIFY_API_TOKEN) {
  console.warn(
    "APIFY_API_TOKEN is not set in your .env file. Apify calls will likely fail."
  );
}
export const APIFY_ACTOR_IDS = {
  LINKEDIN_ENGAGEMENT_SCRAPER: "FNhKFjeL8hWQtMeZI",
  //adding other actors like post or profile actor in future
};
