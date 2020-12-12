import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { REGEX_DIGITS_ONLY, SORT_ORDER } from "../../constants";

export const parseProjectQueryParams = (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = querySchema.validate(req.query, { allowUnknown: true })
    if (error) return next(error)
    value.page = +value.page
    req.query = value
    next()
}

export const validateUpsertProject = (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = projectSchema.validate(req.body)
    if (error) return next(error)
    req.body = value
    next()
}

export const validateSetProjectStatus = (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = setStatusSchema.validate(req.body)
    if (error) return next(error)
    req.body = value
    next()
}

const querySchema = Joi.object({
    keyword: Joi.string()
        .allow('') // allows keyword to be undefined
        .trim() // remove leading and traling space
        .min(3)
        .max(80),

    is_active: Joi.boolean().required(),

    view: Joi.string().valid("updated_at", "created_at").required(),

    order: Joi.string().valid(...SORT_ORDER).required(),

    page: Joi.string()
        .empty('')
        .default('1') // set default value for page if it is undefined
        .regex(REGEX_DIGITS_ONLY) // contain digits only
})

const name = Joi.string()
    .trim()
    .min(6)
    .max(80)
    .required()

const projectSchema = Joi.object({
    name,
    description: Joi.string()
        .allow('') // can be undefined
        .trim()
        .max(5000)
        .required(),

    is_public: Joi.boolean().required()
})

const setStatusSchema = Joi.object({ is_active: Joi.boolean().required() })
