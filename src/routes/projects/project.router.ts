import express from 'express'
import { asyncHandler } from '../../helpers';
import { fetchProjects } from './project.controller';

const router = express.Router();

router.route("/")
    .get(asyncHandler(fetchProjects))

export default router
