import { z } from "zod";

//author object
export const RawApifyPostAuthorSchema = z
  .object({
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
    headline: z.string().nullable().optional(),
    profile_url: z.string().url().nullable().optional(),
    profile_picture: z.string().url().nullable().optional(),
  })
  .strict();

//post_stats object
export const RawApifyPostStatsSchema = z
  .object({
    totalReactionCount: z.number().int().min(0).optional(),
    like: z.number().int().min(0).optional(),
    appreciation: z.number().int().min(0).optional(),
    empathy: z.number().int().min(0).optional(),
    interest: z.number().int().min(0).optional(),
    praise: z.number().int().min(0).optional(),
    comments: z.number().int().min(0).optional(),
    reposts: z.number().int().min(0).optional(),
  })
  .strict();

//timestamps object
export const RawApifyTimestampsSchema = z
  .object({
    date: z.string(),
    relative: z.string().optional(),
    timestamp: z.number().int().positive(), //milliseconds
  })
  .strict();

//main structure of each item in raw Apify output array
export const RawApifyEngagementItemSchema = z.object({
  action: z.string(),
  text: z.string(),
  post_url: z.string().url(),
  pagination_token: z.string().optional(),
  source_profile: z.string().url(),
  author: RawApifyPostAuthorSchema.optional(),
  post_stats: RawApifyPostStatsSchema.optional(),
  timestamps: RawApifyTimestampsSchema,
  images: z.array(z.unknown()).optional(), // for finding media type
  article: z.unknown().nullable().optional(),
});

export type IRawApifyEngagementItem = z.infer<
  typeof RawApifyEngagementItemSchema
>;
