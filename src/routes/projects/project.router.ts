import express from 'express';
import Project from '../../entity/Project';
import Story from '../../entity/Story';
import { asyncHandler, checkID, deleteEntityDoc } from '../../helpers';
import { inviteUser } from '../members/member.controller';
import { fetchProjectStories, upsertProjectStory } from '../stories/story.controller';
import { parseStoryQueryParams, validateUpsertStory } from '../stories/story.middleware';
import { fetchProjects, fetchSpecificProject, updateProjectStatus, upsertProject } from './project.controller';
import { validateSetProjectStatus, parseProjectQueryParams, validateUpsertProject } from './project.middleware';

const router = express.Router();

router.route("/")
    .get(parseProjectQueryParams, asyncHandler(fetchProjects))
    .post(validateUpsertProject, asyncHandler(upsertProject))

router.route("/:projectID")
    .get(checkID('projectID'), asyncHandler(fetchSpecificProject))
    .put(checkID('projectID'), validateUpsertProject, asyncHandler(upsertProject))
    .delete(checkID('projectID'), asyncHandler(deleteEntityDoc(Project, 'projectID')))

router.route("/:projectID/set_status")
    .put(checkID('projectID'), validateSetProjectStatus, asyncHandler(updateProjectStatus))

router.route("/:projectID/stories")
    .get(checkID('projectID'), parseStoryQueryParams, asyncHandler(fetchProjectStories))
    .post(checkID('projectID'), validateUpsertStory, asyncHandler(upsertProjectStory))

router.route("/:projectID/stories/:storyID")
    .delete(checkID('projectID'), checkID('storyID'), asyncHandler(deleteEntityDoc(Story, 'storyID')))

router.route("/:projectID/members")
    .put(checkID('projectID'), asyncHandler(inviteUser))

export default router
