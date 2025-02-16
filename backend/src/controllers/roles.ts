import { Request, Response } from "express";
import { roleService } from "../services/roles.service";
import { userService } from "../services";
import { AppError } from "../middlewares";
import { constants, Logger } from "../config";

const logger = new Logger("RoleController");

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
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
 *         description: Role created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const createRole = async (req: Request, res: Response) => {
  try {
    const roleData = {
      name: req.body.name,
      description: req.body.description,
    };

    const role = await roleService.createRole(roleData);

    res.status(201).json({
      message: "Role created successfully",
      role,
    });
  } catch (error) {
    logger.error("Create role error", error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Role Creation Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Role Creation Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: List all roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of roles
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const listRoles = async (req: Request, res: Response) => {
  try {
    const roles = await roleService.listRoles();

    res.status(200).json({ roles });
  } catch (error) {
    logger.error("List roles error", error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Role Listing Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Role Listing Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     summary: Get role by ID
 *     tags: [Roles]
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
 *         description: Role found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Role not found
 *       500:
 *         description: Server error
 */
export const getRoleById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: "Invalid Role ID",
        message: "Role ID must be a valid number",
      });
    }

    const role = await roleService.getRoleById(id);

    res.status(200).json({ role });
  } catch (error) {
    logger.error(`Get role error: ${req.params.id}`, error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Role Retrieval Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Role Retrieval Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     summary: Update a role
 *     tags: [Roles]
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
 *         description: Role updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Role not found
 *       409:
 *         description: Role name already exists
 *       500:
 *         description: Server error
 */
export const updateRole = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: "Invalid Role ID",
        message: "Role ID must be a valid number",
      });
    }

    const roleData = {
      name: req.body.name,
      description: req.body.description,
    };

    const role = await roleService.updateRole(id, roleData);

    res.status(200).json({
      message: "Role updated successfully",
      role,
    });
  } catch (error) {
    logger.error(`Update role error: ${req.params.id}`, error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Role Update Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Role Update Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Delete a role
 *     tags: [Roles]
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
 *         description: Role deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Role not found
 *       409:
 *         description: Role is in use
 *       500:
 *         description: Server error
 */
export const deleteRole = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: "Invalid Role ID",
        message: "Role ID must be a valid number",
      });
    }

    await roleService.deleteRole(id);

    res.status(200).json({
      message: "Role deleted successfully",
    });
  } catch (error) {
    logger.error(`Delete role error: ${req.params.id}`, error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Role Deletion Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Role Deletion Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /roles/users/{userId}:
 *   get:
 *     summary: Get all roles for a user
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User roles retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
export const getUserRoles = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({
        error: "Invalid User ID",
        message: "User ID must be a valid number",
      });
    }

    const userRoles = await roleService.getUserRoles(userId);

    res.status(200).json({
      userRoles,
    });
  } catch (error) {
    logger.error(`Get user roles error: ${req.params.userId}`, error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "User Roles Retrieval Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "User Roles Retrieval Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /roles/users/{userId}/assign/{roleId}:
 *   post:
 *     summary: Assign a role to a user
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Role assigned successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User or role not found
 *       409:
 *         description: User already has this role
 *       500:
 *         description: Server error
 */
export const assignRoleToUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const roleId = Number(req.params.roleId);

    if (isNaN(userId) || isNaN(roleId)) {
      return res.status(400).json({
        error: "Invalid ID",
        message: "User ID and Role ID must be valid numbers",
      });
    }

    // Add additional logging to help diagnose issues
    logger.info(`Attempting to assign role ${roleId} to user ${userId}`);

    const userRole = await roleService.assignRoleToUser(userId, roleId);

    // Get updated user to confirm role_id has changed
    const updatedUser = await userService.getUserById(userId);
    
    logger.info(`Successfully assigned role ${roleId} to user ${userId}. User role_id is now ${updatedUser.role_id}`);

    res.status(201).json({
      message: "Role assigned to user successfully",
      userRole,
      user: {
        id: updatedUser.id,
        role_id: updatedUser.role_id
      }
    });
  } catch (error) {
    logger.error(
      `Assign role error: User ${req.params.userId}, Role ${req.params.roleId}`,
      error,
    );
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Role Assignment Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Role Assignment Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /roles/users/{userId}/replace/{roleId}:
 *   post:
 *     summary: Replace all user roles with a single role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Role replaced successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User or role not found
 *       500:
 *         description: Server error
 */
export const replaceUserRole = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const roleId = Number(req.params.roleId);

    if (isNaN(userId) || isNaN(roleId)) {
      return res.status(400).json({
        error: "Invalid ID",
        message: "User ID and Role ID must be valid numbers",
      });
    }

    logger.info(
      `Attempting to replace all roles for user ${userId} with role ${roleId}`,
    );

    const userRole = await roleService.replaceUserRole(userId, roleId);

    // Get updated user to confirm role_id has changed
    const updatedUser = await userService.getUserById(userId);

    logger.info(
      `Successfully replaced roles for user ${userId} with role ${roleId}. User role_id is now ${updatedUser.role_id}`,
    );

    res.status(201).json({
      message: "User roles replaced successfully",
      userRole,
      user: {
        id: updatedUser.id,
        role_id: updatedUser.role_id
      }
    });
  } catch (error) {
    logger.error(
      `Replace role error: User ${req.params.userId}, Role ${req.params.roleId}`,
      error,
    );
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Role Replacement Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Role Replacement Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /roles/users/{userId}/remove/{roleId}:
 *   delete:
 *     summary: Remove a role from a user
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role removed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User does not have this role
 *       500:
 *         description: Server error
 */
export const removeRoleFromUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const roleId = Number(req.params.roleId);

    if (isNaN(userId) || isNaN(roleId)) {
      return res.status(400).json({
        error: "Invalid ID",
        message: "User ID and Role ID must be valid numbers",
      });
    }

    logger.info(`Attempting to remove role ${roleId} from user ${userId}`);

    await roleService.removeRoleFromUser(userId, roleId);

    // Get updated user to confirm role_id has been updated if applicable
    const updatedUser = await userService.getUserById(userId);

    logger.info(`Successfully removed role ${roleId} from user ${userId}. User role_id is now ${updatedUser.role_id}`);

    res.status(200).json({
      message: "Role removed from user successfully",
      user: {
        id: updatedUser.id,
        role_id: updatedUser.role_id
      }
    });
  } catch (error) {
    logger.error(
      `Remove role error: User ${req.params.userId}, Role ${req.params.roleId}`,
      error,
    );
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Role Removal Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Role Removal Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Create object to export all controller functions together
export const roleController = {
  createRole,
  listRoles,
  getRoleById,
  updateRole,
  deleteRole,
  getUserRoles,
  assignRoleToUser,
  replaceUserRole,
  removeRoleFromUser,
};

// Default export for the controller object
export default roleController;