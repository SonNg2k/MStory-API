import express from 'express';
import userRouter from './users/user.router'
import projectRouter from './projects/project.router'
import storyRouter from './stories/story.router'
import apRouter from './ap/ap.router'

const router = express.Router();

router.use('/ap', apRouter)
router.use('/users', userRouter)
router.use('/projects', projectRouter)
router.use('/stories', storyRouter)

export default router
