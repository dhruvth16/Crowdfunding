import { CategoryType, PrismaClient, Status } from "@prisma/client";
export const prisma = new PrismaClient();
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express';
import jwt  from 'jsonwebtoken'
import { CustomRequest } from "../middleware/auth.middleware.";

export const adminSignup = async (req: Request, res: Response): Promise<void> => {
    const requiredBody = z.object({
    email: z.string().min(3).max(100).email(),
    password: z
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
      firstname: z.string().min(3).max(100),
      lastname: z.string().min(3).max(100),
      address: z.string().min(3).max(200),
      phone_num: z.string().max(12)
  });

  const safeParsedData = requiredBody.safeParse(req.body)
  if (!safeParsedData.success) {
    res.status(401).json({
      message: "Incorrect credentials!",
      error: safeParsedData.error,
    });
    return;
  }

  const { email, password, firstname, lastname, address, phone_num } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  
  try {
    const existingUser = await prisma.admin.findFirst({
        where: {
            email: email
        }
    });
    if (existingUser) {
        res.status(409).json({
            message: "User already exists!"
        })    
        return
    }
    const admin = await prisma.admin.create({
        data: {
            email,
            password: hashedPassword,
            firstname,
            lastname,
            address,
            phone_num
        }
    })

    res.status(201).json({
        admin
    })

  } catch (error) {
    res.status(500).json({
        message: "Internal server error!"
    })
    console.log(error)
  }

}

export const adminSignin = async (req: Request, res: Response): Promise<void> => {
    const requiredBody = z.object({
    email: z.string().min(3).max(100).email(),
    password: z
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
    })

    const safeParsedData = requiredBody.safeParse(req.body)
    if (!safeParsedData.success) {
        res.status(401).json({
        message: "Incorrect credentials!",
        error: safeParsedData.error,
        });
        return;
    }

    const { email, password } = req.body

    try {
        const existingUser = await prisma.admin.findFirst({
            where: {
                email: email
            }
        })

        if (!existingUser) {
            res.status(404).json({
                message: "User not found!"
            })
            return
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            res.status(401).json({
                message: "Incorrect password!",
            });
            return;
        }

        const token = jwt.sign(
            {
                id: existingUser.id
            }, 
            process.env.JWT_SECRET as string,
            {
                expiresIn: "1h"
            }
        )

        res.status(200).json({
            message: "User signed in successfully!",
            token
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error!"
        })
    }
}

export const getCampaign = async (req: CustomRequest, res: Response): Promise<void> => {
    if (!req.creator_id) {
      res.status(401).json({ message: "Unauthorized: Admin ID missing" });
      return
    }
    const creator_id = parseInt(req.creator_id); 

    try {
      const campaign = await prisma.campaign.findMany({
        where: {
            creator_id: creator_id
        }
      })
      console.log(campaign)
      res.json({
        campaign
      })
    } catch (error) {
        console.error("Error getting campaign:", error);
        res.status(500).json({ message: "Internal server error", error });
        return
    }
}

export const editCampaign = async (req: CustomRequest, res: Response): Promise<void> => {
    if (!req.creator_id) {
        res.status(401).json({ message: "Unauthorized: Admin ID missing" });
        return;
    }
    
    const creator_id = parseInt(req.creator_id); 
    const { id } = req.params;
    const campaignId = parseInt(id); 

    const campaignSchema = z.object({
        name: z.string().min(3).optional(),
        description: z.string().min(10).optional(),
        target_amt: z.number().optional(),
        raised_amt: z.number().optional(),
        category: z.nativeEnum(CategoryType).optional(),
        location: z.string().optional(),
        status: z.nativeEnum(Status).optional(),
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
        const existingCampaign = await prisma.campaign.findUnique({
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

        const updatedCampaign = await prisma.campaign.update({
            where: { id: campaignId },
            data: { ...parsedData.data }, 
        });

        res.json({
            message: "Campaign updated successfully",
            campaign: updatedCampaign,
        });
    } catch (error) {
        console.error("Error updating campaign:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const removeCampaign = async (req: CustomRequest, res: Response): Promise<void> => {
  if (!req.creator_id) {
    res.status(401).json({
      message: "Unauthorized: Admin is missing"
    })
    return;
  }

  const creator_id = parseInt(req.creator_id)
  const { id } = req.params
  const campaignId = parseInt(id)

  try {
    const existingCampaign = await prisma.campaign.findUnique({
      where: {
        id: campaignId
      }
    })
    if (!existingCampaign) {
      res.status(404).json({
        message: "Camapaign not found!"
      })
      return
    }
    if (existingCampaign.creator_id !== creator_id) {
      res.status(403).json({ message: "Forbidden: You do not own this campaign" });
      return;
    }

    await prisma.campaign.delete({
      where: {
        id: campaignId
      }
    })

    res.status(200).json({
      message: "Campaign removed successfully!"
    })

  } catch (error) {
    console.log("Error removing the campaign: ", error)
    res.status(500).json({
      message: "Internal server error!"
    })
  }

}
