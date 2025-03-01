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
app.use(cors())
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api/v1/user', userRouter)
app.use('/api/v1/campaign', campaignRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/payment', paymentRouter)

app.listen(process.env.PORT || 5000, () => {
    console.log(`App is running on port ${process.env.PORT}`)
})