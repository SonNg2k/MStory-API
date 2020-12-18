import express from 'express';
import Project from '../../entity/Project';
import Story from '../../entity/Story';
import { asyncHandler, checkID, deleteEntityDoc } from '../../helpers';
import { fetchMembersOfProject, assignProjectMember, removeProjectMember, setProjectMemberRole } from './project.controller';
import { fetchProjectStories, upsertProjectStory } from '../stories/story.controller';
import { parseStoryQueryParams, parseUpsertStory } from '../stories/story.middleware';
import { fetchProjects, fetchSpecificProject, updateProjectStatus, upsertProject } from './project.controller';
import { validateSetProjectStatus, parseProjectQueryParams, validateUpsertProject } from './project.middleware';
import { authUser } from '../ap/ap.middleware';

const router = express.Router();

router.route("/")
    .get(authUser, parseProjectQueryParams, asyncHandler(fetchProjects))
    .post(authUser, validateUpsertProject, asyncHandler(upsertProject))

router.route("/:projectID")
    .get(checkID('projectID'), asyncHandler(fetchSpecificProject))
    .put(authUser, checkID('projectID'), validateUpsertProject, asyncHandler(upsertProject))
    .delete(authUser, checkID('projectID'), asyncHandler(deleteEntityDoc(Project, 'projectID')))

router.route("/:projectID/set_status")
    .put(authUser, checkID('projectID'), validateSetProjectStatus, asyncHandler(updateProjectStatus))

router.route("/:projectID/stories")
    .get(authUser, checkID('projectID'), parseStoryQueryParams, asyncHandler(fetchProjectStories))
    .post(authUser, checkID('projectID'), parseUpsertStory, asyncHandler(upsertProjectStory))

router.route("/:projectID/stories/:storyID")
    .delete(authUser, checkID('projectID'), checkID('storyID'), asyncHandler(deleteEntityDoc(Story, 'storyID')))

router.route("/:projectID/members")
    .get(authUser, checkID('projectID'), asyncHandler(fetchMembersOfProject))
    .put(authUser, checkID('projectID'), asyncHandler(assignProjectMember))

router.route('/:projectID/members/:userID')
    .delete(authUser, checkID('projectID'), checkID('userID'), asyncHandler(removeProjectMember))

router.route('/:projectID/members/:userID/set_role')
    .put(authUser, checkID('projectID'), checkID('userID'), asyncHandler(setProjectMemberRole))

export default router
