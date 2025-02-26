import { Response, Request } from "express";
import { CustomRequest } from "../middleware/auth.middleware.";
import { CategoryType, Status } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { z } from 'zod'
const prisma = new PrismaClient();

export const createCampaign = async (req: CustomRequest, res: Response): Promise<void> => {
    if (!req.creator_id) {
        res.status(401).json({ message: "Unauthorized: Admin ID missing" });
        return
    }

    const creator_id = parseInt(req.creator_id); 
    console.log(creator_id)

    const requiredBody = z.object({
        name: z.string().min(3),
        description: z.string().min(10),
        target_amt: z.number(),
        raised_amt: z.number(),
        category: z.nativeEnum(CategoryType),
        location: z.string().optional(),
        status: z.nativeEnum(Status),
    });

    const parsedData = requiredBody.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "Invalid request body",
            error: parsedData.error.errors,
        });
        return
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const campaignData = {
        ...parsedData.data,
        creator_id, 
        location: parsedData.data.location || null, 
        image
    };
    console.log(campaignData)

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

export const getAllCampaign = async (req: Request, res: Response): Promise<void> => {
    try {
        const campaigns = await prisma.campaign.findMany({
            include: {
                creator: true
            }
        })
    
        console.log(campaigns)
        res.json({ campaigns })
    } catch (error) {
        console.log("Error getting campaigns: ", error)
        res.status(500).json({
            message: "Internal server error!"
        })
    }
}
