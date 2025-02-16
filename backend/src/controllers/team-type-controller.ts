import { Request, Response } from "express";
import { teamTypeService } from "../services/team-type-service";
import { AppError } from "../middlewares";
import { constants, Logger } from "../config";

const logger = new Logger("TeamTypeController");

/**
 * @swagger
 * /team-types:
 *   post:
 *     summary: Create a new team type
 *     tags: [TeamTypes]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Team type created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const createTeamType = async (req: Request, res: Response) => {
  try {
    const teamTypeData = {
      name: req.body.name,
      description: req.body.description,
    };

    const teamType = await teamTypeService.createTeamType(teamTypeData);

    res.status(201).json({
      message: "Team type created successfully",
      teamType,
    });
  } catch (error) {
    logger.error("Create team type error", error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Team Type Creation Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Team Type Creation Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /team-types:
 *   get:
 *     summary: List all team types
 *     tags: [TeamTypes]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of team types
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const listTeamTypes = async (req: Request, res: Response) => {
  try {
    const teamTypes = await teamTypeService.listTeamTypes();

    res.status(200).json({ teamTypes });
  } catch (error) {
    logger.error("List team types error", error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Team Type Listing Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Team Type Listing Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /team-types/{id}:
 *   get:
 *     summary: Get team type by ID
 *     tags: [TeamTypes]
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
 *         description: Team type found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Team type not found
 *       500:
 *         description: Server error
 */
export const getTeamTypeById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const teamType = await teamTypeService.getTeamTypeById(id);

    res.status(200).json({ teamType });
  } catch (error) {
    logger.error(`Get team type error: ${req.params.id}`, error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Team Type Retrieval Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Team Type Retrieval Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /team-types/{id}:
 *   put:
 *     summary: Update a team type
 *     tags: [TeamTypes]
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Team type updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Team type not found
 *       409:
 *         description: Team type name already exists
 *       500:
 *         description: Server error
 */
export const updateTeamType = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const teamTypeData = {
      name: req.body.name,
      description: req.body.description,
    };

    const teamType = await teamTypeService.updateTeamType(id, teamTypeData);

    res.status(200).json({
      message: "Team type updated successfully",
      teamType,
    });
  } catch (error) {
    logger.error(`Update team type error: ${req.params.id}`, error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Team Type Update Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Team Type Update Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /team-types/{id}:
 *   delete:
 *     summary: Delete a team type
 *     tags: [TeamTypes]
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
 *         description: Team type deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Team type not found
 *       500:
 *         description: Server error
 */
export const deleteTeamType = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    await teamTypeService.deleteTeamType(id);

    res.status(200).json({
      message: "Team type deleted successfully",
    });
  } catch (error) {
    logger.error(`Delete team type error: ${req.params.id}`, error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Team Type Deletion Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Team Type Deletion Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Create object to export all controller functions together
export const teamTypeController = {
  createTeamType,
  listTeamTypes,
  getTeamTypeById,
  updateTeamType,
  deleteTeamType,
};

// Default export for the controller object
export default teamTypeController;
