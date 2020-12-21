import createHttpError from "http-errors";
import { DeepPartial, getConnection, getManager, getRepository } from "typeorm";
import { PROJECT_ROLES } from "../../constants";
import Project from "../../entity/Project";
import ProjectMember from "../../entity/ProjectMember";
import { constructUserFromEmail, findEntityDocByID, omit, removeArrayItem } from "../../helpers";
import { FindMembersFunc, FindProjectsFunc } from "../../types/projects";
import UserRepo from "../users/user.repo";
export default class ProjectRepo {
    static getRepo = () => getRepository(Project)

    static findProjects: FindProjectsFunc = async (options) => {
        const { page = 1, is_active, view, order, keyword, user_id } = options
        const skip = (page - 1) * 6

        let queryParams = []
        let selectConds = ''
        if (keyword) {
            selectConds += ` and p.name ilike ($1)`
            queryParams[0] = `%${keyword}%`
        }
        if (user_id) {
            selectConds += ` and pm.user_id = $${queryParams.length + 1}`
            queryParams = [...queryParams, user_id]
        }
        const selectQuery = `
        select p.project_id, p.name, p.description, p.is_public, p.updated_at
        from project_members pm
        inner join projects p on p.project_id = pm.project_id and p.is_active = ${is_active} ${selectConds}
        order by p.${view} ${order}
        offset ${skip}
        limit 6;`

        const countQuery = `
        select COUNT(distinct (pm.project_id, pm.user_id)) as cnt
        from project_members pm
        inner join projects p on p.project_id = pm.project_id and p.is_active = ${is_active} ${selectConds};`
        let projects = getManager().query(selectQuery, queryParams)
        let total_count = getManager().query(countQuery, queryParams)
        projects = await projects
        total_count = await total_count
        // @ts-ignore
        total_count = +(total_count[0].cnt)
        return { total_count, projects } as any
    }

    static findMembers: FindMembersFunc = async (options) => {
        const { projectID, page = 1, keyword, role } = options
        const skip = (page - 1) * 6
        let queryParams = [projectID, skip]
        let selectConds = ''
        let countConds = ''
        if (keyword) {
            selectConds = ` and m.fullname ilike ($${queryParams.length + 1})`
            countConds = ` and m.fullname ilike ($${queryParams.length})`
            queryParams = [...queryParams, `%${keyword}%`]
        }
        if (role) {
            selectConds += ` and pm.role = $${queryParams.length + 1}`
            countConds += ` and pm.role = $${queryParams.length}`
            queryParams = [...queryParams, role]
        }

        const selectQuery = `
        select pm.role as role, m.user_id, m.fullname, m.username, pm.created_at as since
        from project_members pm
        inner join users m on m.user_id = pm.user_id and pm.project_id = $1 ${selectConds}
        order by pm.created_at desc
        offset $2 limit 6;`

        const countQuery = `
        select COUNT(distinct (pm.project_id, pm.user_id)) as cnt
        from project_members pm
        inner join users m on m.user_id = pm.user_id and pm.project_id = $1 ${countConds}`
        let members = getManager().query(selectQuery, queryParams)
        let total_count = getManager().query(countQuery, removeArrayItem(queryParams, 1))
        members = await members
        total_count = await total_count
        // @ts-ignore
        total_count = +total_count[0].cnt
        return { total_count, members } as any
    }

    static findLinkBetweenProjectAndUser = async (projectID: string, userID: string) =>
        await getRepository(ProjectMember).findOne({ project: { project_id: projectID }, member: { user_id: userID } })

    static createProject = async (newProject: DeepPartial<Project>) => {
        const project = await ProjectRepo.getRepo().create(newProject)
        return await ProjectRepo.getRepo().save(project)
    }

    static findByIdAndUpdate = async (projectID: string, newProject: DeepPartial<Project>) => {
        const project = await findEntityDocByID(ProjectRepo.getRepo(), projectID)
        ProjectRepo.getRepo().merge(project, newProject)
        return await ProjectRepo.getRepo().save(project)
    }

    static findByIdAndSetStatus = async (projectID: string, is_active: boolean) =>
        await ProjectRepo.findByIdAndUpdate(projectID, { is_active })

    static assignMemberToProject = async (projectID: string, invited_email: string, role: typeof PROJECT_ROLES[number]) => {
        let user = await UserRepo.getRepo().findOne({ where: { email: invited_email } })
        if (!user) {
            user = UserRepo.getRepo().create(constructUserFromEmail(invited_email))
            user = await UserRepo.getRepo().save(user)
        }
        await getConnection().createQueryBuilder().insert().into(ProjectMember)
            .values({ project: { project_id: projectID }, member: user, role }).execute()

        return { ...omit(user, ['email', 'password', 'last_login', 'created_at', 'updated_at']), role }
    }

    static setRoleOfProjectMember = async (projectID: string, userID: string, role: typeof PROJECT_ROLES[number]) => {
        const { affected } = await getConnection().createQueryBuilder().update(ProjectMember)
            .set({ role })
            .where('project_id = :pid', { pid: projectID })
            .andWhere('user_id = :uid', { uid: userID })
            .execute()
        if (!affected) return Promise.reject(new createHttpError.NotFound('The project member does not exist'))
    }

    static removeMemberFromProject = async (projectID: string, userID: string) => {
        const { affected } = await getConnection().createQueryBuilder().delete().from(ProjectMember)
            .where('project_id = :pid', { pid: projectID })
            .andWhere('user_id = :uid', { uid: userID })
            .execute()
        if (!affected) return Promise.reject(new createHttpError.NotFound('The project member does not exist'))
    }
}
