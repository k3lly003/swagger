import { Router } from "express";
import { roleController } from "../controllers/roles";
import { validate, authenticate, authorize } from "../middlewares";
import { roleValidation } from "../validations/roles.validation";

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role management endpoints
 */

// All routes require authentication
router.use(authenticate);

// Role routes
router.post(
  "/",
  validate(roleValidation.createRoleSchema),
  roleController.createRole,
);

router.get("/", roleController.listRoles);

router.get(
  "/:id",
  validate(roleValidation.getRoleSchema),
  roleController.getRoleById,
);

router.put(
  "/:id",
  validate(roleValidation.updateRoleSchema),
  roleController.updateRole,
);

router.delete(
  "/:id",
  validate(roleValidation.deleteRoleSchema),
  roleController.deleteRole,
);

// User role management routes
router.get(
  "/users/:userId",
  validate(roleValidation.getUserRolesSchema),
  roleController.getUserRoles,
);

router.post(
  "/users/:userId/assign/:roleId",
  validate(roleValidation.assignRoleSchema),
  roleController.assignRoleToUser,
);

router.delete(
  "/users/:userId/remove/:roleId",
  validate(roleValidation.removeRoleSchema),
  roleController.removeRoleFromUser,
);

export default router;
