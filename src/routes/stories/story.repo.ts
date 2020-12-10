import { getManager } from "typeorm"

export default class StoryRepo {
    static async findOwnersByStoryID(storyID: string): Promise<any[]> {
        const getStoryOwnerQuery = `
        select u.user_id, u.fullname, u.username, so.created_at as assigned_at
        from story_owners so
        inner join users u on so.user_id = u.user_id and so.story_id = $1
        order by so.created_at desc;`
        return await getManager().query(getStoryOwnerQuery, [storyID])
    }
}
