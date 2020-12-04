import { Request, Response } from "express";
import { getConnection, getManager, getRepository } from "typeorm";
import ProjectMember from "../../entity/ProjectMember";
import User from "../../entity/User";
import { constructUserFromEmail, omit, removeArrayItem } from "../../helpers";

const userRepo = () => getRepository(User)

export const fetchProjectMembers = async (req: Request, res: Response) => {
    const { projectID } = req.params
    const { keyword, role, page } = req.query
    // @ts-ignore
    const skip: number = (page - 1) * 6

    let queryParams: Array<any> = [projectID, skip]
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
    res.status(200).json({ total_count, members })
}

export const assignProjectMember = async (req: Request, res: Response) => {
    const { projectID } = req.params
    const { invited_email, role } = req.body
    let user = await userRepo
        ().findOne({ where: { email: invited_email } })
    if (!user) {
        user = await userRepo().create(constructUserFromEmail(invited_email))
        user = await userRepo().save(user)
    }
    await getConnection().createQueryBuilder().insert().into(ProjectMember)
        .values({ project: { project_id: projectID }, member: user, role }).execute()

    res.status(200)
        .json({ ...omit(user, ['email', 'password', 'last_login', 'created_at', 'updated_at']), role })
}

export const setProjectMemberRole = async (req: Request, res: Response) => {
    const { projectID, userID } = req.params
    const { role } = req.body
    const { affected } = await getConnection().createQueryBuilder().update(ProjectMember)
        .set({ role })
        .where('project_id = :pid', { pid: projectID })
        .andWhere('user_id = :uid', { uid: userID })
        .execute()
    if (!affected) return Promise.reject("Failed to update project member's role due to false ids")
    res.status(204).json()
}

export const removeProjectMember = async (req: Request, res: Response) => {
    const { projectID, userID } = req.params
    const { affected } = await getConnection().createQueryBuilder().delete().from(ProjectMember)
        .where('project_id = :pid', { pid: projectID })
        .andWhere('user_id = :uid', { uid: userID })
        .execute()
    if (!affected) return Promise.reject('Failed to remove member from project due to false ids')
    res.status(204).json()
}
