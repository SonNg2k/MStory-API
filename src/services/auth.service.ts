import createHttpError from "http-errors";
import User from "../entity/User";
import UserRepo from "../routes/users/user.repo";

export default class AuthService {
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
}
