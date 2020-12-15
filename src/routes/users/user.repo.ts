import createHttpError from "http-errors";
import { DeepPartial, getRepository, ILike } from "typeorm";
import User from "../../entity/User";
import { omit } from "../../helpers";

export default class UserRepo {
    static getRepo = () => getRepository(User)
    /**
     * User's password is included in the result and not found user will return a promise resolved with undefined
     */
    static findUserByEmail = async (email: string) =>
        await getRepository(User).createQueryBuilder('u')
            .select(['u.user_id', 'u.email', 'u.fullname', 'u.username', 'u.password'])
            .where(`u.email = :email`, { email }).getOne()
    /**
     * User's password is excluded and not found user will return a rejected promise
     */
    private static findUserByUsername = async (username: string) => {
        username = username.toLowerCase()
        const foundUser = await UserRepo.getRepo().findOne({ username })
        if (!foundUser) return Promise.reject(new createHttpError.NotFound("The user does not exist"))
        return foundUser
    }

    static getUsersByPage = async (page: number = 1, keyword?: string, role?: string) => {
        const skip = (page - 1) * 6
        const whereClause = (keyword) ? { fullname: ILike(`%${keyword}%`) } : undefined;
        const [users, total_count] = await UserRepo.getRepo().findAndCount({
            where: whereClause,
            order: { created_at: "DESC" },
            skip: skip,
            take: 6
        })
        return { total_count, users }
    }

    static createUser = async (newUser: DeepPartial<User>) => {
        const userToInsert = await UserRepo.getRepo().create(newUser)
        const result = await UserRepo.getRepo().save(userToInsert)
        return omit(result, ['password'])
    }

    static findByUsernameAndEdit = async (username: string, newUser: DeepPartial<User>) => {
        const userToEdit = await UserRepo.findUserByUsername(username)
        UserRepo.getRepo().merge(userToEdit, newUser)
        const result = await UserRepo.getRepo().save(userToEdit)
        return omit(result, ['password'])
    }

    static findByUsernameAndDelete = async (username: string) => {
        const userToRemove = await UserRepo.findUserByUsername(username)
        return await UserRepo.getRepo().remove(userToRemove)
    }
}
