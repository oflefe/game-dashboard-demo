"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
const index_1 = require("../src/index"); // Ensure app is exported from index.ts
const metricController_1 = require("../src/controllers/metricController");
const authenticateToken_1 = require("../src/middleware/authenticateToken");
vitest_1.vi.mock("../src/controllers/metricController", () => ({
    getMetrics: vitest_1.vi.fn(),
    addMetric: vitest_1.vi.fn(),
}));
vitest_1.vi.mock("../src/middleware/authenticateToken", () => ({
    authenticateToken: vitest_1.vi.fn((req, res, next) => next()), // Mock token authentication as always valid
}));
(0, vitest_1.describe)("Metric Routes", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks(); // Reset mocks before each test
    });
    (0, vitest_1.describe)("GET /api/metrics", () => {
        (0, vitest_1.it)("should call the getMetrics controller", async () => {
            const mockResponse = [
                {
                    id: 1,
                    game_name: "Test Game",
                    downloads: 1000,
                    dau: 200,
                    mau: 500,
                    arpu: 2.5,
                    arppu: 10.0,
                    retention_day1: 40.0,
                    retention_day7: 25.0,
                    retention_day30: 10.0,
                    revenue: 5000,
                    date: "2024-01-01",
                },
            ];
            vitest_1.vi.mocked(metricController_1.getMetrics).mockImplementationOnce((req, res) => {
                res.status(200).json(mockResponse);
            });
            const res = await (0, supertest_1.default)(index_1.app)
                .get("/api/metrics")
                .set("Authorization", "Bearer validtoken");
            (0, vitest_1.expect)(authenticateToken_1.authenticateToken).toHaveBeenCalled();
            (0, vitest_1.expect)(metricController_1.getMetrics).toHaveBeenCalled();
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body).toEqual(mockResponse);
        });
        (0, vitest_1.it)("should return 401 if no token is provided", async () => {
            vitest_1.vi.mocked(authenticateToken_1.authenticateToken).mockImplementationOnce((req, res) => {
                res.sendStatus(401);
            });
            const res = await (0, supertest_1.default)(index_1.app).get("/api/metrics");
            (0, vitest_1.expect)(authenticateToken_1.authenticateToken).toHaveBeenCalled();
            (0, vitest_1.expect)(metricController_1.getMetrics).not.toHaveBeenCalled();
            (0, vitest_1.expect)(res.status).toBe(401);
        });
    });
    (0, vitest_1.describe)("POST /api/metrics", () => {
        (0, vitest_1.it)("should call the addMetric controller", async () => {
            const mockResponse = { message: "Metric added successfully" };
            vitest_1.vi.mocked(metricController_1.addMetric).mockImplementationOnce((req, res) => {
                res.status(201).json(mockResponse);
            });
            const res = await (0, supertest_1.default)(index_1.app)
                .post("/api/metrics")
                .set("Authorization", "Bearer validtoken")
                .send({
                game_name: "Test Game",
                downloads: 1000,
                dau: 200,
                mau: 500,
                arpu: 2.5,
                arppu: 10.0,
                retention_day1: 40.0,
                retention_day7: 25.0,
                retention_day30: 10.0,
                revenue: 5000,
                date: "2024-01-01",
            });
            (0, vitest_1.expect)(authenticateToken_1.authenticateToken).toHaveBeenCalled();
            (0, vitest_1.expect)(metricController_1.addMetric).toHaveBeenCalled();
            (0, vitest_1.expect)(res.status).toBe(201);
            (0, vitest_1.expect)(res.body).toEqual(mockResponse);
        });
        (0, vitest_1.it)("should return 401 if no token is provided", async () => {
            vitest_1.vi.mocked(authenticateToken_1.authenticateToken).mockImplementationOnce((req, res) => {
                res.sendStatus(401);
            });
            const res = await (0, supertest_1.default)(index_1.app).post("/api/metrics").send({
                game_name: "Test Game",
                downloads: 1000,
                dau: 200,
                mau: 500,
                arpu: 2.5,
                arppu: 10.0,
                retention_day1: 40.0,
                retention_day7: 25.0,
                retention_day30: 10.0,
                revenue: 5000,
                date: "2024-01-01",
            });
            (0, vitest_1.expect)(authenticateToken_1.authenticateToken).toHaveBeenCalled();
            (0, vitest_1.expect)(metricController_1.addMetric).not.toHaveBeenCalled();
            (0, vitest_1.expect)(res.status).toBe(401);
        });
    });
});
