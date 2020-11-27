import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { REGEX_DIGITS_ONLY, STORY_STATUS, STORY_TYPES } from "../../constants";

export const parseStoryQueryParams = async (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = querySchema.validate(req.query)
    if (error) return next(error)
    value.page = +value.page
    req.query = value
    next()
}

export const validateUpsertStory = async (req: Request, res: Response, next: NextFunction) => {
    next()
}

const querySchema = Joi.object({
    keyword: Joi.string()
        .allow('') // allows keyword to be undefined
        .trim() // remove leading and traling space
        .max(80),

    status: Joi.string().allow('').valid(...STORY_STATUS),

    type: Joi.string().allow('').valid(...STORY_TYPES),

    page: Joi.string()
        .empty('')
        .default('1') // set default value for page if it is undefined
        .regex(REGEX_DIGITS_ONLY) // contain digits only
})
