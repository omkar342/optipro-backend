import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "default_secret"; // Fallback for development

// Middleware to generate access token
const generateAccessToken = (storeId: ObjectId): string => {
  return jwt.sign({ storeId }, ACCESS_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

// Extend the Request interface to include userId
declare module "express-serve-static-core" {
  interface Request {
    storeId?: string;
  }
}

// Middleware to verify access token
const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Extract token from the "Authorization" header
  const authHeader = req.headers["authorization"] as string;
  if (!authHeader) {
    res.status(403).send({ message: "No token provided!" });
  }

  // Split "Bearer <token>" and get the token
  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(403).send({ message: "No token provided!" });
  }

  // Verify the token
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded: any) => {
    if (err) {
      return res.status(403).send({ message: "Unauthorized!" });
    }

    // Store the decoded information (e.g., storeId) in the request object
    req.storeId = decoded.storeId;
    next();
  });
};

export { generateAccessToken, verifyAccessToken };
