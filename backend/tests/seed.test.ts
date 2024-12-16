import { describe, it, vi, expect, beforeEach } from "vitest";
import { AppDataSource } from "../src/data-source";
import { seed } from "../src/scripts/seed";

const mockCreate = vi.fn();
const mockSave = vi.fn();

vi.mock("../src/data-source", () => ({
  AppDataSource: {
    initialize: vi.fn(),
    destroy: vi.fn(),
    getRepository: () => ({
      create: mockCreate,
      save: mockSave,
    }),
  },
}));

vi.mock("bcrypt", () => ({
  default: { hash: vi.fn((password) => `hashed_${password}`) },
}));

describe("Seed Script", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize the database connection", async () => {
    await seed();
    expect(AppDataSource.initialize).toHaveBeenCalled();
    expect(AppDataSource.destroy).toHaveBeenCalled();
  });

  it("should seed users correctly", async () => {
    await seed();

    const expectedUsers = [
      { username: "admin", password: "hashed_password123" },
      { username: "testuser", password: "hashed_testpassword" },
    ];

    expect(mockCreate).toHaveBeenCalled();
    for (const user of expectedUsers) {
      expect(mockCreate).toHaveBeenCalledWith(user);
    }
    expect(mockSave).toHaveBeenCalled();
  });

  it("should handle errors during seeding gracefully", async () => {
    vi.mocked(AppDataSource.initialize).mockRejectedValue(
      new Error("Database error")
    );

    await expect(seed()).resolves.not.toThrow();

    expect(AppDataSource.initialize).toHaveBeenCalled();
    expect(AppDataSource.destroy).toHaveBeenCalled(); // Ensure destroy is still called
  });
});
