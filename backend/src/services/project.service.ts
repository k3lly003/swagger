import { db, withDbTransaction } from "../db/client";
import { projects, project_members, project_updates } from "../db/schema";
import { eq, and, inArray, like, desc, asc, sql } from "drizzle-orm";
import { AppError } from "../middlewares";
import { Logger } from "../config";

const logger = new Logger("ProjectService");

// Project types for service input/output
export type CreateProjectInput = {
  name: string;
  description?: string;
  status: string;
  start_date: Date;
  end_date?: Date;
  created_by: number;
  category_id: number;
  members?: ProjectMemberInput[];
  location?: string;
  
  // New fields
  goals?: {
    items: Array<{
      id: string;
      title: string;
      description: string;
      completed?: boolean;
      order?: number;
    }>;
  };
  
  outcomes?: {
    items: Array<{
      id: string;
      title: string;
      description: string;
      status?: string;
      order?: number;
    }>;
  };
  
  media?: {
    items: Array<{
      id: string;
      type: "image" | "video";
      url: string;
      cover: boolean;
      tag?: "feature" | "description" | "others";
      title?: string;
      description?: string;
      size?: number;
      duration?: number;
      thumbnailUrl?: string;
      order?: number;
    }>;
  };
  
  other_information?: {
    [key: string]: any;
  };
};

export type UpdateProjectInput = {
  name?: string;
  description?: string;
  status?: string;
  start_date?: Date;
  end_date?: Date;
  category_id?: number;
  location?: string;
  impacted_people?: number;
  
  // New fields
  goals?: {
    items: Array<{
      id: string;
      title: string;
      description: string;
      completed?: boolean;
      order?: number;
    }>;
  };
  
  outcomes?: {
    items: Array<{
      id: string;
      title: string;
      description: string;
      status?: string;
      order?: number;
    }>;
  };
  
  media?: {
    items: Array<{
      id: string;
      type: "image" | "video";
      url: string;
      cover: boolean;
      tag?: "feature" | "description" | "others";
      title?: string;
      description?: string;
      size?: number;
      duration?: number;
      thumbnailUrl?: string;
      order?: number;
    }>;
  };
  
  other_information?: {
    [key: string]: any;
  };
};

export type ProjectOutput = {
  id: number;
  name: string;
  description: string | null;
  status: string;
  start_date: Date;
  end_date: Date | null;
  created_by: number;
  category_id: number;
  created_at: Date;
  updated_at: Date;
  location?: string | null;
  impacted_people?: number | null;
  
  // New fields
  goals?: {
    items: Array<{
      id: string;
      title: string;
      description: string;
      completed?: boolean;
      order?: number;
    }>;
  };
  
  outcomes?: {
    items: Array<{
      id: string;
      title: string;
      description: string;
      status?: string;
      order?: number;
    }>;
  };
  
  media?: {
    items: Array<{
      id: string;
      type: "image" | "video";
      url: string;
      cover: boolean;
      tag?: "feature" | "description" | "others";
      title?: string;
      description?: string;
      size?: number;
      duration?: number;
      thumbnailUrl?: string;
      order?: number;
    }>;
  };
  
  other_information?: {
    [key: string]: any;
  };
  
  members?: ProjectMemberOutput[];
};

export type ProjectMemberInput = {
  user_id: number;
  role: string;
  start_date: Date;
  end_date?: Date;
};

export type ProjectMemberOutput = {
  id: number;
  project_id: number;
  user_id: number;
  role: string;
  start_date: Date;
  end_date?: Date | null;
};

type ProjectSearchParams = {
  page: number;
  limit: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  status?: string;
  created_by?: number;
  member_id?: number;
  category_id?: number;
};

// Create a new project
export async function createProject(
  projectData: CreateProjectInput,
): Promise<ProjectOutput> {
  try {
    return await withDbTransaction(async (txDb) => {
      // Check if a project with the same name already exists
      const existingProject = await txDb
        .select({ id: projects.id })
        .from(projects)
        .where(eq(projects.name, projectData.name))
        .limit(1);

      if (existingProject.length > 0) {
        throw new AppError(`Project with name "${projectData.name}" already exists`, 409);
      }

      // Insert the project and get the auto-generated ID
      const insertResult = await txDb.insert(projects)
        .values({
          name: projectData.name,
          description: projectData.description || null,
          status: projectData.status,
          start_date: projectData.start_date,
          end_date: projectData.end_date || null,
          created_by: projectData.created_by,
          category_id: projectData.category_id,
          location: projectData.location || null,
          
          // New fields
          goals: projectData.goals || null,
          outcomes: projectData.outcomes || null,
          media: projectData.media || null,
          other_information: projectData.other_information || null,
          
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning({ id: projects.id });

      if (!insertResult.length) {
        throw new AppError("Failed to create project", 500);
      }

      const projectId = insertResult[0].id;

      // Add project members if provided
      if (projectData.members && projectData.members.length > 0) {
        for (const member of projectData.members) {
          await txDb.insert(project_members).values({
            project_id: projectId,
            user_id: member.user_id,
            role: member.role,
            start_date: member.start_date,
            end_date: member.end_date || null,
          });
        }
      }

      // Always add creator as a member with 'lead' role if not already added
      const creatorAlreadyAdded = projectData.members?.some(
        (member) => member.user_id === projectData.created_by,
      );

      if (!creatorAlreadyAdded) {
        await txDb.insert(project_members).values({
          project_id: projectId,
          user_id: projectData.created_by,
          role: "lead",
          start_date: new Date(),
        });
      }

      // Get the created project
      const createdProject = await txDb
        .select()
        .from(projects)
        .where(eq(projects.id, projectId))
        .limit(1);

      if (!createdProject.length) {
        throw new AppError("Failed to create project", 500);
      }

      // Get project members
      const members = await txDb
        .select()
        .from(project_members)
        .where(eq(project_members.project_id, projectId));

      return {
        ...mapToProjectOutput(createdProject[0]),
        members: members.map(mapToProjectMemberOutput),
      };
    });
  } catch (error) {
    logger.error("Error creating project", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to create project", 500);
  }
}

// Get project by ID
export async function getProjectById(id: number): Promise<ProjectOutput> {
  try {
    const result = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    if (!result.length) {
      throw new AppError("Project not found", 404);
    }

    // Get project members
    const members = await db
      .select()
      .from(project_members)
      .where(eq(project_members.project_id, id));

    return {
      ...mapToProjectOutput(result[0]),
      members: members.map(mapToProjectMemberOutput),
    };
  } catch (error) {
    logger.error(`Error getting project by ID: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to get project", 500);
  }
}

// Update project
export async function updateProject(
  id: number,
  projectData: UpdateProjectInput,
): Promise<ProjectOutput> {
  try {
    // Check if project exists
    const existingProject = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    if (!existingProject.length) {
      throw new AppError("Project not found", 404);
    }

    // Check if name is being updated and if it conflicts with an existing project
    if (projectData.name && projectData.name !== existingProject[0].name) {
      const nameExists = await db
        .select({ id: projects.id })
        .from(projects)
        .where(and(
          eq(projects.name, projectData.name),
          sql`${projects.id} != ${id}`
        ))
        .limit(1);

      if (nameExists.length > 0) {
        throw new AppError(`Project with name "${projectData.name}" already exists`, 409);
      }
    }

    // Update project
    await db
      .update(projects)
      .set({
        ...projectData,
        status: projectData.status as
          | "planned"
          | "active"
          | "completed"
          | "cancelled"
          | "on_hold"
          | undefined,
        updated_at: new Date(),
      })
      .where(eq(projects.id, id));

    // Get updated project
    const updatedProject = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    // Get project members
    const members = await db
      .select()
      .from(project_members)
      .where(eq(project_members.project_id, id));

    return {
      ...mapToProjectOutput(updatedProject[0]),
      members: members.map(mapToProjectMemberOutput),
    };
  } catch (error) {
    logger.error(`Error updating project: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to update project", 500);
  }
}

// Delete project
export async function deleteProject(id: number): Promise<boolean> {
  try {
    // Check if project exists
    const existingProject = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    if (!existingProject.length) {
      throw new AppError("Project not found", 404);
    }

    return await withDbTransaction(async (txDb) => {
      // Delete project members first (foreign key constraint)
      await txDb
        .delete(project_members)
        .where(eq(project_members.project_id, id));

      // Delete project updates (foreign key constraint)
      await txDb
        .delete(project_updates)
        .where(eq(project_updates.project_id, id));

      // Delete the project
      await txDb.delete(projects).where(eq(projects.id, id));

      return true;
    });
  } catch (error) {
    logger.error(`Error deleting project: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to delete project", 500);
  }
}

// Add member to project
export async function addProjectMember(
  projectId: number,
  memberData: ProjectMemberInput,
): Promise<ProjectMemberOutput> {
  try {
    // Check if project exists
    const existingProject = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!existingProject.length) {
      throw new AppError("Project not found", 404);
    }

    // Check if member is already in the project
    const existingMember = await db
      .select()
      .from(project_members)
      .where(
        and(
          eq(project_members.project_id, projectId),
          eq(project_members.user_id, memberData.user_id),
        ),
      )
      .limit(1);

    if (existingMember.length > 0) {
      throw new AppError("User is already a member of this project", 409);
    }

    // Ensure role is one of the allowed values
    const role = validateRole(memberData.role);

    const insertResult = await db.insert(project_members)
      .values({
        project_id: projectId,
        user_id: memberData.user_id,
        role: role as "lead" | "member" | "supervisor" | "contributor",
        start_date: memberData.start_date,
        end_date: memberData.end_date || null,
      })
      .returning();

    if (!insertResult.length) {
      throw new AppError("Failed to add project member", 500);
    }

    return mapToProjectMemberOutput(insertResult[0]);
  } catch (error) {
    logger.error(`Error adding member to project: ${projectId}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to add project member", 500);
  }
}

// Remove member from project
export async function removeProjectMember(
  projectId: number,
  userId: number,
): Promise<boolean> {
  try {
    // Check if the member exists in the project
    const existingMember = await db
      .select()
      .from(project_members)
      .where(
        and(
          eq(project_members.project_id, projectId),
          eq(project_members.user_id, userId),
        ),
      )
      .limit(1);

    if (!existingMember.length) {
      throw new AppError("Member not found in this project", 404);
    }

    // Remove member from project
    await db
      .delete(project_members)
      .where(
        and(
          eq(project_members.project_id, projectId),
          eq(project_members.user_id, userId),
        ),
      );

    return true;
  } catch (error) {
    logger.error(`Error removing member from project: ${projectId}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to remove project member", 500);
  }
}

// List projects with pagination and filtering
export async function listProjects(
  params: ProjectSearchParams,
): Promise<{ projects: ProjectOutput[]; total: number }> {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      sort_by = "created_at",
      sort_order = "desc",
      status,
      created_by,
      member_id,
      category_id,
    } = params;
    const offset = (page - 1) * limit;

    // Build query conditions
    const whereConditions = [];

    if (search) {
      whereConditions.push(
        sql`(${projects.name} ILIKE ${`%${search}%`} OR ${projects.description} ILIKE ${`%${search}%`})`,
      );
    }

    if (status) {
      if (
        ["planned", "active", "completed", "cancelled", "on_hold"].includes(
          status,
        )
      ) {
        whereConditions.push(
          eq(
            projects.status,
            status as
              | "planned"
              | "active"
              | "completed"
              | "cancelled"
              | "on_hold",
          ),
        );
      }
    }

    if (created_by) {
      whereConditions.push(eq(projects.created_by, created_by));
    }

    if (category_id) {
      whereConditions.push(eq(projects.category_id, category_id));
    }

    // Combine base conditions
    let whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Handle member filtering separately if needed
    let projectIds: number[] | null = null;
    if (member_id) {
      const memberProjects = await db
        .select({ project_id: project_members.project_id })
        .from(project_members)
        .where(eq(project_members.user_id, member_id));

      projectIds = memberProjects.map((p) => p.project_id);

      if (projectIds.length === 0) {
        // No projects found for this member
        return { projects: [], total: 0 };
      }

      // Add member project IDs to where clause
      const memberCondition = inArray(projects.id, projectIds);
      whereClause = whereClause
        ? and(whereClause, memberCondition)
        : memberCondition;
    }

    // Get total count for pagination
    const totalResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(projects)
      .where(whereClause);

    const total = totalResult[0]?.count || 0;

    // Sort order
    const sortDirection = sort_order === "asc" ? asc : desc;
    let orderBy;

    // Determine sort column
    switch (sort_by) {
      case "name":
        orderBy = sortDirection(projects.name);
        break;
      case "status":
        orderBy = sortDirection(projects.status);
        break;
      case "start_date":
        orderBy = sortDirection(projects.start_date);
        break;
      case "created_at":
      default:
        orderBy = sortDirection(projects.created_at);
    }

    // Get paginated results
    const result = await db
      .select()
      .from(projects)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // Get all project members for these projects
    const projectMemberMap = new Map<number, ProjectMemberOutput[]>();
    if (result.length > 0) {
      const projectIdsToFetch = result.map((p) => p.id);
      const allMembers = await db
        .select()
        .from(project_members)
        .where(inArray(project_members.project_id, projectIdsToFetch));

      // Group members by project_id
      for (const member of allMembers) {
        if (!projectMemberMap.has(member.project_id)) {
          projectMemberMap.set(member.project_id, []);
        }
        projectMemberMap
          .get(member.project_id)!
          .push(mapToProjectMemberOutput(member));
      }
    }

    // Map results and include members
    const projectList = result.map((project) => {
      return {
        ...mapToProjectOutput(project),
        members: projectMemberMap.get(project.id) || [],
      };
    });

    return {
      projects: projectList,
      total,
    };
  } catch (error) {
    logger.error("Error listing projects", error);
    throw new AppError("Failed to list projects", 500);
  }
}

// Bulk import projects
export async function importProjects(
  projectsData: CreateProjectInput[],
): Promise<{
  successful: number;
  failed: number;
  errors: { name: string; reason: string }[];
}> {
  try {
    const result = {
      successful: 0,
      failed: 0,
      errors: [] as { name: string; reason: string }[],
    };

    await withDbTransaction(async (txDb) => {
      // Process each project
      for (const projectData of projectsData) {
        try {
          // Check for duplicate project name
          const nameExists = await txDb
            .select({ id: projects.id })
            .from(projects)
            .where(eq(projects.name, projectData.name))
            .limit(1);

          if (nameExists.length > 0) {
            throw new AppError(`Project with name "${projectData.name}" already exists`, 409);
          }

          // Insert the project and get the auto-generated ID
          const insertResult = await txDb.insert(projects)
            .values({
              name: projectData.name,
              description: projectData.description || null,
              status: projectData.status,
              start_date: projectData.start_date,
              end_date: projectData.end_date || null,
              created_by: projectData.created_by,
              category_id: projectData.category_id,
              location: projectData.location || null,
              
              // New fields
              goals: projectData.goals || null,
              outcomes: projectData.outcomes || null,
              media: projectData.media || null,
              other_information: projectData.other_information || null,
              
              created_at: new Date(),
              updated_at: new Date(),
            })
            .returning({ id: projects.id });

          if (!insertResult.length) {
            throw new AppError("Failed to create project", 500);
          }

          const projectId = insertResult[0].id;

          // Add project members if provided
          if (projectData.members && projectData.members.length > 0) {
            for (const member of projectData.members) {
              await txDb.insert(project_members).values({
                project_id: projectId,
                user_id: member.user_id,
                role: member.role,
                start_date: member.start_date,
                end_date: member.end_date || null,
              });
            }
          }

          // Always add creator as a member with 'lead' role if not already added
          const creatorAlreadyAdded = projectData.members?.some(
            (member) => member.user_id === projectData.created_by,
          );

          if (!creatorAlreadyAdded) {
            await txDb.insert(project_members).values({
              project_id: projectId,
              user_id: projectData.created_by,
              role: "lead",
              start_date: new Date(),
            });
          }

          result.successful++;
        } catch (error) {
          logger.error(`Error importing project: ${projectData.name}`, error);
          result.failed++;
          result.errors.push({
            name: projectData.name,
            reason: error instanceof AppError ? error.message : "Unknown error",
          });
        }
      }
    });

    return result;
  } catch (error) {
    logger.error("Error importing projects", error);
    throw new AppError("Failed to import projects", 500);
  }
}

// Helper function to map database project to ProjectOutput type
function mapToProjectOutput(project: any): ProjectOutput {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    status: project.status,
    start_date: project.start_date,
    end_date: project.end_date,
    created_by: project.created_by,
    category_id: project.category_id,
    location: project.location,
    impacted_people: project.impacted_people,
    
    // New fields
    goals: project.goals,
    outcomes: project.outcomes,
    media: project.media,
    other_information: project.other_information,
    
    created_at: project.created_at,
    updated_at: project.updated_at,
  };
}

// Helper function to map database project member to ProjectMemberOutput type
function mapToProjectMemberOutput(member: any): ProjectMemberOutput {
  return {
    id: member.id,
    project_id: member.project_id,
    user_id: member.user_id,
    role: member.role,
    start_date: member.start_date,
    end_date: member.end_date,
  };
}

function validateRole(role: string): string {
  const allowedRoles = ["lead", "member", "supervisor", "contributor"];
  if (!allowedRoles.includes(role)) {
    throw new AppError(
      `Invalid role: ${role}. Allowed roles are: ${allowedRoles.join(", ")}`,
      400,
    );
  }
  return role;
}

export const projectService = {
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
  listProjects,
  importProjects,
};

export default projectService;