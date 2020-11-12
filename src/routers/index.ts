import express, { Request, Response } from 'express';
import userRouter from './user.router'

const router = express.Router();

router.use('/users', userRouter)
router.use('/test', (req: Request, res: Response) => {
    res.status(200).json({message: 'Hello beautiful world'})
})

export default router
