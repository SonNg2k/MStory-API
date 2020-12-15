import express, { Request, Response } from 'express'
import { asyncHandler } from '../../helpers'
import AuthService from '../../services/auth.service'

const router = express.Router()

router.route('/')
    .post(asyncHandler(async (req: Request, res: Response) => {
        const { email, password, fullname, username } = req.body
        res.status(201).json(await AuthService.SignUp(email, password, fullname, username))
    }))

export default router
