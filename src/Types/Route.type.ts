import {NextFunction, Request, Response} from 'express'

export default interface Route {
    name: string
    disabled: boolean
    methods: Method[]
}

export interface MethodArgs {
    req: Request
    res: Response
    next: NextFunction
}

export interface MethodReturn {
    error?: {
        code: number
        message: string
        data: object
    }

    success?: {
        message?: string,
        data: object
    }

    redirect?: string

    render?: {
        name: string
        data?: any
    }
}

export interface Method {
    method: 'get' | 'post'
    description: string
    params: object
    moderator: boolean

    run(args: MethodArgs): Promise<MethodReturn>
}