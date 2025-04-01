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
exports.verifyPayment = exports.createPayment = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const razorpay = new razorpay_1.default({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    try {
        const { amount, currency, campaignId } = req.body;
        const options = {
            amount: amount * 100,
            currency: currency || "INR",
            receipt: `receipt_${campaignId}_${Math.random()}`,
        };
        const order = yield razorpay.orders.create(options);
        if (!order) {
            res.status(500).json({
                message: "Error creating order!"
            });
        }
        yield prisma.payment.create({
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
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
exports.createPayment = createPayment;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { order_id, payment_id, signature, campaignId, amount } = req.body;
        const hmac = crypto_1.default.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
        hmac.update(order_id + "|" + payment_id);
        const expectedSignature = hmac.digest("hex");
        if (expectedSignature !== signature) {
            res.status(400).json({ success: false, message: "Invalid signature" });
            return;
        }
        yield prisma.campaign.update({
            where: { id: campaignId },
            data: {
                raised_amt: {
                    increment: amount,
                },
            },
        });
        const a = yield prisma.campaign.findFirst({
            where: {
                id: campaignId
            }
        });
        if (a) {
            a.status = parseInt(a.target_amt) === a.raised_amt ? "COMPLETED" : "ACTIVE";
        }
        console.log("Updated campaign: ", a);
        res.json({ success: true, message: "Payment verified and campaign updated" });
    }
    catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).json({ success: false, message: "Payment verification failed" });
    }
});
exports.verifyPayment = verifyPayment;
