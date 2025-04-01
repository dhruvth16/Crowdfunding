"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controller/admin.controller");
const auth_middleware_1 = require("../middleware/auth.middleware.");
exports.router = express_1.default.Router();
exports.router.get('/', (req, res) => {
    res.send("Hii, there");
});
exports.router.post('/signup', admin_controller_1.adminSignup);
exports.router.post('/signin', admin_controller_1.adminSignin);
exports.router.get('/get-campaign', auth_middleware_1.authMiddleware, admin_controller_1.getCampaign);
exports.router.put('/edit-campaign/:id', auth_middleware_1.authMiddleware, admin_controller_1.editCampaign);
exports.router.delete('/remove-campaign/:id', auth_middleware_1.authMiddleware, admin_controller_1.removeCampaign);
exports.router.get('/campaign/:id', auth_middleware_1.authMiddleware, admin_controller_1.getSpecificCampaign);
exports.router.post('/logout', auth_middleware_1.authMiddleware, admin_controller_1.adminLogout);
