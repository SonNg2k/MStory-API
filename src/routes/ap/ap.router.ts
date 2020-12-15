import express from 'express'
import { asyncHandler } from '../../helpers'
import { signUp } from './ap.controller'

const router = express.Router()

router.route('/signup')
    .post(asyncHandler(signUp))

export default router
