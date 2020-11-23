import express from 'express'
import { asyncHandler } from '../../helpers';
import { addProject, deleteProject, fetchProjects, fetchSpecificProject } from './project.controller';
import { parseQueryParams, validateUpsertProject } from './project.middleware';

const router = express.Router();

router.route("/")
    .get(parseQueryParams, asyncHandler(fetchProjects))
    .post(validateUpsertProject, asyncHandler(addProject))

router.route("/:projectID")
    .get(asyncHandler(fetchSpecificProject))
    .delete(asyncHandler(deleteProject))

export default router
