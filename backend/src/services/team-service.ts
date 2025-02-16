import { db } from "../db/client";
import { teams, team_types } from "../db/schema/teams";
import { eq } from "drizzle-orm";
import { AppError } from "../middlewares";
import { Logger } from "../config";

const logger = new Logger("TeamService");

// Team types for service input/output
export type CreateTeamInput = {
  name: string;
  position?: string;
  photo_url?: string;
  bio?: string;
  email?: string;
  profile_link?: string;
  skills?: string[];
  team_type_id: number;
};

export type UpdateTeamInput = {
  name?: string;
  position?: string;
  photo_url?: string;
  bio?: string;
  email?: string;
  profile_link?: string;
  skills?: string[];
  team_type_id?: number;
};

export type TeamOutput = {
  id: number;
  name: string;
  position: string | null;
  photo_url: string | null;
  bio: string | null;
  email: string | null;
  profile_link: string | null;
  skills: string[] | null;
  team_type_id: number;
  team_type?: {
    id: number;
    name: string;
  };
  created_at: Date;
  updated_at: Date;
};

// Create a new team member
export async function createTeam(
  teamData: CreateTeamInput,
): Promise<TeamOutput> {
  try {
    // Check if the team type exists
    const teamType = await db
      .select()
      .from(team_types)
      .where(eq(team_types.id, teamData.team_type_id))
      .limit(1);

    if (!teamType.length) {
      throw new AppError(
        `Team type with ID ${teamData.team_type_id} does not exist`,
        400,
      );
    }

    // Check if a team member with the same name already exists
    const existingTeam = await db
      .select()
      .from(teams)
      .where(eq(teams.name, teamData.name))
      .limit(1);

    if (existingTeam.length > 0) {
      throw new AppError(
        `Team member with name '${teamData.name}' already exists`,
        409,
      );
    }

    // Insert the team and get the ID
    const insertResult = await db
      .insert(teams)
      .values({
        name: teamData.name,
        position: teamData.position || null,
        photo_url: teamData.photo_url || null,
        bio: teamData.bio || null,
        email: teamData.email || null,
        profile_link: teamData.profile_link || null,
        skills: teamData.skills || null,
        team_type_id: teamData.team_type_id,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning({ id: teams.id });

    const newId = insertResult[0].id;

    // Get the created team with the correct ID
    const createdTeam = await db
      .select()
      .from(teams)
      .where(eq(teams.id, newId))
      .limit(1);

    if (!createdTeam.length) {
      throw new AppError("Failed to create team member", 500);
    }

    return mapToTeamOutput(createdTeam[0], teamType[0]);
  } catch (error) {
    logger.error("Error creating team member", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to create team member", 500);
  }
}

// Get team by ID
export async function getTeamById(id: number): Promise<TeamOutput> {
  try {
    const result = await db
      .select()
      .from(teams)
      .where(eq(teams.id, id))
      .limit(1);

    if (!result.length) {
      throw new AppError("Team member not found", 404);
    }

    // Get the team type
    const teamType = await db
      .select()
      .from(team_types)
      .where(eq(team_types.id, result[0].team_type_id))
      .limit(1);

    return mapToTeamOutput(result[0], teamType[0]);
  } catch (error) {
    logger.error(`Error getting team by ID: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to get team member", 500);
  }
}

// Update team
export async function updateTeam(
  id: number,
  teamData: UpdateTeamInput,
): Promise<TeamOutput> {
  try {
    // Check if team exists
    const existingTeam = await db
      .select()
      .from(teams)
      .where(eq(teams.id, id))
      .limit(1);

    if (!existingTeam.length) {
      throw new AppError("Team member not found", 404);
    }

    // If updating name, check if the new name already exists (excluding current team)
    if (teamData.name && teamData.name !== existingTeam[0].name) {
      const nameExists = await db
        .select()
        .from(teams)
        .where(eq(teams.name, teamData.name))
        .limit(1);

      if (nameExists.length > 0) {
        throw new AppError(
          `Team member with name '${teamData.name}' already exists`,
          409,
        );
      }
    }

    // If updating team type, check if it exists
    let teamType = null;
    if (teamData.team_type_id) {
      teamType = await db
        .select()
        .from(team_types)
        .where(eq(team_types.id, teamData.team_type_id))
        .limit(1);

      if (!teamType.length) {
        throw new AppError(
          `Team type with ID ${teamData.team_type_id} does not exist`,
          400,
        );
      }
    } else {
      teamType = await db
        .select()
        .from(team_types)
        .where(eq(team_types.id, existingTeam[0].team_type_id))
        .limit(1);
    }

    // Update team
    await db
      .update(teams)
      .set({
        name: teamData.name || existingTeam[0].name,
        position:
          teamData.position !== undefined
            ? teamData.position
            : existingTeam[0].position,
        photo_url:
          teamData.photo_url !== undefined
            ? teamData.photo_url
            : existingTeam[0].photo_url,
        bio: teamData.bio !== undefined ? teamData.bio : existingTeam[0].bio,
        email:
          teamData.email !== undefined ? teamData.email : existingTeam[0].email,
        profile_link:
          teamData.profile_link !== undefined
            ? teamData.profile_link
            : existingTeam[0].profile_link,
        skills:
          teamData.skills !== undefined
            ? teamData.skills
            : existingTeam[0].skills,
        team_type_id: teamData.team_type_id || existingTeam[0].team_type_id,
        updated_at: new Date(),
      })
      .where(eq(teams.id, id));

    // Get updated team
    const updatedTeam = await db
      .select()
      .from(teams)
      .where(eq(teams.id, id))
      .limit(1);

    return mapToTeamOutput(updatedTeam[0], teamType[0]);
  } catch (error) {
    logger.error(`Error updating team: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to update team member", 500);
  }
}

// Delete team
export async function deleteTeam(id: number): Promise<boolean> {
  try {
    // Check if team exists
    const existingTeam = await db
      .select()
      .from(teams)
      .where(eq(teams.id, id))
      .limit(1);

    if (!existingTeam.length) {
      throw new AppError("Team member not found", 404);
    }

    // Delete the team
    await db.delete(teams).where(eq(teams.id, id));

    return true;
  } catch (error) {
    logger.error(`Error deleting team: ${id}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to delete team member", 500);
  }
}

// List all teams
export async function listTeams(teamTypeId?: number): Promise<TeamOutput[]> {
  try {
    // Create different query paths instead of reassigning
    const teamsResult = teamTypeId
        ? await db.select().from(teams).where(eq(teams.team_type_id, teamTypeId))
        : await db.select().from(teams);

    // Get all team types
    const teamTypesResult = await db.select().from(team_types);

    // Create a map of team types by ID for quick lookup
    const teamTypesMap = teamTypesResult.reduce(
        (map, type) => {
          map[type.id] = type;
          return map;
        },
        {} as { [key: number]: any },
    );

    return teamsResult.map((team) =>
        mapToTeamOutput(team, teamTypesMap[team.team_type_id]),
    );
  } catch (error) {
    logger.error("Error listing teams", error);
    throw new AppError("Failed to list team members", 500);
  }
}

// Helper function to map database team to TeamOutput type
function mapToTeamOutput(team: any, teamType?: any): TeamOutput {
  return {
    id: team.id,
    name: team.name,
    position: team.position,
    photo_url: team.photo_url,
    bio: team.bio,
    email: team.email,
    profile_link: team.profile_link,
    skills: team.skills,
    team_type_id: team.team_type_id,
    team_type: teamType
      ? {
          id: teamType.id,
          name: teamType.name,
        }
      : undefined,
    created_at: team.created_at,
    updated_at: team.updated_at,
  };
}

// Export the service functions
export const teamService = {
  createTeam,
  getTeamById,
  updateTeam,
  deleteTeam,
  listTeams,
};

// Default export for the service object
export default teamService;
