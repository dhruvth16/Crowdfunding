import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express';
import jwt  from 'jsonwebtoken'

export const userSignup = async (req: Request, res: Response): Promise<void> => {
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
    const existingUser = await prisma.user.findFirst({
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
    const user = await prisma.user.create({
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
        user
    })

  } catch (error) {
    res.status(500).json({
        message: "Internal server error!"
    })
    console.log(error)
  }

}

export const userSignin = async (req: Request, res: Response): Promise<void> => {
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
        const existingUser = await prisma.user.findFirst({
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

async function createToken(token: string) {
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 30);

  const newToken = await prisma.expireToken.create({
    data: {
      token: token,
      expireAt: expirationTime,
    },
  });

  console.log(newToken);
}

async function logout(token: string) {
  
  try {
    const existingToken = await prisma.expireToken.findFirst({
      where: {
        token: token,
      },
    });

    if (!existingToken) {
      throw new Error('Token not found or already invalid');
    }

    const updatedToken = await prisma.expireToken.update({
      where: {
        id: existingToken.id,
      },
      data: {
        expireAt: new Date(),
      },
    });

    console.log('Token invalidated successfully:', updatedToken);
    return { success: true, message: 'Logged out successfully' };
  } catch (error: any) {
    console.error('Logout error:', error.message);
    throw new Error('Logout failed: ' + error.message);
  }
}

export const userLogout = async (req: Request, res: Response) => {
  const token = req.headers['authorization']?.split(' ')[1]; 

  if (!token) {
    res.status(400).json({ error: 'No token provided' });
    return
  }

  try {
    await createToken(token)
    const result = await logout(token);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
