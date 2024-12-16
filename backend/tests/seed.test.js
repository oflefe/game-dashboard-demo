"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const data_source_1 = require("../src/data-source");
const seed_1 = require("../src/scripts/seed");
const mockCreate = vitest_1.vi.fn();
const mockSave = vitest_1.vi.fn();
vitest_1.vi.mock("../src/data-source", () => ({
    AppDataSource: {
        initialize: vitest_1.vi.fn(),
        destroy: vitest_1.vi.fn(),
        getRepository: () => ({
            create: mockCreate,
            save: mockSave,
        }),
    },
}));
vitest_1.vi.mock("bcrypt", () => ({
    default: { hash: vitest_1.vi.fn((password) => `hashed_${password}`) },
}));
(0, vitest_1.describe)("Seed Script", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("should initialize the database connection", async () => {
        await (0, seed_1.seed)();
        (0, vitest_1.expect)(data_source_1.AppDataSource.initialize).toHaveBeenCalled();
        (0, vitest_1.expect)(data_source_1.AppDataSource.destroy).toHaveBeenCalled();
    });
    (0, vitest_1.it)("should seed users correctly", async () => {
        await (0, seed_1.seed)();
        const expectedUsers = [
            { username: "admin", password: "hashed_password123" },
            { username: "testuser", password: "hashed_testpassword" },
        ];
        (0, vitest_1.expect)(mockCreate).toHaveBeenCalled();
        for (const user of expectedUsers) {
            (0, vitest_1.expect)(mockCreate).toHaveBeenCalledWith(user);
        }
        (0, vitest_1.expect)(mockSave).toHaveBeenCalled();
    });
    (0, vitest_1.it)("should handle errors during seeding gracefully", async () => {
        vitest_1.vi.mocked(data_source_1.AppDataSource.initialize).mockRejectedValue(new Error("Database error"));
        await (0, vitest_1.expect)((0, seed_1.seed)()).resolves.not.toThrow();
        (0, vitest_1.expect)(data_source_1.AppDataSource.initialize).toHaveBeenCalled();
        (0, vitest_1.expect)(data_source_1.AppDataSource.destroy).toHaveBeenCalled(); // Ensure destroy is still called
    });
});
