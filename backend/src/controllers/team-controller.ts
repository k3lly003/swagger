import { Request, Response } from "express";
import { teamService } from "../services/team-service";
import { AppError } from "../middlewares";
import { constants, Logger } from "../config";

const logger = new Logger("TeamController");

/**
 * @swagger
 * /teams:
 *   post:
 *     summary: Create a new team member
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - team_type_id
 *             properties:
 *               name:
 *                 type: string
 *               position:
 *                 type: string
 *               photo_url:
 *                 type: string
 *               bio:
 *                 type: string
 *               email:
 *                 type: string
 *               profile_link:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               team_type_id:
 *                 type: number
 *     responses:
 *       201:
 *         description: Team member created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const createTeam = async (req: Request, res: Response) => {
  try {
    const teamData = {
      name: req.body.name,
      position: req.body.position,
      photo_url: req.body.photo_url,
      bio: req.body.bio,
      email: req.body.email,
      profile_link: req.body.profile_link,
      skills: req.body.skills,
      team_type_id: req.body.team_type_id,
    };

    const team = await teamService.createTeam(teamData);

    res.status(201).json({
      message: "Team member created successfully",
      team,
    });
  } catch (error) {
    logger.error("Create team error", error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Team Creation Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Team Creation Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /teams:
 *   get:
 *     summary: List all team members
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: team_type_id
 *         schema:
 *           type: number
 *         description: Filter teams by team type ID
 *     responses:
 *       200:
 *         description: List of team members
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const listTeams = async (req: Request, res: Response) => {
  try {
    const teamTypeId = req.query.team_type_id
      ? Number(req.query.team_type_id)
      : undefined;

    const teams = await teamService.listTeams(teamTypeId);

    res.status(200).json({ teams });
  } catch (error) {
    logger.error("List teams error", error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Team Listing Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Team Listing Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /teams/{id}:
 *   get:
 *     summary: Get team member by ID
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team member found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Team member not found
 *       500:
 *         description: Server error
 */
export const getTeamById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const team = await teamService.getTeamById(id);

    res.status(200).json({ team });
  } catch (error) {
    logger.error(`Get team error: ${req.params.id}`, error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Team Retrieval Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Team Retrieval Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /teams/{id}:
 *   put:
 *     summary: Update a team member
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               position:
 *                 type: string
 *               photo_url:
 *                 type: string
 *               bio:
 *                 type: string
 *               email:
 *                 type: string
 *               profile_link:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               team_type_id:
 *                 type: number
 *     responses:
 *       200:
 *         description: Team member updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Team member not found
 *       500:
 *         description: Server error
 */
export const updateTeam = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const teamData = {
      name: req.body.name,
      position: req.body.position,
      photo_url: req.body.photo_url,
      bio: req.body.bio,
      email: req.body.email,
      profile_link: req.body.profile_link,
      skills: req.body.skills,
      team_type_id: req.body.team_type_id,
    };

    const team = await teamService.updateTeam(id, teamData);

    res.status(200).json({
      message: "Team member updated successfully",
      team,
    });
  } catch (error) {
    logger.error(`Update team error: ${req.params.id}`, error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Team Update Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Team Update Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /teams/{id}:
 *   delete:
 *     summary: Delete a team member
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team member deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Team member not found
 *       500:
 *         description: Server error
 */
export const deleteTeam = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    await teamService.deleteTeam(id);

    res.status(200).json({
      message: "Team member deleted successfully",
    });
  } catch (error) {
    logger.error(`Delete team error: ${req.params.id}`, error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Team Deletion Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Team Deletion Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Create object to export all controller functions together
export const teamController = {
  createTeam,
  listTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
};

// Default export for the controller object
export default teamController;
