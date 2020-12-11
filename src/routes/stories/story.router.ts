import express from 'express'
import { asyncHandler, checkID } from '../../helpers'
import { addStoryOwner, removeStoryOwner } from './story.controller'
import { setStoryStatus, upsertProjectStory } from './story.controller'
import { validateSetStoryStatus, parseUpsertStory } from './story.middleware'

const router = express.Router()

router.route('/:storyID')
    .put(checkID('storyID'), parseUpsertStory, asyncHandler(upsertProjectStory))

router.route('/:storyID/ownerIDs')
    .post(checkID('storyID'), asyncHandler(addStoryOwner))

router.route('/:storyID/set_status')
    .put(checkID('storyID'), validateSetStoryStatus, asyncHandler(setStoryStatus))

router.route('/:storyID/ownerIDs/:ownerID')
    .delete(checkID('storyID'), checkID('ownerID'), asyncHandler(removeStoryOwner))

export default router
