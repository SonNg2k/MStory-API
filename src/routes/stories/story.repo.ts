import { DeepPartial, getConnection, getManager, getRepository, ILike } from "typeorm"
import { STORY_STATUS, STORY_TYPES } from "../../constants"
import Story from "../../entity/Story"
import StoryOwner from "../../entity/StoryOwner"
import { findEntityDocByID, buildStoryOwnerList } from "../../helpers"

type getStoriesByProjectIdAndPageFunc = (projectID: string, page: number, keyword?: string, status?: typeof STORY_STATUS[number], type?: typeof STORY_TYPES[number])
    => Promise<{ total_count: number, stories: Story[] }>

export default class StoryRepo {
    static getRepo = () => getRepository(Story)

    static getStoriesByProjectIdAndPage: getStoriesByProjectIdAndPageFunc = async (projectID, page = 1, keyword, status, type) => {
        const skip = (page - 1) * 6
        let whereClause = {}
        whereClause = (keyword) ? { ...whereClause, title: ILike(`%${keyword}%`) } : whereClause
        whereClause = (status) ? { ...whereClause, status } : whereClause
        whereClause = (type) ? { ...whereClause, type } : whereClause
        whereClause = { ...whereClause, project: { project_id: projectID } }

        const [stories, total_count] = await StoryRepo.getRepo().findAndCount({
            select: ['story_id', 'title', 'type', 'points', 'description', 'status', 'updated_at'],
            where: whereClause,
            order: { created_at: 'DESC' },
            skip,
            take: 6,
        })

        // For each story found, we populate the people responsible for it...
        const asyncFuncs = []
        for (const idx in stories)
            asyncFuncs.push((async () => {
                const { story_id } = stories[idx]
                const storyOwners = await StoryRepo.findStoryOwners(story_id)
                stories[idx].owners = storyOwners as any
            })())
        await Promise.all(asyncFuncs)
        return { total_count, stories }
    }
    /**
     * Find everyone responsible for a particular user story
     */
    static findStoryOwners = async (storyID: string): Promise<{ user_id: string, fullname: string, username: string, assigned_at: Date }[]> => {
        const getStoryOwnersQuery = `
        select u.user_id, u.fullname, u.username, so.created_at as assigned_at
        from story_owners so
        inner join users u on so.user_id = u.user_id and so.story_id = $1
        order by so.created_at desc;`
        return await getManager().query(getStoryOwnersQuery, [storyID])
    }
    /**
     * The output is populated with a list of people responsible for the added story
     * (this weird and cumbersome response is requested by FE because he does not know how to reuse data 👎)
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
        storyToInsert.owners = await StoryRepo.findStoryOwners(story_id) as any
        storyToInsert.status = 'unstarted'
        return storyToInsert
    }
    /**
     * This function only updates the story with the given ID. It does NOT update the list of story owners
     * (use addStoryOwner() and removeStoryOwner() in case u want to update this list)
     */
    static findByIdAndUpdate = async (storyID: string, newStoryDoc: DeepPartial<Story>) => {
        const story = await findEntityDocByID(StoryRepo.getRepo(), storyID)
        StoryRepo.getRepo().merge(story, newStoryDoc)
        return await StoryRepo.getRepo().save(story)
    }

    static findByIdAndSetStatus = async (storyID: string, status: typeof STORY_STATUS[number]) => {
        const story = await findEntityDocByID(StoryRepo.getRepo(), storyID)
        StoryRepo.getRepo().merge(story, { status })
        return await StoryRepo.getRepo().save(story)
    }

    /**
     * This function couples a story with a project member.
     * The returned promise is resolved with a list of people responsible for the storyID passed into the function
     * (this weird and cumbersome response is requested by FE because he does not know how to reuse data 👎)
     */
    static addStoryOwner = async (storyID: string, ownerID: string) => {
        await getConnection().createQueryBuilder().insert().into(StoryOwner)
            .values({ story: { story_id: storyID }, owner: { user_id: ownerID } }).execute()
        return await StoryRepo.findStoryOwners(storyID)
    }

    static removeStoryOwner = async (storyID: string, ownerID: string) => {
        return await getConnection().createQueryBuilder().delete().from(StoryOwner)
            .where('story_id = :sid', { sid: storyID }).andWhere('user_id = :uid', { uid: ownerID }).execute()
    }
}
