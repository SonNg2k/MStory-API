import express from 'express';
import { asyncHandler } from '../../helpers';
import { deleteProject, fetchProjects, fetchSpecificProject, updateProjectStatus, upsertProject } from './project.controller';
import { validateSetStatus, parseQueryParams, validateUpsertProject } from './project.middleware';

const router = express.Router();

router.route("/")
    .get(parseQueryParams, asyncHandler(fetchProjects))
    .post(validateUpsertProject, asyncHandler(upsertProject))

router.route("/:projectID")
    .get(asyncHandler(fetchSpecificProject))
    .put(validateUpsertProject, asyncHandler(upsertProject))
    .delete(asyncHandler(deleteProject))

router.route("/:projectID/set_status")
    .put(validateSetStatus, asyncHandler(updateProjectStatus))

export default router
