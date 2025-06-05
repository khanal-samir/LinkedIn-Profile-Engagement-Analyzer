import { z } from "zod";

//single post user engaged with
export const PostDetailsSchema = z.object({
  postId: z.string(),
  postUrl: z.string().url(),
  postContentSnippet: z.string().optional(),
  postAuthorName: z.string().optional(),
  postAuthorUrl: z.string().url().optional(),
  mediaType: z
    .enum(["TEXT", "IMAGE", "VIDEO", "ARTICLE", "UNKNOWN"])
    .default("UNKNOWN"),
  likesCount: z.number().int().min(0).optional(),
  commentsCount: z.number().int().min(0).optional(),
});

//single engagement activity
export const EngagementSchema = z.object({
  engagementId: z.string(),
  type: z.enum(["LIKE", "LOVE", "FUNNY", "INSIGHTFUL", "OTHERS"]),
  timestamp: z.string().datetime(),
  postDetails: PostDetailsSchema,
});

//insights derived from engagements
export const InsightsSchema = z.object({
  totalEngagements: z.number().int().min(0),
  engagementTypeDistribution: z.record(z.string(), z.number().int().min(0)), //object
  topEngagedAuthors: z.array(
    z.object({
      author: z.string(),
      count: z.number().int().positive(),
    })
  ),
  topEngagementTopics: z.array(
    z.object({
      topic: z.string(),
      frequency: z.number().int().positive(),
    })
  ),
});

//overall schema
export const EngagementReportSchema = z.object({
  profileUrl: z.string().url(),
  timestampGenerated: z.string().datetime(),
  recentEngagements: z.array(EngagementSchema),
  insights: InsightsSchema,
});

export type IPostDetails = z.infer<typeof PostDetailsSchema>;
export type IEngagement = z.infer<typeof EngagementSchema>;
export type IInsights = z.infer<typeof InsightsSchema>;
export type IEngagementReport = z.infer<typeof EngagementReportSchema>;
