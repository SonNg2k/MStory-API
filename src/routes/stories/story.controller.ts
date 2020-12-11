import { Request, Response } from "express";
import { STORY_STATUS, STORY_TYPES } from "../../constants";
import { omit } from "../../helpers";
import StoryRepo from "./story.repo";

export const fetchProjectStories = async (req: Request, res: Response) => {
    const { projectID } = req.params
    const { keyword, page, status, type } = <unknown>req.query as { keyword: string, page: number, status: typeof STORY_STATUS[number], type: typeof STORY_TYPES[number] }

    const skip = (page - 1) * 6
    const [project_stories, total_count] = await StoryRepo.findProjectStories(projectID, skip, keyword, status, type)
    // Populate the story owners to each story found...
    const asyncFuncs = []
    for (const idx in project_stories)
        asyncFuncs.push((async () => { // attach owners to each story
            const { story_id } = project_stories[idx]
            const storyOwners = await StoryRepo.findStoryOwners(story_id)
            project_stories[idx].owners = storyOwners
        })())
    await Promise.all(asyncFuncs)
    res.status(200).json({ total_count, project_stories })
}

export const upsertProjectStory = async (req: Request, res: Response) => {
    const { title, type, points, description, owner_ids } = req.body
    const { projectID, storyID } = req.params
    let story = {}

    if (projectID) // POST --> /projects/:projectID/stories
        story = await StoryRepo.createStory({ title, type, points, description, project: { project_id: projectID } }, owner_ids)
    if (storyID) // PUT --> /stories/:storyID
        story = await StoryRepo.updateStory(storyID, { title, type, points, description })
    res.status(200).json(omit(story, ['created_at', 'project']))
}

export const setStoryStatus = async (req: Request, res: Response) => {
    const { status } = req.body
    const { storyID } = req.params
    await StoryRepo.setStoryStatus(storyID, status)
    res.status(204).json()
}

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
