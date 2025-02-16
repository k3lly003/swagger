import { z } from "zod";

// Schema for creating a new testimonial
export const createTestimonialSchema = z.object({
  body: z.object({
    author_name: z
      .string()
      .min(2, "Author name must be at least 2 characters long")
      .max(200, "Author name must be at most 200 characters long"),
    position: z
      .string()
      .max(200, "Position must be at most 200 characters long")
      .optional(),
    image: z.string().optional(),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters long"),
    company: z
      .string()
      .max(200, "Company must be at most 200 characters long")
      .optional(),
    occupation: z
      .string()
      .max(200, "Occupation must be at most 200 characters long")
      .optional(),
    date: z
      .string()
      .datetime({ message: "Date must be a valid ISO datetime string" })
      .optional(),
    rating: z
      .number()
      .int("Rating must be an integer")
      .min(1, "Rating must be at least 1")
      .max(5, "Rating must be at most 5")
      .optional(),
  }),
});

// Schema for getting a testimonial by ID
export const getTestimonialSchema = z.object({
  params: z.object({
    id: z.string().refine((value) => !isNaN(parseInt(value)), {
      message: "ID must be a number",
    }),
  }),
});

// Schema for updating a testimonial
export const updateTestimonialSchema = z.object({
  params: z.object({
    id: z.string().refine((value) => !isNaN(parseInt(value)), {
      message: "ID must be a number",
    }),
  }),
  body: z
    .object({
      author_name: z
        .string()
        .min(2, "Author name must be at least 2 characters long")
        .max(200, "Author name must be at most 200 characters long")
        .optional(),
      position: z
        .string()
        .max(200, "Position must be at most 200 characters long")
        .optional(),
      image: z.string().optional(),
      description: z
        .string()
        .min(10, "Description must be at least 10 characters long")
        .optional(),
      company: z
        .string()
        .max(200, "Company must be at most 200 characters long")
        .optional(),
      occupation: z
        .string()
        .max(200, "Occupation must be at most 200 characters long")
        .optional(),
      date: z
        .string()
        .datetime({ message: "Date must be a valid ISO datetime string" })
        .optional(),
      rating: z
        .number()
        .int("Rating must be an integer")
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must be at most 5")
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field to update must be provided",
    }),
});

// Schema for deleting a testimonial
export const deleteTestimonialSchema = z.object({
  params: z.object({
    id: z.string().refine((value) => !isNaN(parseInt(value)), {
      message: "ID must be a number",
    }),
  }),
});

// Export all testimonial validation schemas
export const testimonialValidation = {
  createTestimonialSchema,
  getTestimonialSchema,
  updateTestimonialSchema,
  deleteTestimonialSchema,
};

export default testimonialValidation;
