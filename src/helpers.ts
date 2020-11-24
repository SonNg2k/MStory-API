import { NextFunction, Request, RequestHandler, Response } from "express";
import Joi from "joi";

export const asyncHandler = (asyncFn: RequestHandler) =>
    (req: Request, res: Response, next: NextFunction) => Promise.resolve(asyncFn(req, res, next)).catch(next)

export const checkID = (idName: string) =>
    (req: Request, res: Response, next: NextFunction) => {
        const { error } = Joi.string().length(26).required().validate(req.params[idName])
        if (error) return next(error)
        next()
    }

export const omit = (obj: Object, keys: string[]) =>
    transform(obj, (_value, key) => !keys.includes(key))

export const pick = (obj: Object, keys: string[]) =>
    transform(obj, (_value, key) => keys.includes(key))

const transform = (obj: Object, predicate: (value: any, key: string) => boolean) => {
    return Object.keys(obj).reduce((memo: Object, key: string) => {
        // @ts-ignore
        if (predicate(obj[key], key)) memo[key] = obj[key]
        return memo
    }, {})
}
