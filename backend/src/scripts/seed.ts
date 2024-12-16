import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Metric } from "../entity/Metric";
import bcrypt from "bcrypt";

const seed = async (): Promise<void> => {
  try {
    console.log("Initializing database connection...");
    await AppDataSource.initialize();
    console.log("Database connection initialized.");

    const userRepository = AppDataSource.getRepository(User);
    const metricRepository = AppDataSource.getRepository(Metric);

    // Clear existing data
    console.log("Clearing existing metrics...");
    await metricRepository.clear();

    console.log("Seeding users...");
    // Seed users
    const users = [
      {
        username: "admin",
        password: await bcrypt.hash("password123", 10),
      },
      {
        username: "testuser",
        password: await bcrypt.hash("testpassword", 10),
      },
    ];

    for (const userData of users) {
      const existingUser = await userRepository.findOne({
        where: { username: userData.username },
      });
      if (!existingUser) {
        const user = userRepository.create(userData);
        await userRepository.save(user);
        console.log(`User '${userData.username}' seeded.`);
      } else {
        console.log(`User '${userData.username}' already exists. Skipping.`);
      }
    }

    console.log("Seeding updated metrics...");
    // Overwrite historical data with unique patterns for each game
    const metrics = [
      // Historical data for Adventure Quest
      {
        game_name: "Adventure Quest",
        downloads: 500,
        dau: 100,
        mau: 300,
        arpu: 2.5,
        arppu: 10.0,
        retention_day1: 50.0,
        retention_day7: 30.0,
        retention_day30: 15.0,
        revenue: 250.0,
        date: "2024-01-01",
      },
      {
        game_name: "Adventure Quest",
        downloads: 800,
        dau: 180,
        mau: 450,
        arpu: 3.0,
        arppu: 12.0,
        retention_day1: 55.0,
        retention_day7: 32.0,
        retention_day30: 17.0,
        revenue: 450.0,
        date: "2024-02-01",
      },
      {
        game_name: "Adventure Quest",
        downloads: 1200,
        dau: 250,
        mau: 600,
        arpu: 3.2,
        arppu: 14.0,
        retention_day1: 60.0,
        retention_day7: 35.0,
        retention_day30: 20.0,
        revenue: 650.0,
        date: "2024-03-01",
      },
      // Historical data for Puzzle Mania
      {
        game_name: "Puzzle Mania",
        downloads: 700,
        dau: 120,
        mau: 400,
        arpu: 1.8,
        arppu: 8.0,
        retention_day1: 45.0,
        retention_day7: 25.0,
        retention_day30: 10.0,
        revenue: 300.0,
        date: "2024-01-01",
      },
      {
        game_name: "Puzzle Mania",
        downloads: 1000,
        dau: 150,
        mau: 500,
        arpu: 2.0,
        arppu: 9.0,
        retention_day1: 48.0,
        retention_day7: 27.0,
        retention_day30: 12.0,
        revenue: 450.0,
        date: "2024-02-01",
      },
      {
        game_name: "Puzzle Mania",
        downloads: 1400,
        dau: 200,
        mau: 600,
        arpu: 2.3,
        arppu: 10.0,
        retention_day1: 50.0,
        retention_day7: 30.0,
        retention_day30: 15.0,
        revenue: 600.0,
        date: "2024-03-01",
      },
    ];

    for (const metricData of metrics) {
      const metric = metricRepository.create(metricData);
      await metricRepository.save(metric);
    }
    console.log("Metrics seeded successfully.");

    console.log("Seeding completed.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await AppDataSource.destroy();
    console.log("Database connection closed.");
  }
};

seed();
