import { Response, Request } from "express";
import { CustomRequest } from "../middleware/auth.middleware.";
import { CategoryType, Status } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { z } from 'zod'
import multer from "multer";
import path from "path";
const prisma = new PrismaClient();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

export const createCampaign = async (req: CustomRequest, res: Response): Promise<void> => {
    if (!req.adminId) {
        res.status(401).json({ message: "Unauthorized: Admin ID missing" });
        return
    }
    const creator_id = parseInt(req.adminId); 
    console.log(creator_id)

    const requiredBody = z.object({
        name: z.string().min(3),
        description: z.string().min(10),
        target_amt: z.string(),
        category: z.nativeEnum(CategoryType),
        location: z.string().optional(),
        status: z.nativeEnum(Status),
        image: z.string().optional(),
    });

    const parsedData = requiredBody.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "Invalid request body",
            error: parsedData.error.errors,
        });
        return
    }
    console.log(req.file)
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const campaignData = {
        ...parsedData.data,
        target_amt: parsedData.data.target_amt.toString(),
        creator_id, 
        location: parsedData.data.location || null, 
        image
    };

    try {
        const campaign = await prisma.campaign.create({
            data: campaignData, 
        });

        res.status(201).json({ message: "Campaign created successfully", campaign });
        return
    } catch (error) {
        console.error("Error creating campaign:", error);
        res.status(500).json({ message: "Internal server error", error });
        return
    }
};

export const uploadMiddleware = upload.single("image");

export const getAllCampaign = async (req: Request, res: Response): Promise<void> => {
    try {
        const campaigns = await prisma.campaign.findMany({
            include: {
                creator: true
            },
            orderBy: {
                start_date: "desc"
            }
        })
    
        res.json({ campaigns })
    } catch (error) {
        console.log("Error getting campaigns: ", error)
        res.status(500).json({
            message: "Internal server error!"
        })
    }
}

