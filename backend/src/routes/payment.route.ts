import express, { Request, Response } from 'express'
import { createPayment, verifyPayment } from '../controller/payment.controller'
export const router = express.Router()

router.get('/', (req, res) => {
    res.send("Hii, there")
})

router.post('/create-payment', createPayment)
router.post('/verify-payment', verifyPayment)

