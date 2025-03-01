import { Request, Response } from "express"
import Razorpay from "razorpay"
import crypto from 'crypto'
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();

export const createOrder = async (req: Request, res: Response) => {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    })
    try {
      const { amount, currency , campaignId } = req.body;

      const options = {
        amount: amount * 100,
        currency: currency || "INR",
        receipt: `receipt_${campaignId}_${Math.random()}`,
      };

      const order = await razorpay.orders.create(options);

      if (!order) {
        res.status(500).json({
          message: "Error creating order!"
        })
      }

      await prisma.payment.create({
        data: {
          campaignId: campaignId.toString(), 
          orderId: order.id,
          amount,
          currency,
          status: "PENDING",
        },
      });
      console.log(order);
      res.json(order);
    } catch (error) {
      res.status(500).send({ error: (error as any).message });
    }
}

export const verifyOrder = async (req: Request, res: Response) => {
  const { order_id, payment_id, signature } = req.body;
  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)

  hmac.update(`${order_id}|${payment_id}`)

  const generatedSignature = hmac.digest("hex")

  if (generatedSignature === signature) {
    res.status(200).json({
      success: true,
      message: "Payment verified!"
    })
    return;
  } else {
    res.status(400).json({
      success: false,
      message: "Payment not verified!"
    })
    return;
  }

}