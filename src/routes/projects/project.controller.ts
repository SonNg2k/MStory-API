import { Request, Response } from "express";
import { getRepository, ILike } from "typeorm";
import Project from "../../entity/Project";

const projectRepo = () => getRepository(Project)

export const fetchSpecificProject = async (req: Request, res: Response) => {
    const project = await projectRepo().findOne(req.params.projectID)
    if (!project) return Promise.reject("No project with the given ID is found")
    res.status(200).json(project)
}

export const fetchProjects = async (req: Request, res: Response) => {
    const { keyword, is_active, view, order, page } = req.query
    let whereClause = { is_active }
    // @ts-ignore
    whereClause = (keyword) ? { ...whereClause, name: ILike(`%${keyword}%`) } : whereClause
    // @ts-ignore
    const skip: number = (page - 1) * 6
    const [projects, total_count] = await projectRepo().findAndCount({
        select: ["project_id", "name", "description", "updated_at"],
        where: whereClause,
        // @ts-ignore
        order: { [view]: order.toUpperCase() },
        skip: skip,
        take: 6
    })
    res.status(200).json({ total_count, projects })
}

export const addProject = async (req: Request, res: Response) => {
    const { name, description, is_public } = req.body
    const newProject = await projectRepo().create({ name, description, is_public })
    const result = await projectRepo().save(newProject)
    res.status(200).json(result)
}
