import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  authenticateToken,
  UserPayload,
} from "../src/middleware/authenticateToken";

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn(),
  },
}));

describe("Middleware - authenticateToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const next: NextFunction = vi.fn();

  it("should return 401 if no token is provided", () => {
    const req = { headers: {} } as Request;
    const res = {
      sendStatus: vi.fn(),
    } as unknown as Response;

    authenticateToken(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 403 if token verification fails", () => {
    vi.mocked(jwt.verify).mockImplementationOnce(
      (_token, _secret, callback) => {
        callback(new Error("Invalid token"), null);
      }
    );

    const req = {
      headers: { authorization: "Bearer invalidtoken" },
    } as Request;
    const res = {
      sendStatus: vi.fn(),
    } as unknown as Response;

    authenticateToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(
      "invalidtoken",
      process.env.SECRET_KEY || "default_secret",
      expect.any(Function)
    );
    expect(res.sendStatus).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next and attach user to req if token is valid", () => {
    const userPayload: UserPayload = { id: "1", username: "testuser" };
    vi.mocked(jwt.verify).mockImplementationOnce(
      (_token, _secret, callback) => {
        callback(null, userPayload);
      }
    );

    const req = { headers: { authorization: "Bearer validtoken" } } as Request;
    const res = {} as Response;

    authenticateToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(
      "validtoken",
      process.env.SECRET_KEY || "default_secret",
      expect.any(Function)
    );
    expect(req.user).toEqual(userPayload);
    expect(next).toHaveBeenCalled();
  });

  it("should return 403 if decoded token does not have the required properties", () => {
    vi.mocked(jwt.verify).mockImplementationOnce(
      (_token, _secret, callback) => {
        callback(null, { unexpected: "payload" }); // Mock invalid payload
      }
    );

    const req = {
      headers: { authorization: "Bearer invalidpayload" },
    } as Request;
    const res = {
      sendStatus: vi.fn(),
    } as unknown as Response;

    authenticateToken(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled(); // Ensure next() was NOT called
  });
});
