import express from 'express'
import { addUser, fetchUsers } from '../controllers/user.controller';

const router = express.Router();

router.route("/")
.get(fetchUsers)
.post(addUser)

export default router
