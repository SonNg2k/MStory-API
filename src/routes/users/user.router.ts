import express from 'express'
import { asyncHandler } from '../../helper';
import { addUser, fetchUsers } from './user.controller';
import { parseQueryParams, validateAddUser } from './user.middleware';

const router = express.Router();

router.route("/")
.get(parseQueryParams, asyncHandler(fetchUsers))
.post(validateAddUser, asyncHandler(addUser))

export default router
