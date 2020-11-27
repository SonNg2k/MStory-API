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

export const upsertProjectStory = async (req: Request, res: Response) => {
    const { title, type, points, description } = req.body
    const { projectID, storyID } = req.params
    let story

    if (projectID) // POST --> /projects/:projectID/stories
        story = await storyRepo()
            .create({ title, type, points, description, project: { project_id: projectID } })
    if (storyID) { // PUT --> /stories/:storyID
        story = await findStoryByID(storyID)
        storyRepo().merge(story, { title, type, points, description })
    }
    // @ts-ignore
    const result = await storyRepo().save(story)
    res.status(200).json(result)
}

const findStoryByID = async (storyID: string) => {
    const story = await storyRepo().findOne(storyID)
    if (!story) return Promise.reject("No story with the given ID is found")
    return story
}
