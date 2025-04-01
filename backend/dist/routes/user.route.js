"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware.");
exports.router = express_1.default.Router();
exports.router.get('/', (req, res) => {
    res.send("Hii, there");
});
exports.router.post('/signup', user_controller_1.userSignup);
exports.router.post('/signin', user_controller_1.userSignin);
exports.router.post('/logout', auth_middleware_1.authMiddleware, user_controller_1.userLogout);
