import express from 'express'
import { createCampaign, getAllCampaign } from '../controller/campaign.controller'
import { authMiddleware } from '../middleware/auth.middleware.'

export const router = express.Router()

router.post('/create-campaign', authMiddleware, createCampaign)
router.get('/campaigns', getAllCampaign)