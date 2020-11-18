import { Request, Response } from "express";
import _ from "lodash";
import { getRepository, ILike } from "typeorm";
import User from "../../entity/User";

const userRepo = () => getRepository(User)

export const fetchUsers = async (req: Request, res: Response) => {
    let { keyword, role, page } = req.query
    const whereClause = (keyword) ? { fullname: ILike(`%${keyword}%`) } : undefined;
    // @ts-ignore
    const skip: number = (page - 1) * 6

    const [users, total_count] = await userRepo().findAndCount({
        where: whereClause,
        order: { fullname: "ASC" },
        skip: skip,
        take: 6
    })
    res.status(200).json({ total_count, users })
}

export const addUser = async (req: Request, res: Response) => {
    const { username, fullname, email, password } = req.body
    const user = { username, fullname, email, password }
    const newUser = await userRepo().create(user)
    const result = await userRepo().save(newUser)
    res.status(201).json(_.omit(result, ['password']))
}

export const editUser = async (req: Request, res: Response) => {
    let { username } = req.params
    username = username.toLowerCase()
    const userToEdit = await userRepo().findOne({ username })
    if (!userToEdit) return Promise.reject("No user with the given username")

    const { email, fullname, password } = req.body
    userRepo().merge(userToEdit, { email, fullname, password })
    const result = await userRepo().save(userToEdit)
    res.status(200).json(_.omit(result, ['password']))
}
