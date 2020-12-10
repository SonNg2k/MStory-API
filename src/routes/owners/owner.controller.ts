import { Request, Response } from "express"
import { getConnection } from "typeorm"
import StoryOwner from "../../entity/StoryOwner"

export const addStoryOwner = async (req: Request, res: Response) => {
    const { storyID } = req.params
    const { owner_id } = req.body
    await getConnection().createQueryBuilder().insert().into(StoryOwner)
        .values({ story: { story_id: storyID }, owner: { user_id: owner_id } }).execute()
    res.status(204).json()
}

export const removeStoryOwner = async (req: Request, res: Response) => {
    const { storyID, ownerID } = req.params
    await getConnection().createQueryBuilder().delete().from(StoryOwner)
        .where('story_id = :sid', { sid: storyID }).andWhere('user_id = :uid', { uid: ownerID }).execute()
    res.status(204).json()
}
