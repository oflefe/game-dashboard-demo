import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface UserPayload {
  id: string;
  username: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(
    token,
    process.env.SECRET_KEY || "default_secret",
    (err, decoded) => {
      if (err) {
        res.sendStatus(403);
        return;
      }

      if (
        typeof decoded === "object" &&
        "id" in decoded &&
        "username" in decoded
      ) {
        req.user = decoded as UserPayload;
        next();
      } else {
        res.sendStatus(403);
      }
    }
  );
};
