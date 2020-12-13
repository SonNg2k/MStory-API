import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Joi from "joi";
import { REGEX_DIGITS_ONLY, STORY_STATUS, STORY_TYPES } from "../../constants";
import ProjectRepo from "../projects/project.repo";

export const parseStoryQueryParams = async (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = querySchema.validate(req.query)
    if (error) return next(error)
    value.page = +value.page
    req.query = value
    next()
}

export const parseUpsertStory = async (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = storySchema.validate(req.body)
    if (error) return next(error)
    req.body = value

    // Check if all story owners are members of the projectID
    const { projectID } = req.params
    const { owner_ids = [] } = req.body
    for (const ownerID of owner_ids as string[]) {
        const found = await ProjectRepo.findLinkBetweenProjectAndUser(projectID, ownerID)
        if (!found) return next(new createHttpError.UnprocessableEntity("One of the story owners is NOT member of the project"))
    }
    req.body.owner_ids = owner_ids
    next()
}

export const validateSetStoryStatus = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = setStatusSchema.validate(req.body)
    if (error) return next(error)
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

    description: Joi.string().allow('').trim().max(5000).required(),

    owner_ids: Joi.array().items(Joi.string().length(26)).unique()
})

const setStatusSchema = Joi.object({ status: Joi.string().valid(...STORY_STATUS).required() })
