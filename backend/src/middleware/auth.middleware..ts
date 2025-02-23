require("dotenv").config();
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface CustomRequest extends Request {
  creator_id?: string;
}

export const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "No token, authorization denied" });
        return
    }
    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
        res.status(500).json({ message: "JWT secret is not defined" });
        return
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    if (!decoded || !decoded.id) {
        res.status(401).json({ message: "Token is not valid" });
        return
    }

    req.creator_id = decoded.id.toString();
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};