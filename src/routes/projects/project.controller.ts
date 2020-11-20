import { Request, Response } from "express";
import { getRepository, ILike } from "typeorm";
import Project from "../../entity/Project";

const projectRepo = () => getRepository(Project)

export const fetchProjects = async (req: Request, res: Response) => {
    const { keyword, is_active, view, order, page } = req.query
    let whereClause = { is_active }
    // @ts-ignore
    whereClause = (keyword) ? { ...whereClause, name: ILike(`%${keyword}%`) } : whereClause
    // @ts-ignore
    const skip: number = (page - 1) * 6
    const [projects, total_count] = await projectRepo().findAndCount({
        where: whereClause,
        // @ts-ignore
        order: { [view]: order },
        skip: skip,
        take: 6
    })
    res.status(200).json({ total_count, projects })
}
