import { Request, Response } from "express";
import { getConnection, getManager, getRepository } from "typeorm";
import ProjectMember from "../../entity/ProjectMember";
import User from "../../entity/User";
import { constructUserFromEmail, omit } from "../../helpers";

const userRepo = () => getRepository(User)

export const fetchProjectMembers = async (req: Request, res: Response) => {
    const { projectID } = req.params
    const { keyword, role, page } = req.query
    // @ts-ignore
    const skip: number = (page - 1) * 6

    const selectQuery = `
    select pm.role as role, m.user_id, m.fullname, m.username, pm.created_at as since
    from project_members pm
    inner join users m on m.user_id = pm.user_id and pm.project_id = $1
    order by pm.created_at
    offset $2
    limit 6;
    `
    const countQuery = `
    select COUNT(distinct (pm.project_id, pm.user_id)) as cnt
    from project_members pm
    inner join users m on m.user_id = pm.user_id and pm.project_id = $1
    `

    let members = getManager().query(selectQuery, [projectID, skip])
    let total_count = getManager().query(countQuery, [projectID])
    members = await members
    total_count = await total_count
    // @ts-ignore
    total_count = +total_count[0].cnt
    res.status(200).json({ total_count, members })
}

export const inviteUser = async (req: Request, res: Response) => {
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
