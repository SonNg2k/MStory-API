import { Application, NextFunction, Request, Response } from 'express';
import createErr from 'http-errors'

export default function (app: Application) {
    process.on("unhandledRejection", (reason: Error | any) => {
        console.log("Unhandled Rejection -->", reason.stack || reason)
        /* Recommended: send the information to sentry.io
        or whatever crash reporting service you use */
    })
    app.use(logErrors);
    app.use(returnErrToClient);
}

// const pe = new PrettyError();
// pe.skipNodeFiles();
// pe.skipPackage('express');

const logErrors = (err: Error | any, _req: Request, _res: Response, next: NextFunction) => {
    // console.log(pe.render(err));
    console.dir(err, { depth: null });
    next(err)
}

// Suppose to take in a raw server error and return a beautiful error message to the client
const returnErrToClient = (err: Error | any, _req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) return next(err);
    const { detail } = err
    if (err.code === "23505" && err.name === "QueryFailedError") err = createErr(409, {
        code: "UNIQUE_VIOLATION",
        message: "Resource has already existed",
        detail: detail
    })
    if (!err.statusCode) err = new createErr.InternalServerError('Unknown error, sorry')
    // All errors are http errors with status code and message
    const { statusCode } = err
    res.status(statusCode).json(err)
}
