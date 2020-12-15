import { Request, Response } from "express"
import ApService from "./ap.service"

export const signUp = async (req: Request, res: Response) => {
    const { email, password, fullname, username } = req.body
    res.status(201).json(await ApService.SignUp(email, password, fullname, username))
}
