import { ApifyClient } from "apify-client";
import { APIFY_API_TOKEN } from "../config/settings";

export const apifyClient = new ApifyClient({
  token: APIFY_API_TOKEN,
});
