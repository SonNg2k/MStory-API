import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const parseQueryParams = (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = querySchema.validate(req.query, { convert: false, allowUnknown: true })
    if (error) return next(error)
    value.page = +value.page
    value.is_active = (value.is_active === 'true')
    req.query = value
    next()
}

const querySchema = Joi.object({
    keyword: Joi.string()
        .allow('') // allows keyword to be undefined
        .trim() // no leading and traling space
        .max(80),

    is_active: Joi.string().valid("true", "false").required(),

    view: Joi.string().valid("updated_at", "created_at").required(),

    order: Joi.string().valid("asc", "desc").required(),

    page: Joi.string()
        .empty('')
        .default('1') // set default value for page if it is undefined
        .regex(/^[0-9]+$/) // contain digits only
})
