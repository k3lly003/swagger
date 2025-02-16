import { Router } from "express";
import { newsController } from "../controllers/news.controller";
import { validate, authenticate, authorize } from "../middlewares";
import { newsValidation } from "../validations/news.validation";

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: News
 *   description: News and content management endpoints
 */

// All routes require authentication
router.use(authenticate);

// Tag routes - placing these first to avoid path conflicts
router.get("/tags", newsController.listTags);

router.post(
  "/tags",
  validate(newsValidation.createTagSchema),
  newsController.createTag,
);

router.delete(
  "/tags/:id",
  validate(newsValidation.deleteTagSchema),
  newsController.deleteTag,
);

// News routes
router.post(
  "/",
  validate(newsValidation.createNewsSchema),
  newsController.createNews,
);

router.get(
  "/",
  validate(newsValidation.listNewsSchema),
  newsController.listNews,
);

router.get(
  "/:id",
  validate(newsValidation.getNewsSchema),
  newsController.getNewsById,
);

router.put(
  "/:id",
  validate(newsValidation.updateNewsSchema),
  newsController.updateNews,
);

router.delete(
  "/:id",
  validate(newsValidation.deleteNewsSchema),
  newsController.deleteNews,
);

export default router;
