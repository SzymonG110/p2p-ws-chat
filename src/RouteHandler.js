"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const express_1 = require("express");
class RouteHandler {
    constructor(app) {
        this.app = app;
        this.table = [];
        this.handle();
    }
    handle() {
        (0, fs_1.readdirSync)(`${__dirname}/Routes`).forEach((routePath) => {
            const router = (0, express_1.Router)();
            if (routePath.endsWith('.js')) {
                const route = require(`${__dirname}/Routes/${routePath}`).default;
                route.methods.forEach((method) => {
                    this.setupRoute(router, route.name, route, method);
                });
            }
            else {
                (0, fs_1.readdirSync)(`${__dirname}/Routes/${routePath}`).forEach((routePath2) => {
                    const route = require(`${__dirname}/Routes/${routePath}/${routePath2}`).default;
                    route.methods.forEach((method) => {
                        this.setupRoute(router, `${routePath}/${routePath2}`.replace(new RegExp('.route.js', 'gmi'), ''), route, method);
                    });
                });
            }
            this.app.use(router);
        });
        console.table(this.table);
    }
    setupRoute(router, routePath, route, method) {
        this.table.push({
            route: routePath,
            name: route.name,
            method: method.method,
            description: method.description
        });
        router[method.method](routePath, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield method.run({ req, res, next });
            if (result.error)
                return res.status(result.error.code).json(result.error);
            else if (result.success)
                return res.status(200).json(result.success);
            else if (result.redirect)
                return res.redirect(result.redirect);
            else if (result.render)
                return res.render(result.render.name, result.render.data);
            else
                return res.status(500).json({
                    error: {
                        code: 500,
                        message: 'Internal server error'
                    }
                });
        }));
    }
}
exports.default = RouteHandler;
