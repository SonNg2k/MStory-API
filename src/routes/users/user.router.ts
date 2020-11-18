import express from 'express'
import { asyncHandler } from '../../helpers';
import { addUser, deleteUser, editUser, fetchUsers } from './user.controller';
import { parseQueryParams, validateAddUser, validateDeleteUser, validateEditUser } from './user.middleware';

const router = express.Router();

router.route("/")
    .get(parseQueryParams, asyncHandler(fetchUsers))
    .post(validateAddUser, asyncHandler(addUser))

router.route("/:username")
    .put(validateEditUser, asyncHandler(editUser))
    .delete(validateDeleteUser, asyncHandler(deleteUser))

export default router
