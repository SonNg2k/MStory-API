import express from 'express'
import { asyncHandler } from '../../helpers';
import { addUser, deleteUser, editUser, fetchUsers } from './user.controller';
import { parseUserQueryParams, validateAddUser, checkUsername, validateEditUser } from './user.middleware';

const router = express.Router();

router.route("/")
    .get(parseUserQueryParams, asyncHandler(fetchUsers))
    .post(validateAddUser, asyncHandler(addUser))

router.route("/:username")
    .put(checkUsername, validateEditUser, asyncHandler(editUser))
    .delete(checkUsername, asyncHandler(deleteUser))

export default router
