require('dotenv').config()
import express from 'express'
import cors from 'cors'
const app = express();
import { router as userRouter} from './routes/user.route';
import { router as adminRouter} from './routes/admin.route';
import { router as campaignRouter} from './routes/campaign.route';
import { router as paymentRouter } from './routes/payment.route'
import path from 'path'

app.use(express.json())
app.use(cors({
    origin: ['https://crowdfunding-dz5hezds2-dhruvth16s-projects.vercel.app/', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))
app.use("/uploads", express.static("uploads"));

app.use('/api/v1/user', userRouter)
app.use('/api/v1/campaign', campaignRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/payment', paymentRouter)

app.listen(process.env.PORT || 5000, () => {
    console.log(`App is running on port ${process.env.PORT}`)
})