import faker from 'faker';
import { getRepository } from "typeorm";
import Project from './entity/Project';
import User from "./entity/User";

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

function randomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export default () => {
    //@ts-ignore
    seedUsers(parseInt(process.env.USERS_TO_SEED))
    //@ts-ignore
    seedProjects(parseInt(process.env.PROJECTS_TO_SEED))
}
