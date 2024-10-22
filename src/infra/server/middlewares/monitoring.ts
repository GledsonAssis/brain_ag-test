import { randomUUID } from "crypto";
import { Request, Response, NextFunction } from "express";

export const monitoringMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.headers["x-correlation-id"] = req.headers["x-correlation-id"] ?? randomUUID();
  req.headers["x-request-id"] = randomUUID();
  next();
};

export default monitoringMiddleware;
