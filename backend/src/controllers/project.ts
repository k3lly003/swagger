import { Request, Response } from "express";
import { projectService } from "../services";
import { AppError } from "../middlewares";
import { constants, Logger } from "../config";
import { db } from "../db/client";
import { project_categories } from "../db/schema";
import { eq } from "drizzle-orm";

const logger = new Logger("ProjectController");

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
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
 *               - status
 *               - start_date
 *               - category_id
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [planned, active, completed, cancelled, on_hold]
 *               start_date:
 *                 type: string
 *                 format: date-time
 *               end_date:
 *                 type: string
 *                 format: date-time
 *               category_id:
 *                 type: integer
 *               location:
 *                 type: string
 *               impacted_people:
 *                 type: integer
 *               goals:
 *                 type: object
 *                 properties:
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       required:
 *                         - id
 *                         - title
 *                         - description
 *                       properties:
 *                         id:
 *                           type: string
 *                         title:
 *                           type: string
 *                         description:
 *                           type: string
 *                         completed:
 *                           type: boolean
 *                         order:
 *                           type: integer
 *               outcomes:
 *                 type: object
 *                 properties:
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       required:
 *                         - id
 *                         - title
 *                         - description
 *                       properties:
 *                         id:
 *                           type: string
 *                         title:
 *                           type: string
 *                         description:
 *                           type: string
 *                         status:
 *                           type: string
 *                         order:
 *                           type: integer
 *               media:
 *                 type: object
 *                 properties:
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       required:
 *                         - id
 *                         - type
 *                         - url
 *                       properties:
 *                         id:
 *                           type: string
 *                         type:
 *                           type: string
 *                           enum: [image, video]
 *                         url:
 *                           type: string
 *                         cover:
 *                           type: boolean
 *                         tag:
 *                           type: string
 *                           enum: [feature, description, others]
 *                         title:
 *                           type: string
 *                         description:
 *                           type: string
 *                         size:
 *                           type: integer
 *                         duration:
 *                           type: integer
 *                         thumbnailUrl:
 *                           type: string
 *                         order:
 *                           type: integer
 *               other_information:
 *                 type: object
 *               members:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - user_id
 *                     - role
 *                     - start_date
 *                   properties:
 *                     user_id:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [lead, member, supervisor, contributor]
 *                     start_date:
 *                       type: string
 *                       format: date-time
 *                     end_date:
 *                       type: string
 *                       format: date-time
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const createProject = async (req: Request, res: Response) => {
  try {
    // Check if category exists before creating project
    const categoryId = Number(req.body.category_id);

    // Add this check
    const categoryExists = await db
      .select({ id: project_categories.id })
      .from(project_categories)
      .where(eq(project_categories.id, categoryId))
      .limit(1);

    if (!categoryExists.length) {
      return res.status(400).json({
        error: "Validation Error",
        message: `Category with ID ${categoryId} does not exist`,
      });
    }

    // Parse dates from strings to Date objects and ensure IDs are numbers
    const projectData = {
      ...req.body,
      created_by: Number(req.user!.id),
      start_date: new Date(req.body.start_date),
      end_date: req.body.end_date ? new Date(req.body.end_date) : undefined,
      // Also parse dates for members
      members: req.body.members
        ? req.body.members.map((member: any) => ({
            ...member,
            user_id: Number(member.user_id),
            start_date: new Date(member.start_date),
            end_date: member.end_date ? new Date(member.end_date) : undefined,
          }))
        : undefined,
    };

    const project = await projectService.createProject(projectData);

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    logger.error("Create project error", error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Project Creation Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Project Creation Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
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
 *         description: Project found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const project = await projectService.getProjectById(id);

    res.status(200).json({ project });
  } catch (error) {
    logger.error(`Get project error: ${req.params.id}`, error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Project Retrieval Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Project Retrieval Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Update project
 *     tags: [Projects]
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
 *               status:
 *                 type: string
 *                 enum: [planned, active, completed, cancelled, on_hold]
 *               start_date:
 *                 type: string
 *                 format: date-time
 *               end_date:
 *                 type: string
 *                 format: date-time
 *               category_id:
 *                 type: integer
 *               location:
 *                 type: string
 *               impacted_people:
 *                 type: integer
 *               goals:
 *                 type: object
 *                 properties:
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       required:
 *                         - id
 *                         - title
 *                         - description
 *                       properties:
 *                         id:
 *                           type: string
 *                         title:
 *                           type: string
 *                         description:
 *                           type: string
 *                         completed:
 *                           type: boolean
 *                         order:
 *                           type: integer
 *               outcomes:
 *                 type: object
 *                 properties:
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       required:
 *                         - id
 *                         - title
 *                         - description
 *                       properties:
 *                         id:
 *                           type: string
 *                         title:
 *                           type: string
 *                         description:
 *                           type: string
 *                         status:
 *                           type: string
 *                         order:
 *                           type: integer
 *               media:
 *                 type: object
 *                 properties:
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       required:
 *                         - id
 *                         - type
 *                         - url
 *                       properties:
 *                         id:
 *                           type: string
 *                         type:
 *                           type: string
 *                           enum: [image, video]
 *                         url:
 *                           type: string
 *                         cover:
 *                           type: boolean
 *                         tag:
 *                           type: string
 *                           enum: [feature, description, others]
 *                         title:
 *                           type: string
 *                         description:
 *                           type: string
 *                         size:
 *                           type: integer
 *                         duration:
 *                           type: integer
 *                         thumbnailUrl:
 *                           type: string
 *                         order:
 *                           type: integer
 *               other_information:
 *                 type: object
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
export const updateProject = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    // Parse dates from strings to Date objects
    const projectData = {
      ...req.body,
      start_date: req.body.start_date
        ? new Date(req.body.start_date)
        : undefined,
      end_date: req.body.end_date ? new Date(req.body.end_date) : undefined,
    };

    // Check if user has permission to update this project
    // (You could add a check here to see if the user is a project owner or admin)

    const project = await projectService.updateProject(id, projectData);

    res.status(200).json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    logger.error(`Update project error: ${req.params.id}`, error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Project Update Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Project Update Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete project
 *     tags: [Projects]
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
 *         description: Project deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    // Check if user has permizssion to delete this project
    // (You could add a check here to see if the user is a project owner or admin)

    await projectService.deleteProject(id);

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    logger.error(`Delete project error: ${req.params.id}`, error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Project Deletion Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Project Deletion Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /projects/import:
 *   post:
 *     summary: Import multiple projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - name
 *                 - status
 *                 - start_date
 *                 - category_id
 *               properties:
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [planned, active, completed, cancelled, on_hold]
 *                 start_date:
 *                   type: string
 *                   format: date-time
 *                 end_date:
 *                   type: string
 *                   format: date-time
 *                 category_id:
 *                   type: integer
 *                 location:
 *                   type: string
 *                 impacted_people:
 *                   type: integer
 *                 goals:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required:
 *                           - id
 *                           - title
 *                           - description
 *                         properties:
 *                           id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           description:
 *                             type: string
 *                           completed:
 *                             type: boolean
 *                           order:
 *                             type: integer
 *                 outcomes:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required:
 *                           - id
 *                           - title
 *                           - description
 *                         properties:
 *                           id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           description:
 *                             type: string
 *                           status:
 *                             type: string
 *                           order:
 *                             type: integer
 *                 media:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required:
 *                           - id
 *                           - type
 *                           - url
 *                         properties:
 *                           id:
 *                             type: string
 *                           type:
 *                             type: string
 *                             enum: [image, video]
 *                           url:
 *                             type: string
 *                           cover:
 *                             type: boolean
 *                           tag:
 *                             type: string
 *                             enum: [feature, description, others]
 *                           title:
 *                             type: string
 *                           description:
 *                             type: string
 *                           size:
 *                             type: integer
 *                           duration:
 *                             type: integer
 *                           thumbnailUrl:
 *                             type: string
 *                           order:
 *                             type: integer
 *                 other_information:
 *                   type: object
 *                 members:
 *                   type: array
 *                   items:
 *                     type: object
 *                     required:
 *                       - user_id
 *                       - role
 *                       - start_date
 *                     properties:
 *                       user_id:
 *                         type: string
 *                       role:
 *                         type: string
 *                         enum: [lead, member, supervisor, contributor]
 *                       start_date:
 *                         type: string
 *                         format: date-time
 *                       end_date:
 *                         type: string
 *                         format: date-time
 *     responses:
 *       200:
 *         description: Projects imported successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const importProjects = async (req: Request, res: Response) => {
  try {
    const projectsData = req.body.map((project: any) => ({
      ...project,
      created_by: Number(req.user!.id),
      category_id: Number(project.category_id),
      start_date: new Date(project.start_date),
      end_date: project.end_date ? new Date(project.end_date) : undefined,
      members: project.members
        ? project.members.map((member: any) => ({
            ...member,
            user_id: Number(member.user_id),
            start_date: new Date(member.start_date),
            end_date: member.end_date ? new Date(member.end_date) : undefined,
          }))
        : undefined,
    }));

    const result = await projectService.importProjects(projectsData);

    res.status(200).json({
      message: `Successfully imported ${result.successful} projects. Failed to import ${result.failed} projects.`,
      ...result,
    });
  } catch (error) {
    logger.error("Import projects error", error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Project Import Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Project Import Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: List projects with pagination and filtering
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [name, status, start_date, created_at]
 *           default: created_at
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [planned, active, completed, cancelled, on_hold]
 *       - in: query
 *         name: created_by
 *         schema:
 *           type: string
 *       - in: query
 *         name: member_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of projects
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const listProjects = async (req: Request, res: Response) => {
  try {
    const params = {
      page: parseInt(req.query.page as string, 10) || 1,
      limit: parseInt(req.query.limit as string, 10) || 10,
      search: req.query.search as string,
      sort_by: req.query.sort_by as string,
      sort_order: req.query.sort_order as "asc" | "desc",
      status: req.query.status as string,
      created_by: req.query.created_by
        ? Number(req.query.created_by)
        : undefined,
      member_id: req.query.member_id ? Number(req.query.member_id) : undefined,
      category_id: req.query.category_id ? Number(req.query.category_id) : undefined,
    };

    const { projects, total } = await projectService.listProjects(params);

    res.status(200).json({
      projects,
      pagination: {
        total,
        page: params.page,
        limit: params.limit,
        pages: Math.ceil(total / params.limit),
      },
    });
  } catch (error) {
    logger.error("List projects error", error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Project Listing Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Project Listing Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /projects/{id}/members:
 *   post:
 *     summary: Add member to project
 *     tags: [Projects]
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
 *             required:
 *               - user_id
 *               - role
 *               - start_date
 *             properties:
 *               user_id:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [lead, member, supervisor, contributor]
 *               start_date:
 *                 type: string
 *                 format: date-time
 *               end_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Member added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 *       409:
 *         description: User is already a member
 *       500:
 *         description: Server error
 */
export const addProjectMember = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    // Parse dates and ensure user_id is a number
    const memberData = {
      ...req.body,
      user_id: Number(req.body.user_id),
      start_date: new Date(req.body.start_date),
      end_date: req.body.end_date ? new Date(req.body.end_date) : undefined,
    };

    // Check if user has permission to add members to this project
    // (You could add a check here to see if the user is a project owner or admin)

    const member = await projectService.addProjectMember(id, memberData);

    res.status(201).json({
      message: "Member added to project successfully",
      member,
    });
  } catch (error) {
    logger.error(`Add project member error: ${req.params.id}`, error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Project Member Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Project Member Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /projects/{id}/members/{userId}:
 *   delete:
 *     summary: Remove member from project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member removed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project or member not found
 *       500:
 *         description: Server error
 */
export const removeProjectMember = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = Number(req.params.userId);

    // Check if user has permission to remove members from this project
    // (You could add a check here to see if the user is a project owner or admin)

    await projectService.removeProjectMember(id, userId);

    res.status(200).json({
      message: "Member removed from project successfully",
    });
  } catch (error) {
    logger.error(
      `Remove project member error: ${req.params.id}/${req.params.userId}`,
      error,
    );
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Project Member Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Project Member Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Create object to export all controller functions together
export const projectController = {
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  importProjects,
  listProjects,
  addProjectMember,
  removeProjectMember,
};

// Default export for the controller object
export default projectController;