import { Router } from "express";
import { getMetrics, addMetric } from "../controllers/metricController";
import { authenticateToken } from "../middleware/authenticateToken";

const router = Router();

router.get("/", authenticateToken, getMetrics);

router.post("/", authenticateToken, addMetric);

export default router;
