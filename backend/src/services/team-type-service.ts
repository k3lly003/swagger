import { db } from "../db/client";
import { team_types } from "../db/schema/teams";
import { eq } from "drizzle-orm";
import { AppError } from "../middlewares";
import { Logger } from "../config";

const logger = new Logger("TeamTypeService");

// TeamType types for service input/output
export type CreateTeamTypeInput = {
  name: string;
  description?: string;
};

export type UpdateTeamTypeInput = {
  name?: string;
  description?: string;
};

export type TeamTypeOutput = {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
};

// Create a new team type
export async function createTeamType(
  teamTypeData: CreateTeamTypeInput,
): Promise<TeamTypeOutput> {
  try {
    // Check if a team type with the same name already exists
    const existingTeamType = await db
      .select()
      .from(team_types)
      .where(eq(team_types.name, teamTypeData.name))
      .limit(1);

    if (existingTeamType.length > 0) {
      throw new AppError(
        `Team type with name '${teamTypeData.name}' already exists`,
        409,
      );
    }

    // Insert the team type
    await db.insert(team_types).values({
      name: teamTypeData.name,
      description: teamTypeData.description || null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Get the created team type
    const createdTeamType = await db
      .select()
      .from(team_types)
      .where(eq(team_types.name, teamTypeData.name))
      .limit(1);

    if (!createdTeamType.length) {
      throw new AppError("Failed to create team type", 500);
    }

    return mapToTeamTypeOutput(createdTeamType[0]);
  } catch (error) {
    logger.error("Error creating team type", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to create team type", 500);
  }
}

// Get team type by ID
export async function getTeamTypeById(id: number): Promise<TeamTypeOutput> {
  try {
    const result = await db
      .select()
      .from(team_types)
      .where(eq(team_types.id, id))
      .limit(1);

    if (!result.length) {
      throw new AppError("Team type not found", 404);
    }

    return mapToTeamTypeOutput(result[0]);
  } catch (error) {
    logger.error(`Error getting team type by ID: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to get team type", 500);
  }
}

// Update team type
export async function updateTeamType(
  id: number,
  teamTypeData: UpdateTeamTypeInput,
): Promise<TeamTypeOutput> {
  try {
    // Check if team type exists
    const existingTeamType = await db
      .select()
      .from(team_types)
      .where(eq(team_types.id, id))
      .limit(1);

    if (!existingTeamType.length) {
      throw new AppError("Team type not found", 404);
    }

    // If updating name, check if the new name already exists
    if (teamTypeData.name && teamTypeData.name !== existingTeamType[0].name) {
      const nameExists = await db
        .select()
        .from(team_types)
        .where(eq(team_types.name, teamTypeData.name))
        .limit(1);

      if (nameExists.length > 0) {
        throw new AppError(
          `Team type with name '${teamTypeData.name}' already exists`,
          409,
        );
      }
    }

    // Update team type
    await db
      .update(team_types)
      .set({
        ...teamTypeData,
        updated_at: new Date(),
      })
      .where(eq(team_types.id, id));

    // Get updated team type
    const updatedTeamType = await db
      .select()
      .from(team_types)
      .where(eq(team_types.id, id))
      .limit(1);

    return mapToTeamTypeOutput(updatedTeamType[0]);
  } catch (error) {
    logger.error(`Error updating team type: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to update team type", 500);
  }
}

// Delete team type
export async function deleteTeamType(id: number): Promise<boolean> {
  try {
    // Check if team type exists
    const existingTeamType = await db
      .select()
      .from(team_types)
      .where(eq(team_types.id, id))
      .limit(1);

    if (!existingTeamType.length) {
      throw new AppError("Team type not found", 404);
    }

    // Delete the team type
    await db.delete(team_types).where(eq(team_types.id, id));

    return true;
  } catch (error) {
    logger.error(`Error deleting team type: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to delete team type", 500);
  }
}

// List all team types
export async function listTeamTypes(): Promise<TeamTypeOutput[]> {
  try {
    const result = await db.select().from(team_types);

    return result.map(mapToTeamTypeOutput);
  } catch (error) {
    logger.error("Error listing team types", error);
    throw new AppError("Failed to list team types", 500);
  }
}

// Helper function to map database team type to TeamTypeOutput
function mapToTeamTypeOutput(teamType: any): TeamTypeOutput {
  return {
    id: teamType.id,
    name: teamType.name,
    description: teamType.description,
    created_at: teamType.created_at,
    updated_at: teamType.updated_at,
  };
}

// Export the service functions
export const teamTypeService = {
  createTeamType,
  getTeamTypeById,
  updateTeamType,
  deleteTeamType,
  listTeamTypes,
};

// Default export for the service object
export default teamTypeService;
