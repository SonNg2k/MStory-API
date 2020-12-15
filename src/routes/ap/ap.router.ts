import express, { Request, Response } from 'express'
import { asyncHandler } from '../../helpers'
import ApService from './ap.service'

const router = express.Router()

router.route('/signup')
    .post(asyncHandler(async (req: Request, res: Response) => {
        const { email, password, fullname, username } = req.body
        res.status(201).json(await ApService.SignUp(email, password, fullname, username))
    }))

router.route('/login')
    .post(asyncHandler(async (req: Request, res: Response) => {
        const { username, password } = req.body
        const { token } = await ApService.Login(username, password)
        res.status(204).cookie('xs', token, { httpOnly: true, sameSite: 'none', maxAge: 3600000 }).json()
    }))

export default router
