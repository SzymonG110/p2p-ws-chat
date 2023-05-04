import {Request, Response, NextFunction} from 'express'
import {IndexWebSocket} from '../websocket/Index.WebSocket'

export default interface Route {
    path: string
    disabled: boolean
    methods: Method[]
}

export interface MethodArgs {
    req: Request
    res: Response
    next: NextFunction
    wss: IndexWebSocket
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