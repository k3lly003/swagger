import { Router } from 'express';
import { opportunityController } from '../controllers/opportunity';
import { validate, authenticate, authorize } from '../middlewares';
import { opportunityValidation } from '../validations/opportunity';
import { z } from 'zod';

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Opportunities
 *   description: Opportunity management endpoints for fellowships and employment positions
 */

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Application management for opportunities
 */

// All routes except application submission require authentication
router.use(['/applications/:id', '/:id/applications'], authenticate);

const listAllApplicationsSchema = z.object({
  query: z.object({
    status: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional()
  })
});

// =====================================================
// IMPORTANT: Order matters in Express routing!
// More specific routes must come before generic ones
// =====================================================

// 1. First, define routes with fixed paths (no params)
router.get(
    '/',
    opportunityController.listOpportunities
);

router.post(
    '/',
    authenticate,
    (req, res, next) => {
        // Dynamically choose validation schema based on opportunity type
        const validationSchema = req.body.type === 'fellowship' 
            ? opportunityValidation.createFellowshipSchema 
            : opportunityValidation.createEmploymentSchema;
        
        validate(validationSchema)(req, res, next);
    },
    opportunityController.createOpportunity
);

// 2. Define all /applications routes (before /:id routes)
router.get(
    '/applications',
    authenticate,
    opportunityController.listAllApplications
);

router.get(
    '/applications/:id',
    authenticate,
    validate(opportunityValidation.getOpportunitySchema),
    opportunityController.getApplicationById
);

router.put(
    '/applications/:id/status',
    authenticate,
    validate(opportunityValidation.updateApplicationStatusSchema),
    opportunityController.updateApplicationStatus
);

router.post(
    '/applications/:id/review',
    authenticate,
    validate(opportunityValidation.applicationReviewSchema),
    opportunityController.submitApplicationReview
);

// 3. Then define all /:id routes
router.get(
    '/:id',
    validate(opportunityValidation.getOpportunitySchema),
    opportunityController.getOpportunityById
);

router.put(
    '/:id',
    authenticate,
    (req, res, next) => {
        // Get the opportunity type from the request or fetch it
        const validationSchema = req.body.type === 'fellowship' 
            ? opportunityValidation.updateFellowshipSchema 
            : opportunityValidation.updateEmploymentSchema;
        
        validate(validationSchema)(req, res, next);
    },
    opportunityController.updateOpportunity
);

router.delete(
    '/:id',
    authenticate,
    validate(opportunityValidation.getOpportunitySchema),
    opportunityController.deleteOpportunity
);

// 4. Finally define nested routes with /:id/something
router.post(
    '/:id/publish',
    authenticate,
    validate(opportunityValidation.getOpportunitySchema),
    opportunityController.publishOpportunity
);

router.post(
    '/:id/close',
    authenticate,
    validate(opportunityValidation.getOpportunitySchema),
    opportunityController.closeOpportunity
);

router.post(
    '/:id/apply',
    validate(opportunityValidation.applicationSubmissionSchema),
    opportunityController.submitApplication
);

router.get(
    '/:id/applications',
    authenticate,
    validate(opportunityValidation.getOpportunitySchema),
    opportunityController.listApplications
);

export default router;