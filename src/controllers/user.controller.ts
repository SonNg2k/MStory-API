import { NextFunction, Request, Response } from "express";


export const getUser = (req: Request, res:Response) => {

}

export const addUser = (req: Request, res: Response) => {

}

export const editUser = (req: Request, res: Response) => {

}

export const deleteUser = (req: Request, res: Response) => {

}

interface controller {
    (req: Request, res: Response, next?: NextFunction): void
}
