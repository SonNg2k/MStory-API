import { Request, Response } from "express";
import UserRepo from "./user.repo";

export const fetchUsers = async (req: Request, res: Response) => {
    let { keyword, role, page } = <unknown>req.query as { keyword: string, role: string, page: number }
    res.status(200).json(await UserRepo.getUsersByPage(page, keyword, role))
}

export const addUser = async (req: Request, res: Response) => {
    const { username, fullname, email, password } = req.body
    res.status(201).json(await UserRepo.createUser({ username, fullname, email, password }))
}

export const editUser = async (req: Request, res: Response) => {
    const { username } = req.params
    const { email, fullname, password } = req.body
    res.status(200).json(await UserRepo.findByUsernameAndEdit(username, { email, fullname, password }))
}

export const deleteUser = async (req: Request, res: Response) =>
    res.status(204).json(await UserRepo.findByUsernameAndDelete(req.params.username))

