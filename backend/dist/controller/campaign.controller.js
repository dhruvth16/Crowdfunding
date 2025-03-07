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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCampaign = exports.uploadMiddleware = exports.createCampaign = void 0;
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
const zod_1 = require("zod");
const multer_1 = __importDefault(require("multer"));
const prisma = new client_2.PrismaClient();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage });
const createCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.adminId) {
        res.status(401).json({ message: "Unauthorized: Admin ID missing" });
        return;
    }
    const creator_id = parseInt(req.adminId);
    console.log(creator_id);
    const requiredBody = zod_1.z.object({
        name: zod_1.z.string().min(3),
        description: zod_1.z.string().min(10),
        target_amt: zod_1.z.string(),
        category: zod_1.z.nativeEnum(client_1.CategoryType),
        location: zod_1.z.string().optional(),
        status: zod_1.z.nativeEnum(client_1.Status),
        image: zod_1.z.string().optional(),
    });
    const parsedData = requiredBody.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "Invalid request body",
            error: parsedData.error.errors,
        });
        return;
    }
    console.log(req.file);
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const campaignData = Object.assign(Object.assign({}, parsedData.data), { target_amt: parsedData.data.target_amt.toString(), creator_id, location: parsedData.data.location || null, image });
    try {
        const campaign = yield prisma.campaign.create({
            data: campaignData,
        });
        res.status(201).json({ message: "Campaign created successfully", campaign });
        return;
    }
    catch (error) {
        console.error("Error creating campaign:", error);
        res.status(500).json({ message: "Internal server error", error });
        return;
    }
});
exports.createCampaign = createCampaign;
exports.uploadMiddleware = upload.single("image");
const getAllCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaigns = yield prisma.campaign.findMany({
            include: {
                creator: true
            },
            orderBy: {
                start_date: "desc"
            }
        });
        res.json({ campaigns });
    }
    catch (error) {
        console.log("Error getting campaigns: ", error);
        res.status(500).json({
            message: "Internal server error!"
        });
    }
});
exports.getAllCampaign = getAllCampaign;
