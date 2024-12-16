"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const authController_1 = require("../src/controllers/authController");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createMock = vitest_1.vi.fn();
const saveMock = vitest_1.vi.fn();
const findOneMock = vitest_1.vi.fn();
const compareMock = vitest_1.vi.fn();
// Mock AppDataSource and bcrypt/jwt functions
vitest_1.vi.mock("../src/data-source", () => ({
    AppDataSource: {
        getRepository: vitest_1.vi.fn(() => ({
            create: createMock,
            save: saveMock,
            findOneOrFail: findOneMock,
        })),
    },
}));
vitest_1.vi.mock("bcrypt", () => ({
    _esModule: true,
    default: {
        hash: vitest_1.vi.fn().mockResolvedValueOnce("hashedpassword"),
        compare: vitest_1.vi.fn().mockResolvedValue(true),
    },
}));
vitest_1.vi.mock("jsonwebtoken", () => ({
    default: { sign: vitest_1.vi.fn(() => "mocked_jwt_token") },
}));
(0, vitest_1.describe)("Auth Controller", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)("Register", () => {
        (0, vitest_1.it)("should register a new user successfully", async () => {
            const req = {
                body: { username: "testuser", password: "testpassword" },
            };
            const res = {
                status: vitest_1.vi.fn().mockReturnThis(),
                json: vitest_1.vi.fn(),
            };
            await (0, authController_1.register)(req, res);
            (0, vitest_1.expect)(createMock).toHaveBeenCalled();
            (0, vitest_1.expect)(createMock).toHaveBeenCalledWith({
                username: "testuser",
                password: "hashedpassword",
            });
            (0, vitest_1.expect)(saveMock).toHaveBeenCalled();
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(201);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
                message: "User registered successfully",
            });
        });
        (0, vitest_1.it)("should return 400 if username already exists", async () => {
            saveMock.mockRejectedValue(new Error("Username already exists"));
            const req = {
                body: { username: "existinguser", password: "testpassword" },
            };
            const res = {
                status: vitest_1.vi.fn().mockReturnThis(),
                json: vitest_1.vi.fn(),
            };
            await (0, authController_1.register)(req, res);
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(400);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
                error: "Username already exists",
            });
        });
    });
    (0, vitest_1.describe)("Login", () => {
        (0, vitest_1.it)("should log in a user successfully", async () => {
            findOneMock.mockResolvedValue({
                username: "testuser",
                password: "hashed_testpassword",
            });
            const req = {
                body: { username: "testuser", password: "testpassword" },
            };
            const res = {
                status: vitest_1.vi.fn().mockReturnThis(),
                json: vitest_1.vi.fn(),
            };
            await (0, authController_1.login)(req, res);
            (0, vitest_1.expect)(findOneMock).toHaveBeenCalledWith({
                where: { username: "testuser" },
            });
            (0, vitest_1.expect)(bcrypt_1.default.compare).toHaveBeenCalledWith("testpassword", "hashed_testpassword");
            (0, vitest_1.expect)(jsonwebtoken_1.default.sign).toHaveBeenCalledWith({ id: undefined, username: "testuser" }, process.env.SECRET_KEY || "default_secret", { expiresIn: "1h" });
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({ token: "mocked_jwt_token" });
        });
        (0, vitest_1.it)("should return 400 if the username is not found", async () => {
            findOneMock.mockResolvedValue(null);
            const req = {
                body: { username: "unknownuser", password: "testpassword" },
            };
            const res = {
                status: vitest_1.vi.fn().mockReturnThis(),
                json: vitest_1.vi.fn(),
            };
            await (0, authController_1.login)(req, res);
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(400);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
        });
        (0, vitest_1.it)("should return 400 if the password is incorrect", async () => {
            findOneMock.mockResolvedValue({
                username: "testuser",
                password: "hashed_testpassword",
            });
            vitest_1.vi.mocked(bcrypt_1.default.compare).mockResolvedValue(false);
            const req = {
                body: { username: "testuser", password: "wrongpassword" },
            };
            const res = {
                status: vitest_1.vi.fn().mockReturnThis(),
                json: vitest_1.vi.fn(),
            };
            await (0, authController_1.login)(req, res);
            (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(400);
            (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
        });
    });
});
