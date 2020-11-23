import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import Joi from "joi";
import _ from "lodash";

export const parseQueryParams = (req: Request, res: Response, next: NextFunction) => {
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
    const { error } = addUserSchema.validate(req.body, { allowUnknown: true })
    if (error) return next(new createError.UnprocessableEntity("Invalid payload to add user"))
    next()
}

const usernameSchema = Joi.string()
    .min(6)
    .regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i)
    .required()

export const validateEditUser = (req: Request, res: Response, next: NextFunction) => {
    const { error: usernameErr } = usernameSchema.validate(req.params.username)
    if (usernameErr) return next(usernameErr)
    const { error: editPayloadErr } = editUserChema.validate(req.body, { allowUnknown: true })
    if (editPayloadErr) return next(editPayloadErr)
    next()
}

export const validateDeleteUser = (req: Request, res: Response, next: NextFunction) => {
    const { error } = usernameSchema.validate(req.params.username)
    if (error) return next(error)
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

const addUserSchema = Joi.object({
    username: Joi.string()
        .min(6)
        .regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i) // based on GitHub username's constraints
        .required(),

    fullname: Joi.string()
        .min(6)
        .max(50)
        .regex(/^([a-zA-Z]+\s)*[a-zA-Z]+$/)
        .required(),

    email: Joi.string()
        .min(6)
        .max(64)
        .regex(/^(([^<>()\[\]\\.,;:\s-@#$!%^&*+=_/`?{}|'"]+(\.[^<>()\[\]\\.,;:\s-@_!#$%^&*()=+/`?{}|'"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i)
        .required(),

    password: Joi.string()
        .min(6)
        .max(255)
        .required()
})

const editUserChema = Joi.object({
    fullname: Joi.string()
        .min(6)
        .max(50)
        .regex(/^([a-zA-Z]+\s)*[a-zA-Z]+$/)
        .required(),

    email: Joi.string()
        .min(6)
        .max(64)
        .regex(/^(([^<>()\[\]\\.,;:\s-@#$!%^&*+=_/`?{}|'"]+(\.[^<>()\[\]\\.,;:\s-@_!#$%^&*()=+/`?{}|'"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i)
        .required(),

    password: Joi.string()
        .min(6)
        .max(255)
})
