import { Router } from "express";
import { categoryController } from "../controllers/categories";
import { validate, authenticate, authorize } from "../middlewares";
import { categoryValidation } from "../validations";

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Project category management endpoints
 */

// All routes require authentication
router.use(authenticate);

// Category routes
router.post(
  "/",
  validate(categoryValidation.createCategorySchema),
  categoryController.createCategory,
);

router.get("/", categoryController.listCategories);

router.get(
  "/:id",
  validate(categoryValidation.getCategorySchema),
  categoryController.getCategoryById,
);

router.put(
  "/:id",
  validate(categoryValidation.updateCategorySchema),
  categoryController.updateCategory,
);

// Add the missing DELETE endpoint
router.delete(
  "/:id",
  validate(categoryValidation.getCategorySchema), // Reusing the getCategorySchema for validation
  categoryController.deleteCategory,
);

export default router;