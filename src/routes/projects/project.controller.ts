import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Project from "../../entity/Project";

const projectRepo = () => getRepository(Project)

export const fetchProjects = async (req: Request, res: Response) => {
    const { keyword, page } = req.query
    // @ts-ignore
    const skip: number = (page - 1) * 6
    const [projects, total_count] = await projectRepo().findAndCount({
        where: undefined,
        order: { name: "ASC" },
        skip: skip,
        take: 6
    })
    res.status(200).json({ projects, total_count })
}
