import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import projectRoutes from "./project.routes";
import categoryRoutes from "./categories";
import roleRoutes from "./roles.routes";
import teamRoutes from "./teams.routes";
import teamTypeRoutes from "./team-types.routes";
import partenerRoutes from "./partner.routes";
import testimonialRoutes from "./testimonial.routes";
import faqRoutes from "./faqs";
import newsRourtes from "./news.routes";
import opportunity from "./opportunity";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use("/categories", categoryRoutes);
router.use("/roles", roleRoutes);
router.use("/teams", teamRoutes);
router.use("/team-types", teamTypeRoutes);
router.use("/partners", partenerRoutes);
router.use("/testimonials", testimonialRoutes);
router.use("/faqs", faqRoutes);
router.use("/news", newsRourtes);
router.use("/opportunities", opportunity);

export default router;
