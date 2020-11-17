import { NextFunction, Request, RequestHandler, Response } from "express";

export const asyncHandler = (asyncFn: RequestHandler) =>
    (req: Request, res: Response, next: NextFunction) => Promise.resolve(asyncFn(req, res, next)).catch(next)
