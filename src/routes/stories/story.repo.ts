import { DeepPartial, getConnection, getManager, getRepository, ILike } from "typeorm"
import { STORY_STATUS, STORY_TYPES } from "../../constants"
import Story from "../../entity/Story"
import StoryOwner from "../../entity/StoryOwner"
import { findEntityDocByID, buildStoryOwnerList } from "../../helpers"


type FindProjectStoryFunc = (projectID: string, skip: number, keyword?: string, status?: typeof STORY_STATUS[number], type?: typeof STORY_TYPES[number])
    => Promise<[Story[], number]>

export default class StoryRepo {
    private static getRepo = () => getRepository(Story)

    static findProjectStories: FindProjectStoryFunc = async (projectID, skip = 0, keyword, status, type) => {
        let whereClause = {}
        whereClause = (keyword) ? { ...whereClause, title: ILike(`%${keyword}%`) } : whereClause
        whereClause = (status) ? { ...whereClause, status } : whereClause
        whereClause = (type) ? { ...whereClause, type } : whereClause
        whereClause = { ...whereClause, project: { project_id: projectID } }

        return await StoryRepo.getRepo().findAndCount({
            select: ['story_id', 'title', 'type', 'points', 'description', 'status', 'updated_at'],
            where: whereClause,
            order: { created_at: 'DESC' },
            skip,
            take: 6,
        })
    }

    static findStoryOwners = async (storyID: string): Promise<any[]> => {
        const getStoryOwnersQuery = `
        select u.user_id, u.fullname, u.username, so.created_at as assigned_at
        from story_owners so
        inner join users u on so.user_id = u.user_id and so.story_id = $1
        order by so.created_at desc;`
        return await getManager().query(getStoryOwnersQuery, [storyID])
    }
    /**
     *
     * @param newStoryDoc: A new story doc that u want to add to DB (the list of story owner's ids is excluded from this doc)
     * @param owner_ids: A list of story owner's ids to link to the newStoryDoc
     */
    static createStory = async (newStoryDoc: DeepPartial<Story>, owner_ids: string[] = []) => {
        const storyToInsert = Object.assign(new Story(), newStoryDoc)
        const result = await getConnection().createQueryBuilder().insert().into(Story).values(storyToInsert).execute()
        const { story_id } = result.identifiers[0]
        // Link the userIDs to the added story...
        if (owner_ids.length > 0) await getConnection().createQueryBuilder().insert().into(StoryOwner)
            .values(buildStoryOwnerList(story_id, owner_ids)).execute()
        storyToInsert.owners = await StoryRepo.findStoryOwners(story_id)
        storyToInsert.status = 'unstarted'
        return storyToInsert
    }

    static updateStory = async (storyID: string, newStoryDoc: DeepPartial<Story>) => {
        const story = await findEntityDocByID(StoryRepo.getRepo(), storyID)
        StoryRepo.getRepo().merge(story, newStoryDoc)
        return await StoryRepo.getRepo().save(story)
    }

    static setStoryStatus = async (storyID: string, status: typeof STORY_STATUS[number]) => {
        const story = await findEntityDocByID(StoryRepo.getRepo(), storyID)
        StoryRepo.getRepo().merge(story, { status })
        return await StoryRepo.getRepo().save(story)
    }

    static addStoryOwner = async (storyID: string, ownerID: string) => {
        await getConnection().createQueryBuilder().insert().into(StoryOwner)
            .values({ story: { story_id: storyID }, owner: { user_id: ownerID } }).execute()
    }

    static removeStoryOwner = async (storyID: string, ownerID: string) => {
        await getConnection().createQueryBuilder().delete().from(StoryOwner)
            .where('story_id = :sid', { sid: storyID }).andWhere('user_id = :uid', { uid: ownerID }).execute()
    }
}
