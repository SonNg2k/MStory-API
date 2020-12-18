import express from 'express'
import { asyncHandler, checkID } from '../../helpers'
import { authUser } from '../ap/ap.middleware'
import { addStoryOwner, removeStoryOwner } from './story.controller'
import { setStoryStatus, upsertProjectStory } from './story.controller'
import { validateSetStoryStatus, parseUpsertStory } from './story.middleware'

const router = express.Router()

router.route('/:storyID')
    .put(authUser, checkID('storyID'), parseUpsertStory, asyncHandler(upsertProjectStory))

router.route('/:storyID/ownerIDs')
    .post(authUser, checkID('storyID'), asyncHandler(addStoryOwner))

router.route('/:storyID/set_status')
    .put(authUser, checkID('storyID'), validateSetStoryStatus, asyncHandler(setStoryStatus))

router.route('/:storyID/ownerIDs/:ownerID')
    .delete(authUser, checkID('storyID'), checkID('ownerID'), asyncHandler(removeStoryOwner))

export default router
