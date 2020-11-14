import { Application, NextFunction, Request, Response } from 'express';
import createErr from 'http-errors'

export default function(app: Application) {
    process.on("unhandledRejection", (reason: any, _promise: any) => {
        //reason is usually the Error object
        console.log("Unhandled Rejection -->", reason.stack || reason)
        /* Recommended: send the information to sentry.io
        or whatever crash reporting service you use */
    })
    app.use(logErrors);
    app.use(errorHandler);
}

// const pe = new PrettyError();
// pe.skipNodeFiles();
// pe.skipPackage('express');

const logErrors = (err: any, _req: Request, _res: Response, next: NextFunction) => {
    // console.log(pe.render(err));
    console.dir(err, { depth: null });
    next(err)
}

const errorHandler = (err: any, _req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) return next(err);
    if (!err.statusCode) err =  new createErr.InternalServerError('Unknown error, sorry')
    // All errors are http errors with status code and message
    let { statusCode, message } = err
    res.status(statusCode).json(message)
}
