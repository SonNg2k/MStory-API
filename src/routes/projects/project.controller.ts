import { Request, Response } from "express";
import { getRepository, ILike } from "typeorm";
import Project from "../../entity/Project";

const projectRepo = () => getRepository(Project)

export const fetchSpecificProject = async (req: Request, res: Response) => {
    const project = await findProjectByID(req.params.projectID)
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
        select: ["project_id", "name", "description", "is_public" , "updated_at"],
        where: whereClause,
        // @ts-ignore
        order: { [view]: order.toUpperCase() },
        skip: skip,
        take: 6
    })
    res.status(200).json({ total_count, projects })
}

export const upsertProject = async (req: Request, res: Response) => {
    const { name, description, is_public } = req.body
    const { projectID } = req.params
    let project

    if (projectID) { // PUT --> /projects/:projectID
        project = await findProjectByID(projectID)
        projectRepo().merge(project, { name, description, is_public })
    } else // POST --> /projects
        project = await projectRepo().create({ name, description, is_public })
    const result = await projectRepo().save(project)
    res.status(200).json(result)
}

export const updateProjectStatus = async (req: Request, res: Response) => {
    const project = await findProjectByID(req.params.projectID)
    const { is_active } = req.body
    projectRepo().merge(project, { is_active })
    await projectRepo().save(project)
    res.status(204).json()
}

export const deleteProject = async (req: Request, res: Response) => {
    const projectToRemove = await findProjectByID(req.params.projectID)
    await projectRepo().remove(projectToRemove)
    res.status(200).json({ message: `${projectToRemove.name} has been deleted successfully` })
}

const findProjectByID = async (projectID: string) => {
    const project = await projectRepo().findOne(projectID)
    if (!project) return Promise.reject("No project with the given ID is found")
    return project
}
