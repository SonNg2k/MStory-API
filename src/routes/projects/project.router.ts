import express from 'express'
import { asyncHandler } from '../../helpers';
import { upsertProject, deleteProject, fetchProjects, fetchSpecificProject } from './project.controller';
import { parseQueryParams, validateUpsertProject } from './project.middleware';

const router = express.Router();

router.route("/")
    .get(parseQueryParams, asyncHandler(fetchProjects))
    .post(validateUpsertProject, asyncHandler(upsertProject))

router.route("/:projectID")
    .get(asyncHandler(fetchSpecificProject))
    .put(validateUpsertProject, asyncHandler(upsertProject))
    .delete(asyncHandler(deleteProject))

export default router
