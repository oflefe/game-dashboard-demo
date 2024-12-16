"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const metricController_1 = require("../src/controllers/metricController");
const findMock = vitest_1.vi.fn();
const saveMock = vitest_1.vi.fn();
const createMock = vitest_1.vi.fn();
// Mock AppDataSource
vitest_1.vi.mock("../src/data-source", () => ({
    AppDataSource: {
        getRepository: vitest_1.vi.fn(() => ({
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
(0, vitest_1.describe)("Metric Controller", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)("getMetrics", () => {
        (0, vitest_1.it)("should return a list of metrics", async () => {
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
            const req = {};
            const res = {
                status: vitest_1.vi.fn().mockReturnThis(),
                json: vitest_1.vi.fn(),
            };
            await (0, metricController_1.getMetrics)(req, res);
            (0, vitest_1.expect)(findMock).toHaveBeenCalled();
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(200);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith([
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
        (0, vitest_1.it)("should return 500 if there is an error", async () => {
            findMock.mockRejectedValue(new Error("Database error"));
            const req = {};
            const res = {
                status: vitest_1.vi.fn().mockReturnThis(),
                json: vitest_1.vi.fn(),
            };
            await (0, metricController_1.getMetrics)(req, res);
            (0, vitest_1.expect)(findMock).toHaveBeenCalled();
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(500);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
                error: "Error fetching metrics",
            });
        });
    });
    (0, vitest_1.describe)("addMetric", () => {
        (0, vitest_1.it)("should add a new metric successfully", async () => {
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
            };
            const res = {
                status: vitest_1.vi.fn().mockReturnThis(),
                json: vitest_1.vi.fn(),
            };
            await (0, metricController_1.addMetric)(req, res);
            (0, vitest_1.expect)(saveMock).toHaveBeenCalledWith({
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
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(201);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
                message: "Metric added successfully",
            });
        });
        (0, vitest_1.it)("should return 500 if there is an error", async () => {
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
            };
            const res = {
                status: vitest_1.vi.fn().mockReturnThis(),
                json: vitest_1.vi.fn(),
            };
            await (0, metricController_1.addMetric)(req, res);
            (0, vitest_1.expect)(saveMock).toHaveBeenCalled();
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(500);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
                error: "Error saving metric",
            });
        });
    });
});
