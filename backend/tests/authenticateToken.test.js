"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken_1 = require("../src/middleware/authenticateToken");
vitest_1.vi.mock("jsonwebtoken", () => ({
    default: {
        verify: vitest_1.vi.fn(),
    },
}));
(0, vitest_1.describe)("Middleware - authenticateToken", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    const next = vitest_1.vi.fn();
    (0, vitest_1.it)("should return 401 if no token is provided", () => {
        const req = { headers: {} };
        const res = {
            sendStatus: vitest_1.vi.fn(),
        };
        (0, authenticateToken_1.authenticateToken)(req, res, next);
        (0, vitest_1.expect)(res.sendStatus).toHaveBeenCalledWith(401);
        (0, vitest_1.expect)(next).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)("should return 403 if token verification fails", () => {
        vitest_1.vi.mocked(jsonwebtoken_1.default.verify).mockImplementationOnce((_token, _secret, callback) => {
            callback(new Error("Invalid token"), null);
        });
        const req = {
            headers: { authorization: "Bearer invalidtoken" },
        };
        const res = {
            sendStatus: vitest_1.vi.fn(),
        };
        (0, authenticateToken_1.authenticateToken)(req, res, next);
        (0, vitest_1.expect)(jsonwebtoken_1.default.verify).toHaveBeenCalledWith("invalidtoken", process.env.SECRET_KEY || "default_secret", vitest_1.expect.any(Function));
        (0, vitest_1.expect)(res.sendStatus).toHaveBeenCalledWith(403);
        (0, vitest_1.expect)(next).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)("should call next and attach user to req if token is valid", () => {
        const userPayload = { id: "1", username: "testuser" };
        vitest_1.vi.mocked(jsonwebtoken_1.default.verify).mockImplementationOnce((_token, _secret, callback) => {
            callback(null, userPayload);
        });
        const req = { headers: { authorization: "Bearer validtoken" } };
        const res = {};
        (0, authenticateToken_1.authenticateToken)(req, res, next);
        (0, vitest_1.expect)(jsonwebtoken_1.default.verify).toHaveBeenCalledWith("validtoken", process.env.SECRET_KEY || "default_secret", vitest_1.expect.any(Function));
        (0, vitest_1.expect)(req.user).toEqual(userPayload);
        (0, vitest_1.expect)(next).toHaveBeenCalled();
    });
    (0, vitest_1.it)("should return 403 if decoded token does not have the required properties", () => {
        vitest_1.vi.mocked(jsonwebtoken_1.default.verify).mockImplementationOnce((_token, _secret, callback) => {
            callback(null, { unexpected: "payload" }); // Mock invalid payload
        });
        const req = {
            headers: { authorization: "Bearer invalidpayload" },
        };
        const res = {
            sendStatus: vitest_1.vi.fn(),
        };
        (0, authenticateToken_1.authenticateToken)(req, res, next);
        (0, vitest_1.expect)(res.sendStatus).toHaveBeenCalledWith(403);
        (0, vitest_1.expect)(next).not.toHaveBeenCalled(); // Ensure next() was NOT called
    });
});
