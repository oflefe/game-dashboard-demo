import request from "supertest";
import { describe, it, expect, vi } from "vitest";
import { app } from "../src/index"; // Ensure `app` is exported from your `index.ts`
import { register, login } from "../src/controllers/authController";

vi.mock("../src/controllers/authController", () => ({
  register: vi.fn(),
  login: vi.fn(),
}));

describe("Auth Routes", () => {
  describe("POST /register", () => {
    it("should call the register controller", async () => {
      const mockResponse = { message: "User registered successfully" };
      vi.mocked(register).mockImplementationOnce(async (_req, res) => {
        res.status(201).json(mockResponse);
      });

      const res = await request(app).post("/api/auth/register").send({
        username: "testuser",
        password: "testpassword",
      });

      expect(register).toHaveBeenCalled();
      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockResponse);
    });
  });

  describe("POST /login", () => {
    it("should call the login controller", async () => {
      const mockResponse = { token: "mocked_jwt_token" };
      vi.mocked(login).mockImplementationOnce(async (_req, res) => {
        res.status(200).json(mockResponse);
      });

      const res = await request(app).post("/api/auth/login").send({
        username: "testuser",
        password: "testpassword",
      });

      expect(login).toHaveBeenCalled();
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockResponse);
    });
  });
});
