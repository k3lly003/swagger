import { z } from "zod";

// Schema for creating a new partner
export const createPartnerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Partner name must be at least 2 characters long")
      .max(200, "Partner name must be at most 200 characters long"),
    logo: z.string().optional(),
    website_url: z.string().url("Website URL must be a valid URL").optional(),
    location: z
      .string()
      .max(255, "Location must be at most 255 characters long")
      .optional(),
  }),
});

// Schema for getting a partner by ID
export const getPartnerSchema = z.object({
  params: z.object({
    id: z.string().refine((value) => !isNaN(parseInt(value)), {
      message: "ID must be a number",
    }),
  }),
});

// Schema for updating a partner
export const updatePartnerSchema = z.object({
  params: z.object({
    id: z.string().refine((value) => !isNaN(parseInt(value)), {
      message: "ID must be a number",
    }),
  }),
  body: z
    .object({
      name: z
        .string()
        .min(2, "Partner name must be at least 2 characters long")
        .max(200, "Partner name must be at most 200 characters long")
        .optional(),
      logo: z.string().optional(),
      website_url: z.string().url("Website URL must be a valid URL").optional(),
      location: z
        .string()
        .max(255, "Location must be at most 255 characters long")
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field to update must be provided",
    }),
});

// Schema for deleting a partner
export const deletePartnerSchema = z.object({
  params: z.object({
    id: z.string().refine((value) => !isNaN(parseInt(value)), {
      message: "ID must be a number",
    }),
  }),
});

// Export all partner validation schemas
export const partnerValidation = {
  createPartnerSchema,
  getPartnerSchema,
  updatePartnerSchema,
  deletePartnerSchema,
};

export default partnerValidation;
