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
    const { error, value } = storySchema.validate(req.body)
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

    status: Joi.string().allow('').valid(...STORY_STATUS),

    type: Joi.string().allow('').valid(...STORY_TYPES),

    page: Joi.string()
        .empty('')
        .default('1') // set default value for page if it is undefined
        .regex(REGEX_DIGITS_ONLY) // contain digits only
})

const storySchema = Joi.object({
    title: Joi.string().trim().min(6).max(80).required(),

    type: Joi.string().valid(...STORY_TYPES).required(),

    points: Joi.number().integer().min(0).max(32767).required(),

    description: Joi.string().allow('').trim().max(5000).required()
})
