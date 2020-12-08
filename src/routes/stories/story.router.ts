import express from 'express'
import { asyncHandler, checkID } from '../../helpers'
import { setStoryStatus, upsertProjectStory } from './story.controller'
import { validateSetStoryStatus, parseUpsertStory } from './story.middleware'

const router = express.Router()

router.route('/:storyID')
    .put(checkID('storyID'), parseUpsertStory, asyncHandler(upsertProjectStory))

router.route('/:storyID/set_status')
    .put(checkID('storyID'), validateSetStoryStatus, asyncHandler(setStoryStatus))

export default router
