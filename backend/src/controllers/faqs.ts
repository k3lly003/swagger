import { Request, Response } from "express";
import { faqService } from "../services/faqs";
import { AppError } from "../middlewares";
import { constants, Logger } from "../config";

const logger = new Logger("FaqController");

/**
 * @swagger
 * /faqs:
 *   post:
 *     summary: Create a new FAQ
 *     tags: [FAQs]
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
 *               - question
 *               - answer
 *             properties:
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: FAQ created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const createFaq = async (req: Request, res: Response) => {
  try {
    const userId = req.user && req.user.id ? Number(req.user.id) : 1;

    const faqData = {
      question: req.body.question,
      answer: req.body.answer,
      is_active: req.body.is_active,
    };

    const faq = await faqService.createFaq(faqData);

    res.status(201).json({
      message: "FAQ created successfully",
      faq,
    });
  } catch (error) {
    // ... rest of error handling code
  }
};

/**
 * @swagger
 * /faqs:
 *   get:
 *     summary: List all FAQs
 *     tags: [FAQs]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: active_only
 *         schema:
 *           type: boolean
 *         description: If true, returns only active FAQs
 *     responses:
 *       200:
 *         description: List of FAQs
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const listFaqs = async (req: Request, res: Response) => {
  try {
    const activeOnly = req.query.active_only === "true";
    const faqs = await faqService.listFaqs(activeOnly);

    res.status(200).json({ faqs });
  } catch (error) {
    logger.error("List FAQs error", error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "FAQ Listing Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "FAQ Listing Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /faqs/{id}:
 *   get:
 *     summary: Get FAQ by ID
 *     tags: [FAQs]
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
 *         description: FAQ found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: FAQ not found
 *       500:
 *         description: Server error
 */
export const getFaqById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const faq = await faqService.getFaqById(id);

    // Increment view count asynchronously (don't wait for completion)
    faqService.incrementViewCount(id).catch((err) => {
      logger.error(`Failed to increment view count for FAQ ${id}`, err);
    });

    res.status(200).json({ faq });
  } catch (error) {
    logger.error(`Get FAQ error: ${req.params.id}`, error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "FAQ Retrieval Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "FAQ Retrieval Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /faqs/{id}:
 *   put:
 *     summary: Update a FAQ
 *     tags: [FAQs]
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
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *               view_count:
 *                 type: integer
 *     responses:
 *       200:
 *         description: FAQ updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: FAQ not found
 *       500:
 *         description: Server error
 */
export const updateFaq = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const faqData = {
      question: req.body.question,
      answer: req.body.answer,
      is_active: req.body.is_active,
      view_count: req.body.view_count,
    };

    const faq = await faqService.updateFaq(id, faqData);

    res.status(200).json({
      message: "FAQ updated successfully",
      faq,
    });
  } catch (error) {
    logger.error(`Update FAQ error: ${req.params.id}`, error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "FAQ Update Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "FAQ Update Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /faqs/{id}:
 *   delete:
 *     summary: Delete a FAQ
 *     tags: [FAQs]
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
 *         description: FAQ deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: FAQ not found
 *       500:
 *         description: Server error
 */
export const deleteFaq = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    await faqService.deleteFaq(id);

    res.status(200).json({
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    logger.error(`Delete FAQ error: ${req.params.id}`, error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "FAQ Deletion Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "FAQ Deletion Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Create object to export all controller functions together
export const faqController = {
  createFaq,
  listFaqs,
  getFaqById,
  updateFaq,
  deleteFaq,
};

// Default export for the controller object
export default faqController;
