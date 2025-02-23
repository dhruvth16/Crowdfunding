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
exports.removeCampaign = exports.editCampaign = exports.getCampaign = exports.adminSignin = exports.adminSignup = exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredBody = zod_1.z.object({
        email: zod_1.z.string().min(3).max(100).email(),
        password: zod_1.z
            .string()
            .min(8)
            .max(100)
            .refine((password) => /[A-Z]/.test(password), {
            message: "uppercaseErrorMessage",
        })
            .refine((password) => /[a-z]/.test(password), {
            message: "lowercaseErrorMessage",
        })
            .refine((password) => /[0-9]/.test(password), {
            message: "numberErrorMessage",
        })
            .refine((password) => /[!@#$%^&*]/.test(password), {
            message: "specialCharacterErrorMessage",
        }),
        firstname: zod_1.z.string().min(3).max(100),
        lastname: zod_1.z.string().min(3).max(100),
        address: zod_1.z.string().min(3).max(200),
        phone_num: zod_1.z.number()
    });
    const safeParsedData = requiredBody.safeParse(req.body);
    if (!safeParsedData.success) {
        res.status(401).json({
            message: "Incorrect credentials!",
            error: safeParsedData.error,
        });
        return;
    }
    const { email, password, firstname, lastname, address, phone_num } = req.body;
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    try {
        const existingUser = yield exports.prisma.admin.findFirst({
            where: {
                email: email
            }
        });
        if (existingUser) {
            res.status(409).json({
                message: "User already exists!"
            });
            return;
        }
        const admin = yield exports.prisma.admin.create({
            data: {
                email,
                password: hashedPassword,
                firstname,
                lastname,
                address,
                phone_num
            }
        });
        res.status(201).json({
            admin
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error!"
        });
        console.log(error);
    }
});
exports.adminSignup = adminSignup;
const adminSignin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredBody = zod_1.z.object({
        email: zod_1.z.string().min(3).max(100).email(),
        password: zod_1.z
            .string()
            .min(8)
            .max(100)
            .refine((password) => /[A-Z]/.test(password), {
            message: "uppercaseErrorMessage",
        })
            .refine((password) => /[a-z]/.test(password), {
            message: "lowercaseErrorMessage",
        })
            .refine((password) => /[0-9]/.test(password), {
            message: "numberErrorMessage",
        })
            .refine((password) => /[!@#$%^&*]/.test(password), {
            message: "specialCharacterErrorMessage",
        }),
    });
    const safeParsedData = requiredBody.safeParse(req.body);
    if (!safeParsedData.success) {
        res.status(401).json({
            message: "Incorrect credentials!",
            error: safeParsedData.error,
        });
        return;
    }
    const { email, password } = req.body;
    try {
        const existingUser = yield exports.prisma.admin.findFirst({
            where: {
                email: email
            }
        });
        if (!existingUser) {
            res.status(404).json({
                message: "User not found!"
            });
            return;
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            res.status(401).json({
                message: "Incorrect password!",
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            id: existingUser.id
        }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });
        res.status(200).json({
            message: "User signed in successfully!",
            token
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error!"
        });
    }
});
exports.adminSignin = adminSignin;
const getCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.creator_id) {
        res.status(401).json({ message: "Unauthorized: Admin ID missing" });
        return;
    }
    const creator_id = parseInt(req.creator_id);
    try {
        const campaign = yield exports.prisma.campaign.findMany({
            where: {
                creator_id: creator_id
            }
        });
        console.log(campaign);
        res.json({
            campaign
        });
    }
    catch (error) {
        console.error("Error getting campaign:", error);
        res.status(500).json({ message: "Internal server error", error });
        return;
    }
});
exports.getCampaign = getCampaign;
const editCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.creator_id) {
        res.status(401).json({ message: "Unauthorized: Admin ID missing" });
        return;
    }
    const creator_id = parseInt(req.creator_id);
    const { id } = req.params;
    const campaignId = parseInt(id);
    const campaignSchema = zod_1.z.object({
        name: zod_1.z.string().min(3).optional(),
        description: zod_1.z.string().min(10).optional(),
        target_amt: zod_1.z.number().optional(),
        raised_amt: zod_1.z.number().optional(),
        category: zod_1.z.nativeEnum(client_1.CategoryType).optional(),
        location: zod_1.z.string().optional(),
        status: zod_1.z.nativeEnum(client_1.Status).optional(),
    });
    const parsedData = campaignSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "Invalid request body",
            error: parsedData.error.errors,
        });
        return;
    }
    try {
        const existingCampaign = yield exports.prisma.campaign.findUnique({
            where: { id: campaignId },
        });
        if (!existingCampaign) {
            res.status(404).json({ message: "Campaign not found" });
            return;
        }
        if (existingCampaign.creator_id !== creator_id) {
            res.status(403).json({ message: "Forbidden: You do not own this campaign" });
            return;
        }
        const updatedCampaign = yield exports.prisma.campaign.update({
            where: { id: campaignId },
            data: Object.assign({}, parsedData.data),
        });
        res.json({
            message: "Campaign updated successfully",
            campaign: updatedCampaign,
        });
    }
    catch (error) {
        console.error("Error updating campaign:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.editCampaign = editCampaign;
const removeCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.creator_id) {
        res.status(401).json({
            message: "Unauthorized: Admin is missing"
        });
        return;
    }
    const creator_id = parseInt(req.creator_id);
    const { id } = req.params;
    const campaignId = parseInt(id);
    try {
        const existingCampaign = yield exports.prisma.campaign.findUnique({
            where: {
                id: campaignId
            }
        });
        if (!existingCampaign) {
            res.status(404).json({
                message: "Camapaign not found!"
            });
            return;
        }
        if (existingCampaign.creator_id !== creator_id) {
            res.status(403).json({ message: "Forbidden: You do not own this campaign" });
            return;
        }
        yield exports.prisma.campaign.delete({
            where: {
                id: campaignId
            }
        });
        res.status(200).json({
            message: "Campaign removed successfully!"
        });
    }
    catch (error) {
        console.log("Error removing the campaign: ", error);
        res.status(500).json({
            message: "Internal server error!"
        });
    }
});
exports.removeCampaign = removeCampaign;
