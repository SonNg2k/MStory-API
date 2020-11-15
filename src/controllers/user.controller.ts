import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import _ from "lodash";
import User from "../entity/User";

const userRepo = () => getRepository(User)

export const fetchUsers = async (req: Request, res: Response) => {
    const [users, total_count] = await userRepo().findAndCount()
    res.status(200).json({ total_count, users })
}

export const addUser = async (req: Request, res: Response) => {
    const { user } = req.body
    const newUser = await userRepo().create(user)
    const result = await userRepo().save(newUser)
    res.status(201).json(_.omit(result, ['password']))
}
