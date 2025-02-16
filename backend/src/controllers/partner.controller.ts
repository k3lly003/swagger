import { Request, Response } from "express";
import { partnerService } from "../services/partner.service";
import { AppError } from "../middlewares";
import { constants, Logger } from "../config";

const logger = new Logger("PartnerController");

/**
 * @swagger
 * /partners:
 *   post:
 *     summary: Create a new partner
 *     tags: [Partners]
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
 *               logo:
 *                 type: string
 *               website_url:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Partner created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const createPartner = async (req: Request, res: Response) => {
  try {
    const partnerData = {
      name: req.body.name,
      logo: req.body.logo,
      website_url: req.body.website_url,
      location: req.body.location,
    };

    const partner = await partnerService.createPartner(partnerData);

    res.status(201).json({
      message: "Partner created successfully",
      partner,
    });
  } catch (error) {
    logger.error("Create partner error", error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Partner Creation Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Partner Creation Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /partners:
 *   get:
 *     summary: List all partners
 *     tags: [Partners]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of partners
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const listPartners = async (req: Request, res: Response) => {
  try {
    const partners = await partnerService.listPartners();

    res.status(200).json({ partners });
  } catch (error) {
    logger.error("List partners error", error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Partner Listing Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Partner Listing Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /partners/{id}:
 *   get:
 *     summary: Get partner by ID
 *     tags: [Partners]
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
 *         description: Partner found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Partner not found
 *       500:
 *         description: Server error
 */
export const getPartnerById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const partner = await partnerService.getPartnerById(id);

    res.status(200).json({ partner });
  } catch (error) {
    logger.error(`Get partner error: ${req.params.id}`, error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Partner Retrieval Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Partner Retrieval Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /partners/{id}:
 *   put:
 *     summary: Update a partner
 *     tags: [Partners]
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
 *               logo:
 *                 type: string
 *               website_url:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Partner updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Partner not found
 *       409:
 *         description: Partner name already exists
 *       500:
 *         description: Server error
 */
export const updatePartner = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const partnerData = {
      name: req.body.name,
      logo: req.body.logo,
      website_url: req.body.website_url,
      location: req.body.location,
    };

    const partner = await partnerService.updatePartner(id, partnerData);

    res.status(200).json({
      message: "Partner updated successfully",
      partner,
    });
  } catch (error) {
    logger.error(`Update partner error: ${req.params.id}`, error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Partner Update Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Partner Update Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * @swagger
 * /partners/{id}:
 *   delete:
 *     summary: Delete a partner
 *     tags: [Partners]
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
 *         description: Partner deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Partner not found
 *       500:
 *         description: Server error
 */
export const deletePartner = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    await partnerService.deletePartner(id);

    res.status(200).json({
      message: "Partner deleted successfully",
    });
  } catch (error) {
    logger.error(`Delete partner error: ${req.params.id}`, error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: "Partner Deletion Error",
        message: error.message,
      });
    }
    res.status(500).json({
      error: "Partner Deletion Error",
      message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

// Create object to export all controller functions together
export const partnerController = {
  createPartner,
  listPartners,
  getPartnerById,
  updatePartner,
  deletePartner,
};

// Default export for the controller object
export default partnerController;
