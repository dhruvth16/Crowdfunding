"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const campaign_controller_1 = require("../controller/campaign.controller");
const auth_middleware_1 = require("../middleware/auth.middleware.");
exports.router = express_1.default.Router();
exports.router.post('/create-campaign', auth_middleware_1.authMiddleware, campaign_controller_1.uploadMiddleware, campaign_controller_1.createCampaign);
exports.router.get('/campaigns', campaign_controller_1.getAllCampaign);
