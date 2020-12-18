import express from 'express'
import { asyncHandler } from '../../helpers';
import { authUser } from '../ap/ap.middleware';
import { addUser, deleteUser, editUser, fetchUsers } from './user.controller';
import { parseUserQueryParams, validateAddUser, checkUsername, validateEditUser } from './user.middleware';

const router = express.Router();

router.route("/")
    .get(authUser, parseUserQueryParams, asyncHandler(fetchUsers))
    .post(authUser, validateAddUser, asyncHandler(addUser))

router.route("/:username")
    .put(authUser, checkUsername, validateEditUser, asyncHandler(editUser))
    .delete(authUser, checkUsername, asyncHandler(deleteUser))

export default router
