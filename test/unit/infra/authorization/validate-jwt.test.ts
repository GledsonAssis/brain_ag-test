import { validateJWT } from "@/infra/authorization/validate-jwt";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Mock do `jsonwebtoken`
jest.mock("jsonwebtoken");

describe("validateJWT middleware", () => {
  let req: Partial<Request & { user: any }>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return 401 if Authorization header is missing", () => {
    req.headers = {};

    validateJWT(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Authorization header missing",
    });
  });

  it("should return 401 if token is missing", () => {
    req.headers = {
      authorization: "Bearer ",
    };

    validateJWT(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token missing" });
  });

  it("should return 403 if token is invalid", () => {
    req.headers = {
      authorization: "Bearer invalidtoken",
    };
    const jwtVerifyMock = jwt.verify as jest.Mock;
    jwtVerifyMock.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    validateJWT(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid or expired token",
    });
  });

  it("should call next() if token is valid", () => {
    req.headers = {
      authorization: "Bearer validtoken",
    };
    const jwtVerifyMock = jwt.verify as jest.Mock;
    const decodedToken = { id: 123, name: "testuser" };
    jwtVerifyMock.mockReturnValue(decodedToken);

    validateJWT(req as Request, res as Response, next);

    expect(req.user).toEqual(decodedToken);
    expect(next).toHaveBeenCalled();
  });
});
