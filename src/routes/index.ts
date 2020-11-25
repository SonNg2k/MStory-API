import express from 'express';
import userRouter from './users/user.router'
import projectRouter from './projects/project.router'
import storyRouter from './stories/story.router'

const router = express.Router();

router.use('/users', userRouter)
router.use('/projects', projectRouter)
router.use('/stories', storyRouter)

export default router
