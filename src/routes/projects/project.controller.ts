import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Project from "../../entity/Project";

const projectRepo = () => getRepository(Project)

export const fetchProjects = async (req: Request, res: Response) => {
    const [projects, total_count] = await projectRepo().findAndCount()
    res.status(200).json({ projects, total_count })
}
