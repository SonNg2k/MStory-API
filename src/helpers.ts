import { NextFunction, Request, RequestHandler, Response } from "express";

export const asyncHandler = (asyncFn: RequestHandler) =>
    (req: Request, res: Response, next: NextFunction) => Promise.resolve(asyncFn(req, res, next)).catch(next)

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
