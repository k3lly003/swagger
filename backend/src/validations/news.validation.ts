import { z } from "zod";

// Media item schema
const mediaItemSchema = z.object({
  id: z.string(),
  type: z.enum(["image", "video"]),
  url: z.string().url("Invalid URL format"),
  cover: z.boolean(),
  size: z.number().optional(),
  duration: z.number().optional(),
  thumbnailUrl: z.string().url("Invalid URL format").optional(),
  order: z.number().optional(),
});

// Media schema
const mediaSchema = z.object({
  items: z.array(mediaItemSchema),
});

// Schema for creating a new news item
export const createNewsSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters long")
      .max(255, "Title must be at most 255 characters long"),
    content: z.string().min(10, "Content must be at least 10 characters long"),
    status: z.enum(["published", "not_published"]).optional(),
    publish_date: z.string().datetime().optional(),
    category: z.enum(["all", "news", "blogs", "reports", "publications"]),
    key_lessons: z.string().optional(),
    media: mediaSchema.optional(),
    tags: z.array(z.number().int().positive()).optional(),
  }),
});

// Schema for getting a news item by ID
export const getNewsSchema = z.object({
  params: z.object({
    id: z.string().refine((value) => !isNaN(parseInt(value)), {
      message: "ID must be a number",
    }),
  }),
});

// Schema for updating a news item
export const updateNewsSchema = z.object({
  params: z.object({
    id: z.string().refine((value) => !isNaN(parseInt(value)), {
      message: "ID must be a number",
    }),
  }),
  body: z
    .object({
      title: z
        .string()
        .min(3, "Title must be at least 3 characters long")
        .max(255, "Title must be at most 255 characters long")
        .optional(),
      content: z
        .string()
        .min(10, "Content must be at least 10 characters long")
        .optional(),
      status: z.enum(["published", "not_published"]).optional(),
      publish_date: z.string().datetime().optional().nullable(),
      category: z
        .enum(["all", "news", "blogs", "reports", "publications"])
        .optional(),
      key_lessons: z.string().optional().nullable(),
      media: mediaSchema.optional().nullable(),
      tags: z.array(z.number().int().positive()).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field to update must be provided",
    }),
});

// Schema for deleting a news item
export const deleteNewsSchema = z.object({
  params: z.object({
    id: z.string().refine((value) => !isNaN(parseInt(value)), {
      message: "ID must be a number",
    }),
  }),
});

// Schema for creating a new tag
export const createTagSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Tag name must be at least 2 characters long")
      .max(50, "Tag name must be at most 50 characters long"),
  }),
});

// Schema for deleting a tag
export const deleteTagSchema = z.object({
  params: z.object({
    id: z.string().refine((value) => !isNaN(parseInt(value)), {
      message: "ID must be a number",
    }),
  }),
});

// Schema for listing news with filters
export const listNewsSchema = z.object({
  query: z
    .object({
      category: z
        .enum(["all", "news", "blogs", "reports", "publications"])
        .optional(),
      status: z.enum(["published", "not_published"]).optional(),
      search: z.string().optional(),
      tags: z.string().optional(), // Comma-separated list of tag IDs
      limit: z
        .string()
        .refine((val) => !isNaN(Number(val)), {
          message: "Limit must be a number",
        })
        .optional(),
      offset: z
        .string()
        .refine((val) => !isNaN(Number(val)), {
          message: "Offset must be a number",
        })
        .optional(),
      sortBy: z.string().optional(),
      sortDir: z.enum(["asc", "desc"]).optional(),
    })
    .optional(),
});

// Export all news validation schemas
export const newsValidation = {
  createNewsSchema,
  getNewsSchema,
  updateNewsSchema,
  deleteNewsSchema,
  createTagSchema,
  deleteTagSchema,
  listNewsSchema,
};

// Default export for validation object
export default newsValidation;
