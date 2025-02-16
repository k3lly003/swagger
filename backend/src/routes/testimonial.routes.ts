import { Router } from "express";
import { testimonialController } from "../controllers/testimonial.controller";
import { validate, authenticate, authorize } from "../middlewares";
import { testimonialValidation } from "../validations/testimonials.validation";

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Testimonials
 *   description: Testimonial management endpoints
 */

// All routes require authentication
router.use(authenticate);

// Testimonial routes
router.post(
  "/",
  validate(testimonialValidation.createTestimonialSchema),
  testimonialController.createTestimonial,
);

router.get("/", testimonialController.listTestimonials);

router.get(
  "/:id",
  validate(testimonialValidation.getTestimonialSchema),
  testimonialController.getTestimonialById,
);

router.put(
  "/:id",
  validate(testimonialValidation.updateTestimonialSchema),
  testimonialController.updateTestimonial,
);

router.delete(
  "/:id",
  validate(testimonialValidation.deleteTestimonialSchema),
  testimonialController.deleteTestimonial,
);

export default router;
