import { z } from "zod";

// Schema for creating a new role
export const createRoleSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Role name must be at least 2 characters long")
      .max(100, "Role name must be at most 100 characters long"),
    description: z.string().optional(),
  }),
});

// Schema for getting a role by ID
export const getRoleSchema = z.object({
  params: z.object({
    id: z.string().refine((value) => !isNaN(parseInt(value)), {
      message: "ID must be a number",
    }),
  }),
});

// Schema for updating a role
export const updateRoleSchema = z.object({
  params: z.object({
    id: z.string().refine((value) => !isNaN(parseInt(value)), {
      message: "ID must be a number",
    }),
  }),
  body: z
    .object({
      name: z
        .string()
        .min(2, "Role name must be at least 2 characters long")
        .max(100, "Role name must be at most 100 characters long")
        .optional(),
      description: z.string().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field to update must be provided",
    }),
});

// Schema for deleting a role
export const deleteRoleSchema = z.object({
  params: z.object({
    id: z.string().refine((value) => !isNaN(parseInt(value)), {
      message: "ID must be a number",
    }),
  }),
});

// Schema for getting user roles
export const getUserRolesSchema = z.object({
  params: z.object({
    userId: z.string().refine((value) => !isNaN(parseInt(value)), {
      message: "User ID must be a number",
    }),
  }),
});

// Schema for assigning role to user
export const assignRoleSchema = z.object({
  params: z.object({
    userId: z.string().refine((value) => !isNaN(parseInt(value)), {
      message: "User ID must be a number",
    }),
    roleId: z.string().refine((value) => !isNaN(parseInt(value)), {
      message: "Role ID must be a number",
    }),
  }),
});

// Schema for removing role from user
export const removeRoleSchema = z.object({
  params: z.object({
    userId: z.string().refine((value) => !isNaN(parseInt(value)), {
      message: "User ID must be a number",
    }),
    roleId: z.string().refine((value) => !isNaN(parseInt(value)), {
      message: "Role ID must be a number",
    }),
  }),
});

// Export all role validation schemas
export const roleValidation = {
  createRoleSchema,
  getRoleSchema,
  updateRoleSchema,
  deleteRoleSchema,
  getUserRolesSchema,
  assignRoleSchema,
  removeRoleSchema,
};

export default roleValidation;
