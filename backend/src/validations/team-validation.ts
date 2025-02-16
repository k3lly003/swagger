import { z } from "zod";

// Common ID parameter validation
const idParam = z.object({
  id: z.string().refine((value) => !isNaN(parseInt(value)), {
    message: "ID must be a number",
  }),
});

// Schema for creating a new team type
export const createTeamTypeSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Team type name must be at least 2 characters long")
      .max(100, "Team type name must be at most 100 characters long"),
    description: z.string().optional(),
  }),
});

// Schema for getting a team type by ID
export const getTeamTypeSchema = z.object({
  params: idParam,
});

// Schema for updating a team type
export const updateTeamTypeSchema = z.object({
  params: idParam,
  body: z
    .object({
      name: z
        .string()
        .min(2, "Team type name must be at least 2 characters long")
        .max(100, "Team type name must be at most 100 characters long")
        .optional(),
      description: z.string().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field to update must be provided",
    }),
});

// Schema for deleting a team type
export const deleteTeamTypeSchema = z.object({
  params: idParam,
});

// Schema for creating a new team
export const createTeamSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long")
      .max(200, "Name must be at most 200 characters long"),
    position: z
      .string()
      .max(200, "Position must be at most 200 characters long")
      .optional(),
    photo_url: z.string().url("Photo URL must be a valid URL").optional(),
    bio: z.string().optional(),
    email: z.string().email("Email must be a valid email address").optional(),
    profile_link: z.string().url("Profile link must be a valid URL").optional(),
    skills: z.array(z.string()).optional(),
    team_type_id: z.number({
      required_error: "Team type ID is required",
      invalid_type_error: "Team type ID must be a number",
    }),
  }),
});

// Schema for getting a team by ID
export const getTeamSchema = z.object({
  params: idParam,
});

// Schema for updating a team
export const updateTeamSchema = z.object({
  params: idParam,
  body: z
    .object({
      name: z
        .string()
        .min(2, "Name must be at least 2 characters long")
        .max(200, "Name must be at most 200 characters long")
        .optional(),
      position: z
        .string()
        .max(200, "Position must be at most 200 characters long")
        .optional(),
      photo_url: z
        .string()
        .url("Photo URL must be a valid URL")
        .optional()
        .nullable(),
      bio: z.string().optional().nullable(),
      email: z
        .string()
        .email("Email must be a valid email address")
        .optional()
        .nullable(),
      profile_link: z
        .string()
        .url("Profile link must be a valid URL")
        .optional()
        .nullable(),
      skills: z.array(z.string()).optional().nullable(),
      team_type_id: z
        .number({
          invalid_type_error: "Team type ID must be a number",
        })
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field to update must be provided",
    }),
});

// Schema for deleting a team
export const deleteTeamSchema = z.object({
  params: idParam,
});

// Schema for listing teams with optional team type filter
export const listTeamsSchema = z.object({
  query: z.object({
    team_type_id: z
      .string()
      .refine((value) => !isNaN(parseInt(value)), {
        message: "Team type ID must be a number",
      })
      .optional(),
  }),
});

// Export all team validation schemas
export const teamValidation = {
  createTeamSchema,
  getTeamSchema,
  updateTeamSchema,
  deleteTeamSchema,
  listTeamsSchema,
};

// Export all team type validation schemas
export const teamTypeValidation = {
  createTeamTypeSchema,
  getTeamTypeSchema,
  updateTeamTypeSchema,
  deleteTeamTypeSchema,
};

// Default export
export default {
  teamValidation,
  teamTypeValidation,
};
