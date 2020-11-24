import express from 'express';
import { asyncHandler, checkID } from '../../helpers';
import { deleteProject, fetchProjects, fetchSpecificProject, updateProjectStatus, upsertProject } from './project.controller';
import { validateSetStatus, parseQueryParams, validateUpsertProject } from './project.middleware';

const router = express.Router();

router.route("/")
    .get(parseQueryParams, asyncHandler(fetchProjects))
    .post(validateUpsertProject, asyncHandler(upsertProject))

router.route("/:projectID")
    .get(checkID('projectID'), asyncHandler(fetchSpecificProject))
    .put(checkID('projectID'), validateUpsertProject, asyncHandler(upsertProject))
    .delete(checkID('projectID'), asyncHandler(deleteProject))

router.route("/:projectID/set_status")
    .put(checkID('projectID'), validateSetStatus, asyncHandler(updateProjectStatus))

export default router
