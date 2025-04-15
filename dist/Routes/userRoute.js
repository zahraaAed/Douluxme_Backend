"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/Routes/userRoute.ts
const express_1 = __importDefault(require("express"));
const userController_js_1 = require("../Controllers/userController.js");
// Create an Express router instance
const router = express_1.default.Router();
// Use proper types for each route handler
router.post('/register', userController_js_1.register);
router.post('/login', userController_js_1.login);
router.post('/logout', userController_js_1.logout);
exports.default = router;
