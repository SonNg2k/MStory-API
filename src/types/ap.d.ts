import { DeepPartial } from "typeorm";
import User from "../entity/User";

declare global {
    declare namespace Express {
        export interface Request {
            user: DeepPartial<User>
        }
    }
}

export type JwtPayload = {
    user_id: string
    last_login: Date
}
