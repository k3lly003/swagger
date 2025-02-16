import { z } from "zod";

// Base project status validation
const projectStatusEnum = z.enum(["planned", "active", "completed", "cancelled", "on_hold"]);

// Project member role validation
const projectMemberRoleEnum = z.enum(["lead", "member", "supervisor", "contributor"]);

// Media tag validation
const mediaTagEnum = z.enum(["feature", "description", "others"]);

// Project media item validation
const mediaItemSchema = z.object({
  id: z.string().min(1, "ID is required"),
  type: z.enum(["image", "video"]),
  url: z.string().min(1, "URL is required"),
  cover: z.boolean().default(false),
  tag: mediaTagEnum.optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  size: z.number().optional(),
  duration: z.number().optional(),
  thumbnailUrl: z.string().optional(),
  order: z.number().optional(),
});

// Project goal item validation
const goalItemSchema = z.object({
  id: z.string().min(1, "ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  completed: z.boolean().optional(),
  order: z.number().optional(),
});

// Project outcome item validation
const outcomeItemSchema = z.object({
  id: z.string().min(1, "ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.string().optional(),
  order: z.number().optional(),
});

// Project member validation
const projectMemberSchema = z.object({
  user_id: z.string().min(1, "User ID is required"),
  role: projectMemberRoleEnum,
  start_date: z.string().transform((val) => new Date(val)),
  end_date: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
});

// Create project validation
export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().optional(),
    status: projectStatusEnum,
    start_date: z.string().transform((val) => new Date(val)),
    end_date: z
      .string()
      .transform((val) => new Date(val))
      .optional(),
    category_id: z.number().int().positive("Category ID is required"),
    location: z.string().optional(),
    impacted_people: z.number().int().optional(),
    
    // New fields
    goals: z.object({
      items: z.array(goalItemSchema)
    }).optional(),
    
    outcomes: z.object({
      items: z.array(outcomeItemSchema)
    }).optional(),
    
    media: z.object({
      items: z.array(mediaItemSchema)
    }).optional(),
    
    other_information: z.record(z.any()).optional(),
    
    members: z.array(projectMemberSchema).optional(),
  }),
});

// Update project validation
export const updateProjectSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Project ID is required"),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    status: projectStatusEnum.optional(),
    start_date: z
      .string()
      .transform((val) => new Date(val))
      .optional(),
    end_date: z
      .string()
      .transform((val) => new Date(val))
      .optional()
      .nullable(),
    category_id: z.number().int().positive().optional(),
    location: z.string().optional(),
    impacted_people: z.number().int().optional(),
    
    // New fields
    goals: z.object({
      items: z.array(goalItemSchema)
    }).optional(),
    
    outcomes: z.object({
      items: z.array(outcomeItemSchema)
    }).optional(),
    
    media: z.object({
      items: z.array(mediaItemSchema)
    }).optional(),
    
    other_information: z.record(z.any()).optional(),
  }),
});

// Get project by ID validation
export const getProjectSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Project ID is required"),
  }),
});

// Delete project validation
export const deleteProjectSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Project ID is required"),
  }),
});

// List projects validation
export const listProjectsSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10)),
    search: z.string().optional(),
    sort_by: z.string().optional(),
    sort_order: z.enum(["asc", "desc"]).optional(),
    status: z.string().optional(),
    created_by: z.string().optional(),
    member_id: z.string().optional(),
    category_id: z.string().optional(),
  }),
});

// Add project member validation
export const addProjectMemberSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Project ID is required"),
  }),
  body: projectMemberSchema,
});

// Remove project member validation
export const removeProjectMemberSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Project ID is required"),
    userId: z.string().min(1, "User ID is required"),
  }),
});

// Import projects validation
export const importProjectsSchema = z.object({
  body: z
    .array(
      z.object({
        name: z.string().min(1, "Project name is required"),
        description: z.string().optional(),
        status: projectStatusEnum,
        start_date: z.string().transform((val) => new Date(val)),
        end_date: z
          .string()
          .transform((val) => new Date(val))
          .optional(),
        category_id: z.number().int().positive("Category ID is required"),
        created_by: z.string().min(1, "Creator ID is required"),
        location: z.string().optional(),
        impacted_people: z.number().int().optional(),
        
        // New fields
        goals: z.object({
          items: z.array(goalItemSchema)
        }).optional(),
        
        outcomes: z.object({
          items: z.array(outcomeItemSchema)
        }).optional(),
        
        media: z.object({
          items: z.array(mediaItemSchema)
        }).optional(),
        
        other_information: z.record(z.any()).optional(),
        
        members: z.array(projectMemberSchema).optional(),
      }),
    )
    .min(1, "At least one project is required"),
});
