"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
const index_1 = require("../src/index"); // Ensure `app` is exported from your `index.ts`
const authController_1 = require("../src/controllers/authController");
vitest_1.vi.mock("../src/controllers/authController", () => ({
    register: vitest_1.vi.fn(),
    login: vitest_1.vi.fn(),
}));
(0, vitest_1.describe)("Auth Routes", () => {
    (0, vitest_1.describe)("POST /register", () => {
        (0, vitest_1.it)("should call the register controller", async () => {
            const mockResponse = { message: "User registered successfully" };
            vitest_1.vi.mocked(authController_1.register).mockImplementationOnce(async (_req, res) => {
                res.status(201).json(mockResponse);
            });
            const res = await (0, supertest_1.default)(index_1.app).post("/api/auth/register").send({
                username: "testuser",
                password: "testpassword",
            });
            (0, vitest_1.expect)(authController_1.register).toHaveBeenCalled();
            (0, vitest_1.expect)(res.status).toBe(201);
            (0, vitest_1.expect)(res.body).toEqual(mockResponse);
        });
    });
    (0, vitest_1.describe)("POST /login", () => {
        (0, vitest_1.it)("should call the login controller", async () => {
            const mockResponse = { token: "mocked_jwt_token" };
            vitest_1.vi.mocked(authController_1.login).mockImplementationOnce(async (_req, res) => {
                res.status(200).json(mockResponse);
            });
            const res = await (0, supertest_1.default)(index_1.app).post("/api/auth/login").send({
                username: "testuser",
                password: "testpassword",
            });
            (0, vitest_1.expect)(authController_1.login).toHaveBeenCalled();
            (0, vitest_1.expect)(res.status).toBe(200);
            (0, vitest_1.expect)(res.body).toEqual(mockResponse);
        });
    });
});
