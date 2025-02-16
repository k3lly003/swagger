import { Request, Response } from "express";
import { categoryService } from "../services/categories";
import { AppError } from "../middlewares";
import { constants, Logger } from "../config";

const logger = new Logger("CategoryController");

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new project category
 *     tags: [Categories]
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
 *         description: Category created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const createCategory = async (req: Request, res: Response) => {
  try {
    const categoryData = {
      name: req.body.name,
      description: req.body.description,
    };

    const category = await categoryService.createCategory(categoryData);

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    logger.error("Create category error", error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Category Creation Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Category Creation Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: List all categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const listCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.listCategories();

    res.status(200).json({ categories });
  } catch (error) {
    logger.error("List categories error", error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Category Listing Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Category Listing Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
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
 *         description: Category found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const category = await categoryService.getCategoryById(id);

    res.status(200).json({ category });
  } catch (error) {
    logger.error(`Get category error: ${req.params.id}`, error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Category Retrieval Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Category Retrieval Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
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
 *         description: Category updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 *       409:
 *         description: Category name already exists
 *       500:
 *         description: Server error
 */
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const categoryData = {
      name: req.body.name,
      description: req.body.description,
    };

    const category = await categoryService.updateCategory(id, categoryData);

    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    logger.error(`Update category error: ${req.params.id}`, error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Category Update Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Category Update Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
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
 *         description: Category deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    await categoryService.deleteCategory(id);

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    logger.error(`Delete category error: ${req.params.id}`, error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Category Deletion Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Category Deletion Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Create object to export all controller functions together
export const categoryController = {
  createCategory,
  listCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};

// Default export for the controller object
export default categoryController;
