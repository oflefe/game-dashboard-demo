import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request, Response } from "express";
import { AppDataSource } from "../src/data-source";
import { getMetrics, addMetric } from "../src/controllers/metricController";
import { Metric } from "../src/entity/Metric";

const findMock = vi.fn();
const saveMock = vi.fn();
const createMock = vi.fn();

// Mock AppDataSource
vi.mock("../src/data-source", () => ({
  AppDataSource: {
    getRepository: vi.fn(() => ({
      find: findMock,
      save: saveMock,
      create: createMock,
    })),
  },
}));

const mockMetric = {
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
};

describe("Metric Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getMetrics", () => {
    it("should return a list of metrics", async () => {
      findMock.mockResolvedValue([
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
      ]);

      const req = {} as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      await getMetrics(req, res);

      expect(findMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
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
      ]);
    });

    it("should return 500 if there is an error", async () => {
      findMock.mockRejectedValue(new Error("Database error"));

      const req = {} as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      await getMetrics(req, res);

      expect(findMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Error fetching metrics",
      });
    });
  });

  describe("addMetric", () => {
    it("should add a new metric successfully", async () => {
      createMock.mockReturnValueOnce(mockMetric);
      saveMock.mockResolvedValue(mockMetric);

      const req = {
        body: {
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
      } as Request;

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      await addMetric(req, res);

      expect(saveMock).toHaveBeenCalledWith({
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
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Metric added successfully",
      });
    });

    it("should return 500 if there is an error", async () => {
      saveMock.mockRejectedValue(new Error("Database error"));

      const req = {
        body: {
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
      } as Request;

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      await addMetric(req, res);

      expect(saveMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Error saving metric",
      });
    });
  });
});
