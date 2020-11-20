import express, { Response, Request, NextFunction, Application } from 'express'
import cors from 'cors'
import createErr from 'http-errors'
import { createConnection } from 'typeorm';

import routes from '../routes'

export { default as errHandler } from './errHandler';

export const connectDB = async () => {
    return await createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [
            __dirname + "/../entity/*.js"
        ],
        migrations: [
            __dirname + "/../migration/*.js"
        ],
        synchronize: process.env.NODE_ENV === 'development',
        logging: process.env.DB_LOGGING === 'true',
        ssl: {
            rejectUnauthorized: false
        },
        cli: {
            entitiesDir: __dirname + "/../entity",
            migrationsDir: __dirname + "/../migration"
        }
    })
}

export const setup = (app: Application) => {
    app.use(cors())
    app.use(express.json());
    app.use((req: Request, res: Response, next: NextFunction) => { // make "/path" and "/path/" to be the same
        const test = /\?[^]*\//.test(req.url);
        if (req.url.substr(-1) === "/" && req.url.length > 1 && !test)
            res.redirect(301, req.url.slice(0, -1));
        else next();
    });
    app.disable('x-powered-by'); // NOT reveal the technology of server (Express.js) to hackers
}

export const initRoutes = (app: Application) => {
    app.use("/", routes);
    app.all("*", (req: Request, _res: Response, next: NextFunction) => {
        next(new createErr.NotFound(`Page not found. ${req.ip} tried to reach ${req.originalUrl}`))
    })
}

export const start = (app: Application) => {
    const port = process.env.PORT || 8080;
    app.listen(port, () => console.log(`API server is running on port: ${port}`));
}
