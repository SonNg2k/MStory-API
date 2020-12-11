import { Request, Response } from "express"
import StoryRepo from "../stories/story.repo"

export const addStoryOwner = async (req: Request, res: Response) => {
    const { storyID } = req.params
    const { owner_id } = req.body
    await StoryRepo.addStoryOwner(storyID, owner_id)
    res.status(200).json(await StoryRepo.findStoryOwners(storyID))
}

export const removeStoryOwner = async (req: Request, res: Response) => {
    const { storyID, ownerID } = req.params
    await StoryRepo.removeStoryOwner(storyID, ownerID)
    res.status(204).json()
}
