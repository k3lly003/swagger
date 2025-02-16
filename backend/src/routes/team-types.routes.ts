import { Router } from "express";
import { teamTypeController } from "../controllers/team-type-controller";
import { validate, authenticate, authorize } from "../middlewares";
import { teamTypeValidation } from "../validations/team-validation";

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: TeamTypes
 *   description: Team type management endpoints
 */

// All routes require authentication
router.use(authenticate);

// Team type routes
router.post(
  "/",
  validate(teamTypeValidation.createTeamTypeSchema),
  teamTypeController.createTeamType,
);

router.get("/", teamTypeController.listTeamTypes);

router.get(
  "/:id",
  validate(teamTypeValidation.getTeamTypeSchema),
  teamTypeController.getTeamTypeById,
);

router.put(
  "/:id",
  validate(teamTypeValidation.updateTeamTypeSchema),
  teamTypeController.updateTeamType,
);

router.delete(
  "/:id",
  validate(teamTypeValidation.deleteTeamTypeSchema),
  teamTypeController.deleteTeamType,
);

export default router;
