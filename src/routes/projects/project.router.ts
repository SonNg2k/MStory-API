import express from 'express'
import { asyncHandler } from '../../helpers';
import { fetchProjects } from './project.controller';
import { parseQueryParams } from './project.middleware';

const router = express.Router();

router.route("/")
    .get(parseQueryParams, asyncHandler(fetchProjects))

export default router
