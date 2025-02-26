"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const campaign_controller_1 = require("../controller/campaign.controller");
const auth_middleware_1 = require("../middleware/auth.middleware.");
const multer_1 = __importDefault(require("multer"));
exports.router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = (0, multer_1.default)({ storage });
exports.router.post('/create-campaign', upload.single("image"), auth_middleware_1.authMiddleware, campaign_controller_1.createCampaign);
exports.router.get('/campaigns', campaign_controller_1.getAllCampaign);
