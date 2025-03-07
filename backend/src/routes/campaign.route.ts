import express from 'express'
import { createCampaign, getAllCampaign, uploadMiddleware } from '../controller/campaign.controller'
import { authMiddleware } from '../middleware/auth.middleware.'

export const router = express.Router()

router.post('/create-campaign', authMiddleware, uploadMiddleware, createCampaign)
router.get('/campaigns', getAllCampaign)