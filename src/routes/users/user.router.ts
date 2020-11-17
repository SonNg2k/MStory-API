import express from 'express'
import { addUser, fetchUsers } from './user.controller';
import { parseQueryParams } from './user.middleware';

const router = express.Router();

router.route("/")
.get(parseQueryParams, fetchUsers)
.post(addUser)

export default router
