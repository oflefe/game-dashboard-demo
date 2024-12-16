import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request, Response } from "express";
import { register, login } from "../src/controllers/authController";
import { AppDataSource } from "../src/data-source";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createMock = vi.fn();
const saveMock = vi.fn();
const findOneMock = vi.fn();
const compareMock = vi.fn()

// Mock AppDataSource and bcrypt/jwt functions
vi.mock("../src/data-source", () => ({
  AppDataSource: {
    getRepository: vi.fn(() => ({
      create: createMock,
      save: saveMock,
      findOneOrFail: findOneMock,
    })),
  },
}));

vi.mock("bcrypt", () => ({
  _esModule: true,
  default: {
    hash: vi.fn().mockResolvedValueOnce("hashedpassword"),
    compare: vi.fn().mockResolvedValue(true),
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: { sign: vi.fn(() => "mocked_jwt_token") },
}));

describe("Auth Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Register", () => {
    it("should register a new user successfully", async () => {
      const req = {
        body: { username: "testuser", password: "testpassword" },
      } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      await register(req, res);
      expect(createMock).toHaveBeenCalled();
      expect(createMock).toHaveBeenCalledWith({
        username: "testuser",
        password: "hashedpassword",
      });
      expect(saveMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User registered successfully",
      });
    });

    it("should return 400 if username already exists", async () => {
      saveMock.mockRejectedValue(new Error("Username already exists"));

      const req = {
        body: { username: "existinguser", password: "testpassword" },
      } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Username already exists",
      });
    });
  });

  describe("Login", () => {
    it("should log in a user successfully", async () => {
      findOneMock.mockResolvedValue({
        username: "testuser",
        password: "hashed_testpassword",
      });

      const req = {
        body: { username: "testuser", password: "testpassword" },
      } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      await login(req, res);

      expect(findOneMock).toHaveBeenCalledWith({
        where: { username: "testuser" },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "testpassword",
        "hashed_testpassword"
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: undefined, username: "testuser" },
        process.env.SECRET_KEY || "default_secret",
        { expiresIn: "1h" }
      );
      expect(res.json).toHaveBeenCalledWith({ token: "mocked_jwt_token" });
    });

    it("should return 400 if the username is not found", async () => {
      findOneMock.mockResolvedValue(null);

      const req = {
        body: { username: "unknownuser", password: "testpassword" },
      } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
    });

    it("should return 400 if the password is incorrect", async () => {
      findOneMock.mockResolvedValue({
        username: "testuser",
        password: "hashed_testpassword",
      });

      vi.mocked(bcrypt.compare).mockResolvedValue(false);

      const req = {
        body: { username: "testuser", password: "wrongpassword" },
      } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
    });
  });
});
