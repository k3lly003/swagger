import { Request, Response } from "express";
import { testimonialService } from "../services/testimonial.service";
import { AppError } from "../middlewares";
import { constants, Logger } from "../config";

const logger = new Logger("TestimonialController");

/**
 * @swagger
 * /testimonials:
 *   post:
 *     summary: Create a new testimonial
 *     tags: [Testimonials]
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
 *               - author_name
 *               - description
 *             properties:
 *               author_name:
 *                 type: string
 *               position:
 *                 type: string
 *               image:
 *                 type: string
 *               description:
 *                 type: string
 *               company:
 *                 type: string
 *               occupation:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       201:
 *         description: Testimonial created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const testimonialData = {
      author_name: req.body.author_name,
      position: req.body.position,
      image: req.body.image,
      description: req.body.description,
      company: req.body.company,
      occupation: req.body.occupation,
      date: req.body.date,
      rating: req.body.rating,
    };

    const testimonial =
      await testimonialService.createTestimonial(testimonialData);

    res.status(201).json({
      message: "Testimonial created successfully",
      testimonial,
    });
  } catch (error) {
    logger.error("Create testimonial error", error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Testimonial Creation Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Testimonial Creation Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /testimonials:
 *   get:
 *     summary: List all testimonials
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of testimonials
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const listTestimonials = async (req: Request, res: Response) => {
  try {
    const testimonials = await testimonialService.listTestimonials();

    res.status(200).json({ testimonials });
  } catch (error) {
    logger.error("List testimonials error", error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Testimonial Listing Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Testimonial Listing Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /testimonials/{id}:
 *   get:
 *     summary: Get testimonial by ID
 *     tags: [Testimonials]
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
 *         description: Testimonial found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Testimonial not found
 *       500:
 *         description: Server error
 */
export const getTestimonialById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const testimonial = await testimonialService.getTestimonialById(id);

    res.status(200).json({ testimonial });
  } catch (error) {
    logger.error(`Get testimonial error: ${req.params.id}`, error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Testimonial Retrieval Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Testimonial Retrieval Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /testimonials/{id}:
 *   put:
 *     summary: Update a testimonial
 *     tags: [Testimonials]
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
 *               author_name:
 *                 type: string
 *               position:
 *                 type: string
 *               image:
 *                 type: string
 *               description:
 *                 type: string
 *               company:
 *                 type: string
 *               occupation:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Testimonial updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Testimonial not found
 *       500:
 *         description: Server error
 */
export const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const testimonialData = {
      author_name: req.body.author_name,
      position: req.body.position,
      image: req.body.image,
      description: req.body.description,
      company: req.body.company,
      occupation: req.body.occupation,
      date: req.body.date,
      rating: req.body.rating,
    };

    const testimonial = await testimonialService.updateTestimonial(
      id,
      testimonialData,
    );

    res.status(200).json({
      message: "Testimonial updated successfully",
      testimonial,
    });
  } catch (error) {
    logger.error(`Update testimonial error: ${req.params.id}`, error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Testimonial Update Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Testimonial Update Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /testimonials/{id}:
 *   delete:
 *     summary: Delete a testimonial
 *     tags: [Testimonials]
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
 *         description: Testimonial deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Testimonial not found
 *       500:
 *         description: Server error
 */
export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    await testimonialService.deleteTestimonial(id);

    res.status(200).json({
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    logger.error(`Delete testimonial error: ${req.params.id}`, error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Testimonial Deletion Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Testimonial Deletion Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Create object to export all controller functions together
export const testimonialController = {
  createTestimonial,
  listTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
};

// Default export for the controller object
export default testimonialController;
