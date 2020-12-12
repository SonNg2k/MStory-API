import express from 'express';
import Project from '../../entity/Project';
import Story from '../../entity/Story';
import { asyncHandler, checkID, deleteEntityDoc } from '../../helpers';
import { fetchMembersOfProject, assignProjectMember, removeProjectMember, setProjectMemberRole } from './project.controller';
import { fetchProjectStories, upsertProjectStory } from '../stories/story.controller';
import { parseStoryQueryParams, parseUpsertStory } from '../stories/story.middleware';
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
    .post(checkID('projectID'), parseUpsertStory, asyncHandler(upsertProjectStory))

router.route("/:projectID/stories/:storyID")
    .delete(checkID('projectID'), checkID('storyID'), asyncHandler(deleteEntityDoc(Story, 'storyID')))

router.route("/:projectID/members")
    .get(checkID('projectID'), asyncHandler(fetchMembersOfProject))
    .put(checkID('projectID'), asyncHandler(assignProjectMember))

router.route('/:projectID/members/:userID')
    .delete(checkID('projectID'), checkID('userID'), asyncHandler(removeProjectMember))

router.route('/:projectID/members/:userID/set_role')
    .put(checkID('projectID'), checkID('userID'), asyncHandler(setProjectMemberRole))

export default router
