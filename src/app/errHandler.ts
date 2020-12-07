import { Application, NextFunction, Request, Response } from 'express';
import createHttpError, { HttpError } from 'http-errors'
import { ValidationError } from 'joi';
import PrettyError from 'pretty-error'
import { WriteError } from 'typeorm';

const pe = new PrettyError()
pe.skipNodeFiles();
pe.skipPackage('express');

export default function (app: Application) {
    process.on("unhandledRejection", (reason: Error) => {
        console.log("Unhandled Rejection ↓")
        console.log(pe.render(reason))
        /* Recommended: send the information to sentry.io
        or whatever crash reporting service you use */
    })
    app.use(logErrors);
    app.use(returnErrToClient);
}

const logErrors = (err: Error, _req: Request, _res: Response, next: NextFunction) => {
    console.log(pe.render(err));
    next(err)
}

/**
 * Possilble errors:
 * -> A beautiful error created by new createError.[code || name]([friendly_msg]))
 * -> An ugly raw server error (the only way to distinguish this error from the two above is to check if err.statusCode is null)
 */
const returnErrToClient = (err: Error | HttpError | WriteError | ValidationError | any, _req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) return next(err);
    // 1) Check if it is the SQL 'unique constraint violation' error thrown by DB
    if (err.code === "23505" && err.name === "QueryFailedError")
        err = new createHttpError.Conflict('The resource has already existed')

    // 2) Check if it is the error from Joi shema validator
    if ((<string>err.stack).includes("ValidationError"))
        err = new createHttpError.BadRequest('The payload or query string sent is invalid')

    // 3) Unknown error will be considered as:
    if (!err.statusCode) err = new createHttpError.InternalServerError('Unknown error, sorry')
    const { statusCode } = err
    res.status(statusCode).json(err)
}
