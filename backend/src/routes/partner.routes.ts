import { Router } from "express";
import { partnerController } from "../controllers/partner.controller";
import { validate, authenticate, authorize } from "../middlewares";
import { partnerValidation } from "../validations/partners.validation";

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Partners
 *   description: Partner management endpoints
 */

// All routes require authentication
router.use(authenticate);

// Partner routes
router.post(
  "/",
  validate(partnerValidation.createPartnerSchema),
  partnerController.createPartner,
);

router.get("/", partnerController.listPartners);

router.get(
  "/:id",
  validate(partnerValidation.getPartnerSchema),
  partnerController.getPartnerById,
);

router.put(
  "/:id",
  validate(partnerValidation.updatePartnerSchema),
  partnerController.updatePartner,
);

router.delete(
  "/:id",
  validate(partnerValidation.deletePartnerSchema),
  partnerController.deletePartner,
);

export default router;
