import { Request, Response } from "express"
import Razorpay from "razorpay"
import crypto from 'crypto'
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();

export const createPayment = async (req: Request, res: Response) => {
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

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { order_id, payment_id, signature, campaignId, amount } = req.body;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
    hmac.update(order_id + "|" + payment_id);
    const expectedSignature = hmac.digest("hex");

    if (expectedSignature !== signature) {
      res.status(400).json({ success: false, message: "Invalid signature" });
      return
    }

    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        raised_amt: {
          increment: amount, 
        },
      },      
    });

    const a = await prisma.campaign.findFirst({
      where: {
        id: campaignId
      }
    })

    if (a) {
      a.status = parseInt(a.target_amt) === a.raised_amt ? "COMPLETED" : "ACTIVE";
    }
    console.log("Updated campaign: ", a);

    res.json({ success: true, message: "Payment verified and campaign updated" });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }

}