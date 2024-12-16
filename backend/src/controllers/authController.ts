import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { 
  User } from "../entity/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  const userRepository = AppDataSource.getRepository(User);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({ username, password: hashedPassword });
    await userRepository.save(user);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: "Username already exists" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  const userRepository = AppDataSource.getRepository(User);

  try {
    const user = await userRepository.findOneOrFail({ where: { username } });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.SECRET_KEY || "default_secret",
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: "Invalid credentials" });
  }
};
