import {
  EngagementSchema,
  IEngagement,
  PostDetailsSchema,
  IPostDetails,
} from "../types/unified";
import { IRawApifyEngagementItem } from "../types/apify";

export function transformEngagementsToUnified(
  rawEngagements: IRawApifyEngagementItem[]
): IEngagement[] {
  console.log(
    `[Transform] Transforming ${rawEngagements.length} raw engagement items.`
  );

  return rawEngagements.map(
    (rawEng: IRawApifyEngagementItem, index: number) => {
      //determine engagement type based on action field
      let engagementType: "LIKE" | "LOVE" | "FUNNY" | "OTHERS" | "INSIGHTFUL" =
        "OTHERS";
      const actionText = rawEng.action.toLowerCase();

      if (actionText.includes("likes this")) {
        engagementType = "LIKE";
      } else if (actionText.includes("loves this")) {
        engagementType = "LOVE";
      } else if (actionText.includes("funny")) {
        engagementType = "FUNNY";
      } else if (actionText.includes("insightful")) {
        engagementType = "INSIGHTFUL";
      } else {
        engagementType = "OTHERS";
      }

      //mapping to postDetails schema
      const postDetails: IPostDetails = {
        postId: `LinkedIn-post-${index}-${Date.now()}`,
        postUrl: rawEng.post_url,
        postContentSnippet: rawEng.text,
        postAuthorName:
          rawEng.author?.firstName && rawEng.author?.lastName
            ? `${rawEng.author.firstName} ${rawEng.author.lastName}`
            : rawEng.author?.headline || "Unknown Author",

        postAuthorUrl: rawEng.author?.profile_url || "",
        mediaType: rawEng.images && rawEng.images.length > 0 ? "IMAGE" : "TEXT", //video also becomes text
        likesCount: rawEng.post_stats?.like,
        commentsCount: rawEng.post_stats?.comments,
      };

      //Zod validation -- error will be handled on main fn
      const validatedPostDetails = PostDetailsSchema.parse(postDetails);

      //mapping to EngagementSchema
      const engagement: IEngagement = {
        //unique id creation
        engagementId: `${engagementType}-${rawEng.timestamps.timestamp || Date.now()}`,
        type: engagementType,
        timestamp: rawEng.timestamps.timestamp
          ? new Date(rawEng.timestamps.timestamp).toISOString()
          : new Date(rawEng.timestamps.date).toISOString(),
        postDetails: validatedPostDetails,
      };

      //again validation as above
      return EngagementSchema.parse(engagement);
    }
  );
}
