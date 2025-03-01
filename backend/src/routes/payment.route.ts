import express, { Request, Response } from 'express'
import { createOrder, verifyOrder } from '../controller/payment.controller'
export const router = express.Router()

router.get('/', (req, res) => {
    res.send("Hii, there")
})

router.post('/create-payment', createOrder)
router.post('/verify-payment', verifyOrder)

