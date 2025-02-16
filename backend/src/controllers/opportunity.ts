import { Request, Response } from 'express';
import { opportunityService } from '../services/opportunity';
import { AppError } from '../middlewares';
import { constants, Logger } from '../config';

const logger = new Logger('OpportunityController');

/**
 * @swagger
 * /opportunities:
 *   post:
 *     summary: Create a new opportunity (fellowship or employment)
 *     tags: [Opportunities]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/CreateFellowshipRequest'
 *               - $ref: '#/components/schemas/CreateEmploymentRequest'
 *     responses:
 *       201:
 *         description: Opportunity created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const createOpportunity = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new AppError('Unauthorized', 401);
        }

        const opportunityData = {
            ...req.body,
            created_by: userId
        };

        const opportunity = await opportunityService.createOpportunity(opportunityData);

        res.status(201).json({
            message: 'Opportunity created successfully',
            opportunity
        });
    } catch (error) {
        logger.error('Create opportunity error', error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                error: 'Opportunity Creation Error',
                message: error.message
            });
        }
        res.status(500).json({
            error: 'Opportunity Creation Error',
            message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        });
    }
};

/**
 * @swagger
 * /opportunities:
 *   get:
 *     summary: List all opportunities
 *     tags: [Opportunities]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [fellowship, employment]
 *         description: Filter by opportunity type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published, closed, cancelled]
 *         description: Filter by opportunity status
 *       - in: query
 *         name: category
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *     responses:
 *       200:
 *         description: List of opportunities
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const listOpportunities = async (req: Request, res: Response) => {
    try {
        const filters = {
            type: req.query.type as string,
            status: req.query.status as string,
            category_id: req.query.category ? Number(req.query.category) : undefined
        };

        const opportunities = await opportunityService.listOpportunities(filters);

        res.status(200).json({ opportunities });
    } catch (error) {
        logger.error('List opportunities error', error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                error: 'Opportunity Listing Error',
                message: error.message
            });
        }
        res.status(500).json({
            error: 'Opportunity Listing Error',
            message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        });
    }
};

/**
 * @swagger
 * /opportunities/{id}:
 *   get:
 *     summary: Get opportunity by ID
 *     tags: [Opportunities]
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
 *         description: Opportunity found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Opportunity not found
 *       500:
 *         description: Server error
 */
export const getOpportunityById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const opportunity = await opportunityService.getOpportunityById(id);

        res.status(200).json({ opportunity });
    } catch (error) {
        logger.error(`Get opportunity error: ${req.params.id}`, error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                error: 'Opportunity Retrieval Error',
                message: error.message
            });
        }
        res.status(500).json({
            error: 'Opportunity Retrieval Error',
            message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        });
    }
};

/**
 * @swagger
 * /opportunities/{id}:
 *   put:
 *     summary: Update an opportunity
 *     tags: [Opportunities]
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
 *             oneOf:
 *               - $ref: '#/components/schemas/UpdateFellowshipRequest'
 *               - $ref: '#/components/schemas/UpdateEmploymentRequest'
 *     responses:
 *       200:
 *         description: Opportunity updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Opportunity not found
 *       500:
 *         description: Server error
 */
export const updateOpportunity = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const opportunityData = req.body;

        const opportunity = await opportunityService.updateOpportunity(id, opportunityData);

        res.status(200).json({
            message: 'Opportunity updated successfully',
            opportunity
        });
    } catch (error) {
        logger.error(`Update opportunity error: ${req.params.id}`, error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                error: 'Opportunity Update Error',
                message: error.message
            });
        }
        res.status(500).json({
            error: 'Opportunity Update Error',
            message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        });
    }
};

/**
 * @swagger
 * /opportunities/{id}/publish:
 *   post:
 *     summary: Publish an opportunity
 *     tags: [Opportunities]
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
 *         description: Opportunity published successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Opportunity not found
 *       500:
 *         description: Server error
 */
export const publishOpportunity = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const opportunity = await opportunityService.updateOpportunityStatus(id, 'published');

        res.status(200).json({
            message: 'Opportunity published successfully',
            opportunity
        });
    } catch (error) {
        logger.error(`Publish opportunity error: ${req.params.id}`, error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                error: 'Opportunity Publishing Error',
                message: error.message
            });
        }
        res.status(500).json({
            error: 'Opportunity Publishing Error',
            message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        });
    }
};

/**
 * @swagger
 * /opportunities/{id}/close:
 *   post:
 *     summary: Close an opportunity
 *     tags: [Opportunities]
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
 *         description: Opportunity closed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Opportunity not found
 *       500:
 *         description: Server error
 */
export const closeOpportunity = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const opportunity = await opportunityService.updateOpportunityStatus(id, 'closed');

        res.status(200).json({
            message: 'Opportunity closed successfully',
            opportunity
        });
    } catch (error) {
        logger.error(`Close opportunity error: ${req.params.id}`, error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                error: 'Opportunity Closing Error',
                message: error.message
            });
        }
        res.status(500).json({
            error: 'Opportunity Closing Error',
            message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        });
    }
};

/**
 * @swagger
 * /opportunities/{id}:
 *   delete:
 *     summary: Delete an opportunity
 *     tags: [Opportunities]
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
 *         description: Opportunity deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Opportunity not found
 *       500:
 *         description: Server error
 */
export const deleteOpportunity = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        await opportunityService.deleteOpportunity(id);

        res.status(200).json({
            message: 'Opportunity deleted successfully'
        });
    } catch (error) {
        logger.error(`Delete opportunity error: ${req.params.id}`, error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                error: 'Opportunity Deletion Error',
                message: error.message
            });
        }
        res.status(500).json({
            error: 'Opportunity Deletion Error',
            message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        });
    }
};

// Application Endpoints

/**
 * @swagger
 * /opportunities/{id}/apply:
 *   post:
 *     summary: Submit an application for an opportunity
 *     tags: [Applications]
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
 *             $ref: '#/components/schemas/ApplicationSubmission'
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Opportunity not found
 *       500:
 *         description: Server error
 */
export const submitApplication = async (req: Request, res: Response) => {
    try {
        const opportunityId = Number(req.params.id);
        const userId = req.user?.id; // Optional, applicant might not be a logged-in user
        
        const applicationData = {
            ...req.body,
            opportunity_id: opportunityId,
            user_id: userId
        };

        const application = await opportunityService.submitApplication(applicationData);

        res.status(201).json({
            message: 'Application submitted successfully',
            application
        });
    } catch (error) {
        logger.error(`Submit application error: ${req.params.id}`, error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                error: 'Application Submission Error',
                message: error.message
            });
        }
        res.status(500).json({
            error: 'Application Submission Error',
            message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        });
    }
};

/**
 * @swagger
 * /opportunities/{id}/applications:
 *   get:
 *     summary: List applications for an opportunity
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by application status
 *     responses:
 *       200:
 *         description: List of applications
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Opportunity not found
 *       500:
 *         description: Server error
 */
export const listApplications = async (req: Request, res: Response) => {
    try {
        const opportunityId = Number(req.params.id);
        const status = req.query.status as string;

        const applications = await opportunityService.listApplications(opportunityId, status);

        res.status(200).json({ applications });
    } catch (error) {
        logger.error(`List applications error: ${req.params.id}`, error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                error: 'Application Listing Error',
                message: error.message
            });
        }
        res.status(500).json({
            error: 'Application Listing Error',
            message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        });
    }
};

/**
 * @swagger
 * /opportunities/applications/{id}:
 *   get:
 *     summary: Get application by ID
 *     tags: [Applications]
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
 *         description: Application found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error
 */
export const getApplicationById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const application = await opportunityService.getApplicationById(id);

        res.status(200).json({ application });
    } catch (error) {
        logger.error(`Get application error: ${req.params.id}`, error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                error: 'Application Retrieval Error',
                message: error.message
            });
        }
        res.status(500).json({
            error: 'Application Retrieval Error',
            message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        });
    }
};

/**
 * @swagger
 * /opportunities/applications/{id}/status:
 *   put:
 *     summary: Update application status
 *     tags: [Applications]
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
 *             $ref: '#/components/schemas/UpdateApplicationStatus'
 *     responses:
 *       200:
 *         description: Application status updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error
 */
export const updateApplicationStatus = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;

        const application = await opportunityService.updateApplicationStatus(id, status);

        res.status(200).json({
            message: 'Application status updated successfully',
            application
        });
    } catch (error) {
        logger.error(`Update application status error: ${req.params.id}`, error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                error: 'Application Status Update Error',
                message: error.message
            });
        }
        res.status(500).json({
            error: 'Application Status Update Error',
            message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        });
    }
};

/**
 * @swagger
 * /opportunities/applications:
 *   get:
 *     summary: List all applications across all opportunities
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by application status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of all applications
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const listAllApplications = async (req: Request, res: Response) => {
    try {
        const status = req.query.status as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        
        const applications = await opportunityService.listAllApplications(status, page, limit);
        
        res.status(200).json({ applications });
    } catch (error) {
        logger.error('List all applications error', error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                error: 'Application Listing Error',
                message: error.message
            });
        }
        res.status(500).json({
            error: 'Application Listing Error',
            message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        });
    }
};

/**
 * @swagger
 * /opportunities/applications/{id}/review:
 *   post:
 *     summary: Submit a review for an application
 *     tags: [Applications]
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
 *             $ref: '#/components/schemas/ApplicationReview'
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error
 */
export const submitApplicationReview = async (req: Request, res: Response) => {
    try {
        const applicationId = Number(req.params.id);
        const reviewerId = req.user?.id;

        if (!reviewerId) {
            throw new AppError('Unauthorized', 401);
        }

        const reviewData = {
            application_id: applicationId,
            reviewer_id: Number(reviewerId),
            score: req.body.score,
            comments: req.body.comments,
            recommendation: req.body.recommendation
        };

        const review = await opportunityService.submitApplicationReview(reviewData);

        res.status(201).json({
            message: 'Review submitted successfully',
            review
        });
    } catch (error) {
        logger.error(`Submit application review error: ${req.params.id}`, error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                error: 'Review Submission Error',
                message: error.message
            });
        }
        res.status(500).json({
            error: 'Review Submission Error',
            message: constants.ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        });
    }
};


// Create object to export all controller functions together
export const opportunityController = {
    createOpportunity,
    listOpportunities,
    getOpportunityById,
    updateOpportunity,
    publishOpportunity,
    closeOpportunity,
    deleteOpportunity,
    submitApplication,
    listApplications,
    getApplicationById,
    updateApplicationStatus,
    submitApplicationReview,
    listAllApplications,

};

// Default export for the controller object
export default opportunityController;