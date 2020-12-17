import express, { Request, Response } from 'express'
import { asyncHandler } from '../../helpers'
import { blockLoggedIn } from './ap.middleware'
import ApService from './ap.service'

const router = express.Router()

router.route('/signup')
    .post(blockLoggedIn, asyncHandler(async (req: Request, res: Response) => {
        const { email, password, fullname, username } = req.body
        res.status(201).json(await ApService.SignUp(email, password, fullname, username))
    }))

router.route('/login')
    .post(blockLoggedIn, asyncHandler(async (req: Request, res: Response) => {
        const { username, password } = req.body
        const { user: { fullname, user_id }, token } = await ApService.Login(username, password)
        res.cookie('xs', '', { httpOnly: true, sameSite: 'none', secure: true, maxAge: -1 })
        res.cookie('xs', token, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 3600000 })
        res.status(200).json({ user_id, fullname })
    }))

router.route('/logout')
    .post(asyncHandler(async (req: Request, res: Response) => {
        res.cookie('xs', '', { httpOnly: true, sameSite: 'none', secure: true, maxAge: -1 })
        res.status(204).json()
    }))

export default router
