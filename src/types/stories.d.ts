import { DeepPartial } from "typeorm";
import Story from "../entity/Story";

export interface CreateStoryFunc {
    (entityLike: DeepPartial<Story>, ownerIDs: Array<string>): Promise<Story>
}
