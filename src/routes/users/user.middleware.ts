import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import Joi from "joi";
import _ from "lodash";
import { REGEX_DIGITS_ONLY, REGEX_EMAIL, REGEX_GITHUB_USERNAME, REGEX_LETTERS_SPACES_ONLY } from "../../constants";

export const parseUserQueryParams = (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = querySchema.validate(req.query, { allowUnknown: true })
    if (error) {
        const returnErr = {
            errcode: "INVALID_QUERY_STRING",
            message: "Invalid query params",
            detail: _.chain(error.details)
                .keyBy("context.key")
                .mapValues('context.value')
                .value()
        }
        return next(createError(400, returnErr))
    }
    value.page = +value.page // cast 'page' to integer
    req.query = value
    next()
}

export const validateAddUser = (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = addUserSchema.validate(req.body, { allowUnknown: true })
    if (error) return next(new createError.UnprocessableEntity("Invalid payload to add user"))
    req.body = value
    next()
}

export const validateEditUser = (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = editUserChema.validate(req.body, { allowUnknown: true })
    if (error) return next(error)
    req.body = value
    next()
}

export const checkUsername = (req: Request, res: Response, next: NextFunction) => {
    const { error } = username.validate(req.params.username)
    if (error) return next(error)
    next()
}

// Joi validation schemas
const querySchema = Joi.object({
    keyword: Joi.string()
        .allow('')
        .trim()
        .regex(REGEX_LETTERS_SPACES_ONLY)
        .min(3)
        .max(50),

    page: Joi.string()
        .empty('')
        .default('1') // set default value for page if it is undefined
        .regex(REGEX_DIGITS_ONLY) // contain digits only
})

const username = Joi.string()
    .min(6)
    .regex(REGEX_GITHUB_USERNAME)
    .required()

const fullname = Joi.string()
    .trim()
    .min(6)
    .max(50)
    .regex(REGEX_LETTERS_SPACES_ONLY)
    .required()

const email = Joi.string()
    .min(6)
    .max(64)
    .regex(REGEX_EMAIL)
    .required()

const addUserSchema = Joi.object({
    username,
    fullname,
    email,

    password: Joi.string()
        .trim()
        .min(6)
        .max(255)
        .required()
})

const editUserChema = Joi.object({
    fullname,
    email,

    password: Joi.string()
        .trim()
        .min(6)
        .max(255)
})
