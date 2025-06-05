import "dotenv/config";
import * as fs from "fs";
import { z } from "zod";
import { fetchRawEngagements } from "./apify/engagementScrapper";
import { transformEngagementsToUnified } from "./transformer/engagementTransformer";
import { analyzeEngagements } from "./analyzer/engamentAnalyzer";
import { EngagementReportSchema } from "./types/unified";
import { validateLinkedInProfileUrl } from "./helper/lib";

const args = process.argv.slice(2);
const profileUrl = args[0];
validateLinkedInProfileUrl(profileUrl);

async function main() {
  try {
    console.log(`Starting LinkedIn Engagement Analysis for: ${profileUrl}`);

    const rawEngagements = await fetchRawEngagements(profileUrl);
    if (rawEngagements.length === 0) {
      console.log(
        "No recent engagement data found for this profile from Apify."
      ); //still process rather than exiting
    }
    const recentEngagements = transformEngagementsToUnified(rawEngagements);
    console.log(
      `[Main] Successfully transformed ${recentEngagements.length} engagement records.`
    );

    const insights = analyzeEngagements(recentEngagements);
    console.log("[Main] Insights generated successfully.");

    const finalReport = {
      profileUrl: profileUrl,
      timestampGenerated: new Date().toISOString(),
      recentEngagements: recentEngagements,
      insights: insights,
    };

    const validatedReport = EngagementReportSchema.parse(finalReport);
    console.log(
      "[Main] Final report validated with Zod - everything looks good!"
    );

    //Output report to a file and console
    const outputDir = "./data";
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true }); // Create 'data' directory if it doesn't exist
    }
    const outputFileName = `${outputDir}/engagement_report_${new Date().toISOString().replace(/:/g, "-")}.json`;
    fs.writeFileSync(outputFileName, JSON.stringify(validatedReport, null, 2));

    console.log(`Analysis Complete! Output saved to: ${outputFileName}`);
    console.log(JSON.stringify(validatedReport, null, 2));
  } catch (error) {
    console.error("An unhandled error occurred during execution");
    if (error instanceof z.ZodError) {
      console.error("Data validation failed (ZodError):", error.issues); //array of issues
      console.error(error);
    } else {
      console.error("General Error:s", error);
    }

    process.exit(1);
  }
}

main();
