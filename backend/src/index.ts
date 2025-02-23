require('dotenv').config()
import express from 'express'
import cors from 'cors'
const app = express();
import { router as userRouter} from './routes/user.route';
import { router as adminRouter} from './routes/admin.route';
import { router as campaignRouter} from './routes/campaign.route';

app.use(express.json())
app.use(cors())

app.use('/api/v1/user', userRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/campaign', campaignRouter)

app.listen(process.env.PORT || 5000, () => {
    console.log(`App is running on port ${process.env.PORT}`)
})