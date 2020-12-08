import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import Joi from "joi";
import { EntityTarget, getRepository, Repository } from "typeorm";

export const asyncHandler = (asyncFn: RequestHandler) =>
    (req: Request, res: Response, next: NextFunction) => Promise.resolve(asyncFn(req, res, next)).catch(next)

export const checkID = (urlParamDocID: 'projectID' | 'storyID' | 'userID' | 'ownerID') =>
    (req: Request, res: Response, next: NextFunction) => {
        const { error } = Joi.string().length(26).required().validate(req.params[urlParamDocID])
        if (error) return next(error)
        next()
    }

export const removeArrayItem = (arr: Array<any>, index: number) => {
    const clone = [...arr]
    clone.splice(index, 1)
    return clone
}

export const storyOwnerList = (storyID: string, ownerIDs: string[]): Object[] => {
    const result: Object[] = []
    for (const idx in ownerIDs) {
        result[idx] = { story: { story_id: storyID }, owner: { user_id: ownerIDs[idx] } }
    }
    return result
}

// Generic controller to delete the Entity document
export const deleteEntityDoc = <Entity>(entityClass: EntityTarget<Entity>, urlParamDocID: 'projectID' | 'storyID' | 'userID' | 'ownerID') =>
    async (req: Request, res: Response) => {
        const entityRepo = getRepository(entityClass)
        const foundDoc = await findEntityDocByID(entityRepo, req.params[urlParamDocID])
        await entityRepo.remove(foundDoc)
        res.status(200).json({ message: "Document has been deleted successfully" })
    }

// Find a doc within a particular repo
export const findEntityDocByID = async <Entity>(entityRepo: Repository<Entity>, docID: string) => {
    const doc = await entityRepo.findOne(docID)
    if (!doc) return Promise.reject(new createHttpError.NotFound("The record does not exist"))
    return doc
}

// email dropped here is already validated by middleware
export const constructUserFromEmail = (email: string): Object => {
    let fullname = email.substring(0, email.indexOf('@')) // extract everything before '@' in the email
    fullname = fullname.replace(/[^A-Za-z]/g, '') // remove everything except letters
    let username = email.replace(/[^A-Za-z0-9]/g, '') // remove non-alphanumeric chars
    username = username.substring(0, Math.min(39, username.length))
    return { fullname, username, email }
}

export const omit = (obj: Object, keys: string[]) =>
    transform(obj, (_value, key) => !keys.includes(key))

export const pick = (obj: Object, keys: string[]) =>
    transform(obj, (_value, key) => keys.includes(key))

const transform = (obj: Object, predicate: (value: any, key: string) => boolean) => {
    return Object.keys(obj).reduce((memo: Object, key: string) => {
        // @ts-ignore
        if (predicate(obj[key], key)) memo[key] = obj[key]
        return memo
    }, {})
}
