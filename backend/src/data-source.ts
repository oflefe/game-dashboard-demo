import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Metric } from "./entity/Metric";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: process.env.DB_DATABASE || "metrics.db",
  synchronize: true, // Auto-create tables based on entities (use only in development)
  logging: false,
  entities: [User, Metric],
  migrations: [],
  subscribers: [],
});
