import { Request, Response } from "express";
import { getRepository, ILike } from "typeorm";
import Story from "../../entity/Story";

const storyRepo = () => getRepository(Story)

export const fetchProjectStories = async (req: Request, res: Response) => {
    const { projectID } = req.params
    const { keyword, status, type, page } = req.query
    // @ts-ignore
    const skip: number = (page - 1) * 6
    let whereClause = {}
    whereClause = (keyword) ? { ...whereClause, title: ILike(`%${keyword}%`) } : whereClause
    whereClause = (status) ? { ...whereClause, status } : whereClause
    whereClause = (type) ? { ...whereClause, type } : whereClause
    whereClause = { ...whereClause, project: { project_id: projectID } }

    const [project_stories, total_count] = await storyRepo().findAndCount({
        select: ['story_id', 'title', 'type', 'points', 'description', 'status', 'updated_at'],
        where: whereClause,
        order: { created_at: "ASC" },
        skip: skip,
        take: 6,
    })
    res.status(200).json({ total_count, project_stories })
}
