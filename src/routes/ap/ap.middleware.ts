import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { JwtPayload } from "../../types/ap";
import ApService from "./ap.service";

export const authUser = async (req: Request, res: Response, next: NextFunction) => {
    const { xs: token } = req.cookies
    const { user_id } = <JwtPayload>await ApService.VerifyToken(token)
        .catch(() => next(new createHttpError.Unauthorized('User is not logged in')))
    req.user = { user_id }
    next()
}

/** Block the signed-in user from accessing the /login & /signup routes */
export const blockLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
    const { xs: token } = req.cookies
    let isLoggedIn = true
    // If the token is invalid -> user is not logged in --> throw error
    await ApService.VerifyToken(token).catch(() => { isLoggedIn = false }) // proceed to the /signup or /login routes upon error

    if (isLoggedIn) next(new createHttpError.NotFound('This route is unavailable for logged-in user'))
    else next()
}
