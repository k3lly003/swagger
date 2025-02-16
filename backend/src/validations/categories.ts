import { z } from "zod";

// Schema for creating a new category
export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Category name must be at least 2 characters long")
      .max(100, "Category name must be at most 100 characters long"),
    description: z.string().optional(),
  }),
});

// Schema for getting a category by ID
export const getCategorySchema = z.object({
  params: z.object({
    id: z.string().refine((value) => !isNaN(parseInt(value)), {
      message: "ID must be a number",
    }),
  }),
});
// Schema for updating a category
export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().refine((value) => !isNaN(parseInt(value)), {
      message: "ID must be a number",
    }),
  }),
  body: z
    .object({
      name: z
        .string()
        .min(2, "Category name must be at least 2 characters long")
        .max(100, "Category name must be at most 100 characters long")
        .optional(),
      description: z.string().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field to update must be provided",
    }),
});

// Schema for deleting a category
export const deleteCategorySchema = z.object({
  params: z.object({
    id: z.string().refine((value) => !isNaN(parseInt(value)), {
      message: "ID must be a number",
    }),
  }),
});

// Export all category validation schemas
export const categoryValidation = {
  createCategorySchema,
  getCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
};

export default categoryValidation;
