import { Request, Response } from "express";
import { getConnection, getManager, getRepository, ILike } from "typeorm";
import Story from "../../entity/Story";
import StoryOwner from "../../entity/StoryOwner";
import { findEntityDocByID, omit, storyOwnerList } from "../../helpers";
import StoryRepo from "./story.repo";


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
        order: { created_at: 'DESC' },
        skip: skip,
        take: 6,
    })
    const asyncFuncs = []
    for (const idx in project_stories)
        asyncFuncs.push((async () => { // attach owners to each story
            const { story_id } = project_stories[idx]
            const storyOwners = await StoryRepo.findOwnersByStoryID(story_id)
            project_stories[idx].owners = storyOwners
        })())
    await Promise.all(asyncFuncs)
    res.status(200).json({ total_count, project_stories })
}

export const upsertProjectStory = async (req: Request, res: Response) => {
    const { title, type, points, description, owner_ids } = req.body
    const { projectID, storyID } = req.params
    let story = new Story()
    let result

    if (projectID) {// POST --> /projects/:projectID/stories
        result = await getConnection().createQueryBuilder().insert().into(Story)
            .values(Object.assign(story, {
                title, type, points, description, project: { project_id: projectID }
            })).execute()
        // Add story owners if provided...
        if (owner_ids.length > 0) await getConnection().createQueryBuilder().insert().into(StoryOwner)
            .values(storyOwnerList(result.identifiers[0].story_id, owner_ids)).execute()
        story.owners = await StoryRepo.findOwnersByStoryID(result.identifiers[0].story_id)
    }
    if (storyID) { // PUT --> /stories/:storyID
        story = await findEntityDocByID(storyRepo(), storyID)
        storyRepo().merge(story, { title, type, points, description })
        story = await storyRepo().save(story)
    }
    res.status(200).json(omit(story, ['created_at', 'project']))
}

export const setStoryStatus = async (req: Request, res: Response) => {
    const { status } = req.body
    const { storyID } = req.params

    const story = await findEntityDocByID(storyRepo(), storyID)
    storyRepo().merge(story, { status })
    await storyRepo().save(story)
    res.status(204).json()
}
