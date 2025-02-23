import express, { Request, Response } from 'express'
import { adminSignin, adminSignup, editCampaign, getCampaign, removeCampaign } from '../controller/admin.controller'
import { authMiddleware } from '../middleware/auth.middleware.'
export const router = express.Router()

router.get('/', (req, res) => {
    res.send("Hii, there")
})

router.post('/signup', adminSignup)
router.post('/signin', adminSignin)
router.get('/get-campaign', authMiddleware, getCampaign)
router.put('/edit-campaign/:id', authMiddleware, editCampaign)
router.delete('/remove-campaign/:id', authMiddleware, removeCampaign)


