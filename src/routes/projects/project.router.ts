import express from 'express'
import { asyncHandler } from '../../helpers';
import { addProject, fetchProjects, fetchSpecificProject } from './project.controller';
import { parseQueryParams, validateAddProject } from './project.middleware';

const router = express.Router();

router.route("/")
    .get(parseQueryParams, asyncHandler(fetchProjects))
    .post(validateAddProject, asyncHandler(addProject))

router.route("/:projectID")
    .get(asyncHandler(fetchSpecificProject))

export default router
