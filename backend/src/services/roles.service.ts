import { db, withDbTransaction } from "../db/client";
import { roles, user_roles, users } from "../db/schema";
import { eq, and, max } from "drizzle-orm";
import { AppError } from "../middlewares";
import { Logger } from "../config";

const logger = new Logger("RoleService");

// Role types for service input/output
export type CreateRoleInput = {
  name: string;
  description?: string;
};

export type UpdateRoleInput = {
  name?: string;
  description?: string;
};

export type RoleOutput = {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
};

export type UserRoleOutput = {
  id: number;
  user_id: number;
  role_id: number;
  role_name: string;
  created_at: Date;
  updated_at: Date;
};

// Create a new role
export async function createRole(
  roleData: CreateRoleInput,
): Promise<RoleOutput> {
  try {
    // Check if a role with the same name already exists
    const existingRole = await db
      .select()
      .from(roles)
      .where(eq(roles.name, roleData.name))
      .limit(1);

    if (existingRole.length > 0) {
      throw new AppError(
        `Role with name '${roleData.name}' already exists`,
        409,
      );
    }

    // Get the maximum ID to generate next ID
    const maxIdResult = await db.select({ maxId: max(roles.id) }).from(roles);
    const maxId = maxIdResult[0]?.maxId || 1000;
    const roleId = maxId + 1;

    // Insert the role with an explicit ID
    await db.insert(roles).values({
      id: roleId,
      name: roleData.name,
      description: roleData.description || null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Get the created role
    const createdRole = await db
      .select()
      .from(roles)
      .where(eq(roles.id, roleId))
      .limit(1);

    if (!createdRole.length) {
      throw new AppError("Failed to create role", 500);
    }

    return mapToRoleOutput(createdRole[0]);
  } catch (error) {
    logger.error("Error creating role", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to create role", 500);
  }
}

// Get role by ID
export async function getRoleById(id: number): Promise<RoleOutput> {
  try {
    const result = await db
      .select()
      .from(roles)
      .where(eq(roles.id, id))
      .limit(1);

    if (!result.length) {
      throw new AppError("Role not found", 404);
    }

    return mapToRoleOutput(result[0]);
  } catch (error) {
    logger.error(`Error getting role by ID: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to get role", 500);
  }
}

// Get role by name
export async function getRoleByName(name: string): Promise<RoleOutput> {
  try {
    const result = await db
      .select()
      .from(roles)
      .where(eq(roles.name, name))
      .limit(1);

    if (!result.length) {
      throw new AppError("Role not found", 404);
    }

    return mapToRoleOutput(result[0]);
  } catch (error) {
    logger.error(`Error getting role by name: ${name}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to get role", 500);
  }
}

// Update role
export async function updateRole(
  id: number,
  roleData: UpdateRoleInput,
): Promise<RoleOutput> {
  try {
    // Check if role exists
    const existingRole = await db
      .select()
      .from(roles)
      .where(eq(roles.id, id))
      .limit(1);

    if (!existingRole.length) {
      throw new AppError("Role not found", 404);
    }

    // If updating name, check if the new name already exists
    if (roleData.name && roleData.name !== existingRole[0].name) {
      const nameExists = await db
        .select()
        .from(roles)
        .where(eq(roles.name, roleData.name))
        .limit(1);

      if (nameExists.length > 0) {
        throw new AppError(
          `Role with name '${roleData.name}' already exists`,
          409,
        );
      }
    }

    // Update role
    await db
      .update(roles)
      .set({
        ...(roleData.name ? { name: roleData.name } : {}),
        ...(roleData.description !== undefined
          ? { description: roleData.description }
          : {}),
        updated_at: new Date(),
      })
      .where(eq(roles.id, id));

    // Get updated role
    const updatedRole = await db
      .select()
      .from(roles)
      .where(eq(roles.id, id))
      .limit(1);

    return mapToRoleOutput(updatedRole[0]);
  } catch (error) {
    logger.error(`Error updating role: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to update role", 500);
  }
}

// Delete role
export async function deleteRole(id: number): Promise<boolean> {
  try {
    // Check if role exists
    const existingRole = await db
      .select()
      .from(roles)
      .where(eq(roles.id, id))
      .limit(1);

    if (!existingRole.length) {
      throw new AppError("Role not found", 404);
    }

    // Check if the role is assigned to any users
    const roleInUse = await db
      .select()
      .from(user_roles)
      .where(eq(user_roles.role_id, id))
      .limit(1);

    if (roleInUse.length > 0) {
      throw new AppError("Cannot delete role that is assigned to users", 409);
    }

    // Delete the role
    await db.delete(roles).where(eq(roles.id, id));

    return true;
  } catch (error) {
    logger.error(`Error deleting role: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to delete role", 500);
  }
}

// List all roles
export async function listRoles(): Promise<RoleOutput[]> {
  try {
    const result = await db.select().from(roles);

    return result.map(mapToRoleOutput);
  } catch (error) {
    logger.error("Error listing roles", error);
    throw new AppError("Failed to list roles", 500);
  }
}

// Assign role to user
export async function assignRoleToUser(
  userId: number,
  roleId: number,
): Promise<UserRoleOutput> {
  try {
    return await withDbTransaction(async (txDb) => {
      // First check if user exists
      const user = await txDb
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user.length) {
        throw new AppError("User not found", 404);
      }

      // Check if role exists
      const role = await txDb
        .select()
        .from(roles)
        .where(eq(roles.id, roleId))
        .limit(1);

      if (!role.length) {
        throw new AppError("Role not found", 404);
      }

      // Check if user already has this role
      const existingUserRole = await txDb
        .select()
        .from(user_roles)
        .where(
          and(eq(user_roles.user_id, userId), eq(user_roles.role_id, roleId)),
        )
        .limit(1);

      if (existingUserRole.length > 0) {
        throw new AppError("User already has this role", 409);
      }

      // Get maximum ID to generate next ID safely
      const maxIdResult = await txDb.select({ maxId: max(user_roles.id) }).from(user_roles);
      const maxUserRoleId = maxIdResult[0]?.maxId || 5000;
      const userRoleId = maxUserRoleId + 1;
      
      const now = new Date();

      // Perform the actual insertion of user_role
      try {
        await txDb.insert(user_roles).values({
          id: userRoleId,
          user_id: userId,
          role_id: roleId,
          created_at: now,
          updated_at: now,
        });
      } catch (insertError) {
        logger.error(`Error inserting user role: ${insertError}`);
        throw new AppError("Database error while assigning role", 500);
      }

      // Update the user's role_id in the users table
      try {
        await txDb.update(users)
          .set({
            role_id: roleId,
            updated_at: now,
          })
          .where(eq(users.id, userId));
      } catch (updateError) {
        logger.error(`Error updating user role_id: ${updateError}`);
        throw new AppError("Database error while updating user's role_id", 500);
      }

      // Get the created user role assignment with role name
      const createdUserRole = await txDb
        .select({
          id: user_roles.id,
          user_id: user_roles.user_id,
          role_id: user_roles.role_id,
          role_name: roles.name,
          created_at: user_roles.created_at,
          updated_at: user_roles.updated_at,
        })
        .from(user_roles)
        .innerJoin(roles, eq(user_roles.role_id, roles.id))
        .where(eq(user_roles.id, userRoleId))
        .limit(1);

      if (!createdUserRole.length) {
        throw new AppError("Failed to retrieve assigned role", 500);
      }

      return createdUserRole[0];
    });
  } catch (error) {
    logger.error(`Error assigning role ${roleId} to user ${userId}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to assign role to user", 500);
  }
}

// Replace all user roles with a single role
export async function replaceUserRole(
  userId: number,
  newRoleId: number,
): Promise<UserRoleOutput> {
  try {
    return await withDbTransaction(async (txDb) => {
      // Check if user exists
      const user = await txDb
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user.length) {
        throw new AppError("User not found", 404);
      }

      // Check if role exists
      const role = await txDb
        .select()
        .from(roles)
        .where(eq(roles.id, newRoleId))
        .limit(1);

      if (!role.length) {
        throw new AppError("Role not found", 404);
      }

      // Remove all existing roles for this user
      await txDb.delete(user_roles).where(eq(user_roles.user_id, userId));

      // Get maximum ID to generate next ID safely
      const maxIdResult = await txDb.select({ maxId: max(user_roles.id) }).from(user_roles);
      const maxUserRoleId = maxIdResult[0]?.maxId || 5000;
      const userRoleId = maxUserRoleId + 1;

      const now = new Date();

      // Assign new role to user
      await txDb.insert(user_roles).values({
        id: userRoleId,
        user_id: userId,
        role_id: newRoleId,
        created_at: now,
        updated_at: now,
      });

      // Update the user's role_id in the users table
      await txDb.update(users)
        .set({
          role_id: newRoleId,
          updated_at: now,
        })
        .where(eq(users.id, userId));

      // Get the created user role assignment with role name
      const createdUserRole = await txDb
        .select({
          id: user_roles.id,
          user_id: user_roles.user_id,
          role_id: user_roles.role_id,
          role_name: roles.name,
          created_at: user_roles.created_at,
          updated_at: user_roles.updated_at,
        })
        .from(user_roles)
        .innerJoin(roles, eq(user_roles.role_id, roles.id))
        .where(eq(user_roles.id, userRoleId))
        .limit(1);

      if (!createdUserRole.length) {
        throw new AppError("Failed to retrieve assigned role", 500);
      }

      return createdUserRole[0];
    });
  } catch (error) {
    logger.error(
      `Error replacing roles for user ${userId} with role ${newRoleId}`,
      error,
    );
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to replace user role", 500);
  }
}

// Remove role from user
export async function removeRoleFromUser(
  userId: number,
  roleId: number,
): Promise<boolean> {
  try {
    return await withDbTransaction(async (txDb) => {
      // Check if user has this role
      const existingUserRole = await txDb
        .select()
        .from(user_roles)
        .where(
          and(eq(user_roles.user_id, userId), eq(user_roles.role_id, roleId)),
        )
        .limit(1);

      if (!existingUserRole.length) {
        throw new AppError("User does not have this role", 404);
      }

      // Remove role from user in user_roles table
      await txDb
        .delete(user_roles)
        .where(
          and(eq(user_roles.user_id, userId), eq(user_roles.role_id, roleId)),
        );

      // Get remaining roles for this user, if any
      const remainingRoles = await txDb
        .select()
        .from(user_roles)
        .where(eq(user_roles.user_id, userId))
        .orderBy(user_roles.created_at, 'desc');

      // Update the users table to reflect the most recent role assignment
      // If no roles remain, you might need a default role or handle that accordingly
      if (remainingRoles.length > 0) {
        await txDb.update(users)
          .set({
            role_id: remainingRoles[0].role_id,
            updated_at: new Date(),
          })
          .where(eq(users.id, userId));
      } else {
        // If the user has no roles left, you might want to assign a default role
        // or handle this case according to your application's requirements
        logger.warn(`User ${userId} has no remaining roles after removal.`);
        
        // Option 1: Set to a default role (e.g., "user" role with ID 1)
        // await txDb.update(users)
        //   .set({
        //     role_id: 1, // ID of default "user" role
        //     updated_at: new Date(),
        //   })
        //   .where(eq(users.id, userId));
        
        // Option 2: Log a warning but don't change user's current role_id
        // This is the current implementation
      }

      return true;
    });
  } catch (error) {
    logger.error(`Error removing role ${roleId} from user ${userId}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to remove role from user", 500);
  }
}

// Get all roles for a user
export async function getUserRoles(userId: number): Promise<UserRoleOutput[]> {
  try {
    // Check if user exists
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length) {
      throw new AppError("User not found", 404);
    }

    // Get user roles
    const userRoles = await db
      .select({
        id: user_roles.id,
        user_id: user_roles.user_id,
        role_id: user_roles.role_id,
        role_name: roles.name,
        created_at: user_roles.created_at,
        updated_at: user_roles.updated_at,
      })
      .from(user_roles)
      .innerJoin(roles, eq(user_roles.role_id, roles.id))
      .where(eq(user_roles.user_id, userId));

    return userRoles;
  } catch (error) {
    logger.error(`Error getting roles for user ${userId}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to get user roles", 500);
  }
}

// Helper function to map database role to RoleOutput type
function mapToRoleOutput(role: any): RoleOutput {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    created_at: role.created_at,
    updated_at: role.updated_at,
  };
}

// Export the service functions
export const roleService = {
  createRole,
  getRoleById,
  getRoleByName,
  updateRole,
  deleteRole,
  listRoles,
  assignRoleToUser,
  removeRoleFromUser,
  getUserRoles,
  replaceUserRole,
};

// Default export for the service object
export default roleService;