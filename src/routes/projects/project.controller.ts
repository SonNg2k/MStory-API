import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Project from "../../entity/Project";
import { findEntityDocByID } from "../../helpers";
import ProjectRepo from "./project.repo";

const projectRepo = () => getRepository(Project)

export const fetchSpecificProject = async (req: Request, res: Response) =>
    res.status(200).json(await findEntityDocByID(projectRepo(), req.params.projectID))

export const fetchProjects = async (req: Request, res: Response) => {
    const { keyword, is_active, view, order, page } = req.query as any
    const { user_id } = req.user
    res.status(200).json(await ProjectRepo.findProjects({ page, is_active, view, order, keyword, user_id }))
}

export const fetchMembersOfProject = async (req: Request, res: Response) => {
    const { projectID } = req.params
    const { keyword, role, page } = req.query as any
    res.status(200).json(await ProjectRepo.findMembers({ projectID, page, keyword, role }))
}

export const upsertProject = async (req: Request, res: Response) => {
    const { name, description, is_public } = req.body
    const { projectID } = req.params
    let project

    if (projectID) { // PUT --> /projects/:projectID
        project = await ProjectRepo.findByIdAndUpdate(projectID, { name, description, is_public })
    } else // POST --> /projects
        project = await ProjectRepo.createProject({ name, description, is_public })
    res.status(200).json(project)
}

export const updateProjectStatus = async (req: Request, res: Response) => {
    const { projectID } = req.params
    const { is_active } = req.body
    res.status(204).json(await ProjectRepo.findByIdAndSetStatus(projectID, is_active))
}

export const assignProjectMember = async (req: Request, res: Response) => {
    const { projectID } = req.params
    const { invited_email, role } = req.body
    res.status(200).json(await ProjectRepo.assignMemberToProject(projectID, invited_email, role))
}

export const setProjectMemberRole = async (req: Request, res: Response) => {
    const { projectID, userID } = req.params
    const { role } = req.body
    res.status(204).json(await ProjectRepo.setRoleOfProjectMember(projectID, userID, role))
}

export const removeProjectMember = async (req: Request, res: Response) => {
    const { projectID, userID } = req.params
    res.status(204).json(await ProjectRepo.removeMemberFromProject(projectID, userID))
}
