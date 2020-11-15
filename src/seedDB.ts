import faker from 'faker'
import { getRepository } from "typeorm";
import User from "./entity/User";

const userRepo = () => getRepository(User)

const seedUser = async (totalCount: number) => {
    for (let count = 0; count < totalCount; count++) {
        const newUser = await userRepo().create({
            email: faker.internet.email(),
            fullname: faker.name.findName(),
            username: faker.internet.userName()
        })
        await userRepo().save(newUser)
    }
}

export default () => {
    seedUser(18)
}
