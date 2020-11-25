import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Story from "../../entity/Story";

const storyRepo = () => getRepository(Story)

export const fetchProjectStories = async (req: Request, res: Response) => {
    const { projectID } = req.params
    res.status(200).json(await storyRepo().find({ where: { project: { project_id: projectID } } }))
}
