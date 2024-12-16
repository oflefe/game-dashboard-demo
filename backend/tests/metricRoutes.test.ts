import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { app } from "../src/index"; // Ensure app is exported from index.ts
import { getMetrics, addMetric } from "../src/controllers/metricController";
import { authenticateToken } from "../src/middleware/authenticateToken";

vi.mock("../src/controllers/metricController", () => ({
  getMetrics: vi.fn(),
  addMetric: vi.fn(),
}));

vi.mock("../src/middleware/authenticateToken", () => ({
  authenticateToken: vi.fn((req, res, next) => next()), // Mock token authentication as always valid
}));

describe("Metric Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Reset mocks before each test
  });

  describe("GET /api/metrics", () => {
    it("should call the getMetrics controller", async () => {
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

      vi.mocked(getMetrics).mockImplementationOnce((req, res) => {
        res.status(200).json(mockResponse);
      });

      const res = await request(app)
        .get("/api/metrics")
        .set("Authorization", "Bearer validtoken");

      expect(authenticateToken).toHaveBeenCalled();
      expect(getMetrics).toHaveBeenCalled();
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockResponse);
    });

    it("should return 401 if no token is provided", async () => {
      vi.mocked(authenticateToken).mockImplementationOnce((req, res) => {
        res.sendStatus(401);
      });

      const res = await request(app).get("/api/metrics");

      expect(authenticateToken).toHaveBeenCalled();
      expect(getMetrics).not.toHaveBeenCalled();
      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/metrics", () => {
    it("should call the addMetric controller", async () => {
      const mockResponse = { message: "Metric added successfully" };

      vi.mocked(addMetric).mockImplementationOnce((req, res) => {
        res.status(201).json(mockResponse);
      });

      const res = await request(app)
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

      expect(authenticateToken).toHaveBeenCalled();
      expect(addMetric).toHaveBeenCalled();
      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockResponse);
    });

    it("should return 401 if no token is provided", async () => {
      vi.mocked(authenticateToken).mockImplementationOnce((req, res) => {
        res.sendStatus(401);
      });

      const res = await request(app).post("/api/metrics").send({
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

      expect(authenticateToken).toHaveBeenCalled();
      expect(addMetric).not.toHaveBeenCalled();
      expect(res.status).toBe(401);
    });
  });
});
