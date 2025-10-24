"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expertProfile_controller_1 = __importDefault(require("./expertProfile.controller"));
class ExpertRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.expertController = new expertProfile_controller_1.default();
        this.initRoutes();
    }
    initRoutes() { }
}
exports.default = ExpertRouter;
