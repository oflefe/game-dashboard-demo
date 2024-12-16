import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Metric } from "../entity/Metric";

export const getMetrics = async (
  req: Request,
  res: Response
): Promise<void> => {
  const metricRepository = AppDataSource.getRepository(Metric);
  try {
    const metrics = await metricRepository.find({
      order: { date: "DESC" },
      take: 100,
    });
    res.status(200).json(metrics);
  } catch (err) {
    res.status(500).json({ error: "Error fetching metrics" });
  }
};

export const addMetric = async (req: Request, res: Response): Promise<void> => {
  const {
    game_name,
    downloads,
    dau,
    mau,
    arpu,
    arppu,
    retention_day1,
    retention_day7,
    retention_day30,
    revenue,
    date,
  } = req.body;
  const metricRepository = AppDataSource.getRepository(Metric);

  try {
    const metric = metricRepository.create({
      game_name,
      downloads,
      dau,
      mau,
      arpu,
      arppu,
      retention_day1,
      retention_day7,
      retention_day30,
      revenue,
      date,
    });
    await metricRepository.save(metric);
    res.status(201).json({ message: "Metric added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error saving metric" });
  }
};
