import { IEngagement, IInsights } from "../types/unified";
import { extractKeywords } from "../helper/textProcessing";

export function analyzeEngagements(engagements: IEngagement[]): IInsights {
  console.log(`[Analyze] Analyzing ${engagements.length} engagement items.`);

  const totalEngagements = engagements.length;

  //engagement type finding
  const engagementTypeCounts: { [key: string]: number } = {};
  engagements.forEach((e) => {
    engagementTypeCounts[e.type] = (engagementTypeCounts[e.type] || 0) + 1; //iterate if repeated or keep as one
  });

  //Top Engaged Authors
  const authorCounts: { [author: string]: number } = {};
  engagements.forEach((e) => {
    if (
      e.postDetails?.postAuthorName &&
      e.postDetails.postAuthorName !== "Unknown Author"
    ) {
      authorCounts[e.postDetails.postAuthorName] =
        (authorCounts[e.postDetails.postAuthorName] || 0) + 1;
    }
  });
  const topEngagedAuthors = Object.entries(authorCounts)
    .sort(([, countA], [, countB]) => countB - countA) //extract count from array to sort descending
    .slice(0, 5)
    .map(([author, count]) => ({ author, count }));

  //engagement topic extraction from postContentSnippet
  const allEngagementText = engagements
    .map((e) => e.postDetails?.postContentSnippet || "")
    .join(" "); //combine all text
  const topEngagementTopics = extractKeywords(allEngagementText);

  return {
    totalEngagements,
    engagementTypeDistribution: engagementTypeCounts,
    topEngagedAuthors,
    topEngagementTopics,
  };
}
