import express from 'express'
import { asyncHandler } from '../../helpers';
import { addUser, deleteUser, editUser, fetchUsers } from './user.controller';
import { parseUserQueryParams, validateAddUser, validateDeleteUser, validateEditUser } from './user.middleware';

const router = express.Router();

router.route("/")
    .get(parseUserQueryParams, asyncHandler(fetchUsers))
    .post(validateAddUser, asyncHandler(addUser))

router.route("/:username")
    .put(validateEditUser, asyncHandler(editUser))
    .delete(validateDeleteUser, asyncHandler(deleteUser))

export default router
