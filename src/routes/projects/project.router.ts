import express from 'express'
import { asyncHandler } from '../../helpers';
import { addProject, fetchProjects } from './project.controller';
import { parseQueryParams, validateAddProject } from './project.middleware';

const router = express.Router();

router.route("/")
    .get(parseQueryParams, asyncHandler(fetchProjects))
    .post(validateAddProject, asyncHandler(addProject))

export default router
