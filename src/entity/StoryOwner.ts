import { CreateDateColumn, Entity, JoinColumn, ManyToOne } from "typeorm";
import Story from "./Story";
import User from "./User";

@Entity('story_owners')
export default class StoryOwner {
    @ManyToOne(type => Story, story => story.owners, { primary: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'story_id' })
    story: Story

    @ManyToOne(type => User, user => user.stories_owned, { primary: true })
    @JoinColumn({ name: 'user_id' })
    owner: User

    @CreateDateColumn({ type: "timestamptz", update: false, select: false })
    created_at: Date;
}
