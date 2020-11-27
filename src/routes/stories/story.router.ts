import express from 'express'
import { asyncHandler, checkID } from '../../helpers'
import { setStoryStatus, upsertProjectStory } from './story.controller'
import { validateSetStoryStatus, validateUpsertStory } from './story.middleware'

const router = express.Router()

router.route('/:storyID')
    .put(checkID('storyID'), validateUpsertStory, asyncHandler(upsertProjectStory))

router.route('/:storyID/set_status')
    .put(checkID('storyID'), validateSetStoryStatus, asyncHandler(setStoryStatus))

export default router
