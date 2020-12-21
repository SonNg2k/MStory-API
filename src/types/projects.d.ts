import { PROJECT_ROLES, SORT_ORDER } from "../constants";
import Project from "../entity/Project";

export interface FindProjectsOptions {
    page: number,
    is_active: boolean,
    view: 'updated_at' | 'created_at',
    order: typeof SORT_ORDER[number],
    keyword?: string,
    /** Find projects that this user created and is the member of (get all projects in the DB if unspecified) */
    user_id?: string,
}

export interface FindProjectsFunc {
    (options: FindProjectsOptions): Promise<{ total_count: number, projects: Project[] }>
}

export interface FindMembersOptions {
    projectID: string,
    page: number,
    keyword?: string,
    role?: typeof PROJECT_ROLES[number]
}

export interface FindMembersFunc {
    (options: FindMembersOptions): Promise<{ total_count: number, members: Array<Object> }>
}
