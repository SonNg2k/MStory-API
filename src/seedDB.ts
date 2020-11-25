import faker from 'faker';
import { getRepository } from "typeorm";
import Project from './entity/Project';
import Story from './entity/Story';
import User from "./entity/User";

// 1) Seed users
const userRepo = () => getRepository(User)
const seedUsers = async (totalCount: number) => {
    for (let count = 0; count < totalCount; count++) {
        const newUser = await userRepo().create({
            email: faker.internet.email(),
            fullname: faker.name.findName(),
            username: faker.internet.userName().replace(/[^A-Za-z0-9]/g, '')
        })
        await userRepo().save(newUser)
    }
}

// 2) Seed projects
const projectRepo = () => getRepository(Project)
const seedProjects = async (totalCount: number) => {
    for (let count = 0; count < totalCount; count++) {
        const fakeCreatedAt = randomDate(new Date(2017, 0, 1), new Date())
        const newProject = await projectRepo().create({
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            is_public: Math.random() <= 0.5,
            is_active: Math.random() <= 0.5,
            created_at: fakeCreatedAt,
            updated_at: randomDate(fakeCreatedAt, new Date())
        })
        await projectRepo().save(newProject)
    }
}

// 3) Seed project stories
const storyRepo = () => getRepository(Story)
const types = ['feature', 'bug', 'chore']
const status = ['unstarted', 'started', 'finished', 'delivered', 'rejected', 'done']

const seedStories = async (totalCount: number) => {
    const projects = await projectRepo().find()
    for (let count = 0; count < totalCount; count++) {
        const projectToLink = projects[Math.floor(Math.random() * projects.length)]
        const newStory = await storyRepo().create({
            title: faker.name.title(),
            type: types[Math.floor(Math.random() * types.length)],
            points: faker.random.number(3),
            description: faker.commerce.productDescription(),
            status: status[Math.floor(Math.random() * status.length)],
            project: { project_id: projectToLink.project_id }
        })
        await storyRepo().save(newStory)
    }
}

const randomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export default () => {
    //@ts-ignore
    seedUsers(parseInt(process.env.USERS_TO_SEED))
    //@ts-ignore
    seedProjects(parseInt(process.env.PROJECTS_TO_SEED))
    //@ts-ignore
    seedStories(parseInt(process.env.STORIES_TO_SEED))
}
