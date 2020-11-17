import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Joi from "joi";

export const parseQueryParams = (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = querySchema.validate(req.query, { convert: false, allowUnknown: true })
    if (error) return next(new createHttpError.BadRequest('Invalid query params'))
    value.page = +value.page // cast 'page' to integer
    req.query = value
    next()
}

// Define schema for req.query
const querySchema = Joi.object({
    keyword: Joi.string()
        .allow('') // allows keyword to be empty
        .regex(/^([a-zA-Z]+\s)*[a-zA-Z]+$/) // contain letters and spaces only. No consecutive spaces
        .max(50),

    page: Joi.string()
        .empty('')
        .default('1') // set default value for page if it is undefined
        .regex(/^[0-9]+$/) // contain digits only
})
