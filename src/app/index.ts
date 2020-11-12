import express, {Response, Request, NextFunction, Application} from 'express'
import createErr from 'http-errors'

import routers from '../routers'

export { default as handleErr } from './handleErr';

export const dbConnect = () => {

}

export const setup = (app: Application) => {
    app.use(express.json());
    app.use((req:Request, res: Response, next: NextFunction) => { // make "/path" and "/path/" to be the same
        const test = /\?[^]*\//.test(req.url);
        if (req.url.substr(-1) === "/" && req.url.length > 1 && !test)
            res.redirect(301, req.url.slice(0, -1));
        else next();
    });
    app.disable('x-powered-by'); // NOT reveal the technology of server (Express.js) to hackers
}

export const initRoutes = (app: Application) => {
    app.use("/", routers);
    app.all("*", (req: Request, _res: Response, next: NextFunction) => {
        next(new createErr.NotFound(`Page not found. ${req.ip} tried to reach ${req.originalUrl}`))
    })
}

export const start = (app: Application) => {
    const port = process.env.PORT || 8080;
    app.listen(port, () => console.log(`API server is running on port: ${port}`));
}
