import express from 'express'
import { asyncHandler } from '../../helper';
import { addUser, editUser, fetchUsers } from './user.controller';
import { parseQueryParams, validateAddUser, validateEditUser } from './user.middleware';

const router = express.Router();

router.route("/")
    .get(parseQueryParams, asyncHandler(fetchUsers))
    .post(validateAddUser, asyncHandler(addUser))

router.route("/:username")
    .put(validateEditUser, asyncHandler(editUser))

export default router
