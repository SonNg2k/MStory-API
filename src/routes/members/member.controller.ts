import { Request, Response } from "express";
import { getConnection, getRepository } from "typeorm";
import ProjectMembers from "../../entity/ProjectMembers";
import User from "../../entity/User";
import { constructUserFromEmail, omit } from "../../helpers";

const userRepo = () => getRepository(User)

export const inviteUser = async (req: Request, res: Response) => {
    const { projectID } = req.params
    const { invited_email, role } = req.body
    let user = await userRepo().findOne({ where: { email: invited_email } })
    if (!user) {
        user = await userRepo().create(constructUserFromEmail(invited_email))
        user = await userRepo().save(user)
    }
    await getConnection().createQueryBuilder().insert().into(ProjectMembers)
        .values({ project: { project_id: projectID }, member: user, role }).execute()

    res.status(200)
        .json({ ...omit(user, ['email', 'password', 'last_login', 'created_at', 'updated_at']), role })
}
