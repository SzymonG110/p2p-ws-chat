import Route, {Method, MethodReturn} from 'Types/Route.type'
import {readdirSync} from 'fs'
import {Express, NextFunction, Request, Response, Router} from 'express'
import wss from './WebSocket/Index.WebSocket'

export default class RouteHandler {
    table: (Omit<Route, 'run' | 'methods' | 'disabled'> & {
        route: string
        method: string
        description: string
    })[] = []

    constructor(private app: Express) {
        this.handle()
    }

    public handle(): void {
        readdirSync(`${__dirname}/Routes`).forEach((routePath) => {
            const router: Router = Router()

            if (routePath.endsWith('.js')) {
                const route: Route = require(`${__dirname}/Routes/${routePath}`).default

                route.methods.forEach((method: Method) => {
                    this.setupRoute(router, route.name, route, method)
                })
            } else {
                readdirSync(`${__dirname}/Routes/${routePath}`).forEach((routePath2) => {
                    const route: Route = require(`${__dirname}/Routes/${routePath}/${routePath2}`).default

                    route.methods.forEach((method: Method) => {
                        this.setupRoute(router, `${routePath}/${routePath2}`.replace(new RegExp('.route.js', 'gmi'), ''), route, method)
                    })
                })
            }

            this.app.use(router)
        })

        console.table(this.table)
    }

    public setupRoute(router: Router, routePath: string, route: Route, method: Method): void {
        this.table.push({
            route: routePath,
            name: route.name,
            method: method.method,
            description: method.description
        })

        router[method.method](routePath, async (req: Request, res: Response, next: NextFunction) => {
            const result: MethodReturn = await method.run({req, res, next, wss})

            if (result.error)
                return res.status(result.error.code).json(result.error)

            else if (result.success)
                return res.status(200).json(result.success)

            else if (result.redirect)
                return res.redirect(result.redirect)

            else if (result.render)
                return res.render(result.render.name, result.render.data)

            else
                return res.status(500).json({
                    error: {
                        code: 500,
                        message: 'Internal server error'
                    }
                })
        })
    }
}