import { z } from "zod";

// Schema for creating a new FAQ
export const createFaqSchema = z.object({
  body: z.object({
    question: z
      .string()
      .min(5, "Question must be at least 5 characters long")
      .max(500, "Question must be at most 500 characters long"),
    answer: z
      .string()
      .min(5, "Answer must be at least 5 characters long")
      .max(2000, "Answer must be at most 2000 characters long"),
    is_active: z.boolean().optional(),
  }),
});

// Schema for getting an FAQ by ID
export const getFaqSchema = z.object({
  params: z.object({
    id: z.string().refine((value) => !isNaN(parseInt(value)), {
      message: "ID must be a number",
    }),
  }),
});

// Schema for updating an FAQ
export const updateFaqSchema = z.object({
  params: z.object({
    id: z.string().refine((value) => !isNaN(parseInt(value)), {
      message: "ID must be a number",
    }),
  }),
  body: z
    .object({
      question: z
        .string()
        .min(5, "Question must be at least 5 characters long")
        .max(500, "Question must be at most 500 characters long")
        .optional(),
      answer: z
        .string()
        .min(5, "Answer must be at least 5 characters long")
        .max(2000, "Answer must be at most 2000 characters long")
        .optional(),
      is_active: z.boolean().optional(),
      view_count: z.number().int().min(0).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field to update must be provided",
    }),
});

// Schema for deleting an FAQ
export const deleteFaqSchema = z.object({
  params: z.object({
    id: z.string().refine((value) => !isNaN(parseInt(value)), {
      message: "ID must be a number",
    }),
  }),
});

// Export all FAQ validation schemas
export const faqValidation = {
  createFaqSchema,
  getFaqSchema,
  updateFaqSchema,
  deleteFaqSchema,
};

export default faqValidation;
