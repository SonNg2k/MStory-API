import faker from 'faker';
import { getConnection, getRepository } from "typeorm";
import { PROJECT_ROLES, STORY_STATUS, STORY_TYPES } from './constants';
import Project from './entity/Project';
import ProjectMember from './entity/ProjectMember';
import Story from './entity/Story';
import StoryOwner from './entity/StoryOwner';
import User from "./entity/User";

// 1) Seed users
const userRepo = () => getRepository(User)
const seedUsers: (totalCount: number) => Promise<User[]> = async (totalCount) => {
    const result: User[] = []
    for (let count = 0; count < totalCount; count++) {
        const newUser = await userRepo().create({
            email: faker.internet.email(),
            fullname: faker.name.findName(),
            username: faker.internet.userName().replace(/[^A-Za-z0-9]/g, '')
        })
        result[count] = await userRepo().save(newUser)
    }
    return result
}

// 2) Seed projects
const projectRepo = () => getRepository(Project)
const seedProjects: (totalCount: number, users: User[]) => Promise<Project[]> = async (totalCount, users) => {
    const result: Project[] = []
    for (let count = 0; count < totalCount; count++) {
        const creatorToLink = users[Math.floor(Math.random() * users.length)]
        const fakeCreatedAt = randomDate(new Date(2017, 0, 1), new Date())
        const newProject = await projectRepo().create({
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            is_public: Math.random() <= 0.5,
            is_active: Math.random() <= 0.5,
            creator: { user_id: creatorToLink.user_id },
            created_at: fakeCreatedAt,
            updated_at: randomDate(fakeCreatedAt, new Date())
        })
        result[count] = await projectRepo().save(newProject)
    }
    return result
}

// 3) Seed project members
const seedMembers: (t: number, p: Project[], u: User[]) => Promise<any[]> = async (totalCount, projects, users) => {
    let result: Array<any> = []
    let insertedRecords: string[] = []

    for (let count = 0; count < totalCount; count++) {
        const projectToLink = projects[Math.floor(Math.random() * projects.length)]
        const userToLink = users[Math.floor(Math.random() * users.length)]
        const project = { project_id: projectToLink.project_id }
        const { project_id } = project
        const member = { user_id: userToLink.user_id }
        const { user_id } = member
        if (!insertedRecords.includes(project_id + user_id)) {
            await getConnection().createQueryBuilder().insert().into(ProjectMember)
                .values({ project, member, role: PROJECT_ROLES[Math.floor(Math.random() * 5)] }).execute()
            insertedRecords = [...insertedRecords, project_id + user_id]
            result = [...result, { ...project, ...member }]
        }
    }
    return result
}

// 4) Seed project stories (need to seed sstory creators)
const storyRepo = () => getRepository(Story)
const seedStories: (totalCount: number, projects: Project[]) => Promise<Story[]> = async (totalCount, projects) => {
    const result: Story[] = []
    for (let count = 0; count < totalCount; count++) {
        const projectToLink = projects[Math.floor(Math.random() * projects.length)]
        const newStory = await storyRepo().create({
            title: faker.name.title(),
            type: STORY_TYPES[Math.floor(Math.random() * STORY_TYPES.length)],
            points: faker.random.number(3),
            description: faker.commerce.productDescription(),
            status: STORY_STATUS[Math.floor(Math.random() * STORY_STATUS.length)],
            project: { project_id: projectToLink.project_id }
        })
        result[count] = await storyRepo().save(newStory)
    }
    return result
}

// 5) Seed story owners
const seedOwners = async (stories: Story[], projectMembers: { project_id: string, user_id: string }[]) => {
    for (const story of stories) {
        for (const member of projectMembers) {
            if (story.project.project_id === member.project_id) // project member and story lives in the same project
                await getConnection().createQueryBuilder().insert().into(StoryOwner)
                    .values({ story: { story_id: story.story_id }, owner: { user_id: member.user_id } }).execute()
        }
    }
}

const randomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export default async () => {
    const users = await seedUsers(parseInt(process.env.USERS_TO_SEED as string))
    const projects = await seedProjects(parseInt(process.env.PROJECTS_TO_SEED as string), users)
    const projectMembers = await seedMembers(parseInt(process.env.PROJECTS_MEMBERS_TO_SEED as string), projects, users)
    const stories = await seedStories(parseInt(process.env.STORIES_TO_SEED as string), projects)
    seedOwners(stories, projectMembers)
}
