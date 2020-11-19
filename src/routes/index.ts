import express from 'express';
import userRouter from './users/user.router'
import projectRouter from './projects/project.router'

const router = express.Router();

router.use('/users', userRouter)
router.use('/projects', projectRouter)

export default router
