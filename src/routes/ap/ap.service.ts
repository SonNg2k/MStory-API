import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import createHttpError from "http-errors";
import User from "../../entity/User";
import UserRepo from "../users/user.repo";
import { JwtPayload } from '../../types/ap';

export default class ApService {
    static async SignUp(email: string, password: string, fullname: string, username: string) {
        email = email.toLowerCase()
        const foundUser = await UserRepo.findUserByEmail(email) || new User()
        if (foundUser && foundUser.password) return Promise.reject(new createHttpError.Conflict('Hey, that email is already in use by another user'))
        // Email: yes + password: null <-> Invited to a particular project but not exist in system
        foundUser.email = email
        foundUser.password = password
        foundUser.fullname = fullname
        foundUser.username = username
        await UserRepo.getRepo().save(foundUser)
    }

    static async Login(username: string, plainPassword: string): Promise<{ user: User, token: string }> {
        const foundUser = await UserRepo.findUserByUsername(username, true)
        if (!foundUser || !foundUser.password) return Promise.reject(new createHttpError.Unauthorized("We cannot find an account with that username"))

        const passwordMatched = await bcrypt.compare(plainPassword, foundUser.password)
        if (!passwordMatched) return Promise.reject(new createHttpError.Unauthorized('Either username or password is incorrect'))

        const claims: JwtPayload = { user_id: foundUser.user_id, last_login: new Date() }
        const token = jwt.sign(claims, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '1h' })
        return { user: foundUser, token }
    }

    /** Returns a Promise resolved with the decoded payload (claims) of the jwt token */
    static async VerifyToken(token: string): Promise<JwtPayload> {
        return await Promise.resolve(<JwtPayload>jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string))
    }
}
