import express from 'express'
import { asyncHandler, checkID } from '../../helpers'
import { upsertProjectStory } from './story.controller'
import { validateUpsertStory } from './story.middleware'

const router = express.Router()

router.route('/:storyID')
    .put(checkID('storyID'), validateUpsertStory, asyncHandler(upsertProjectStory))

export default router
