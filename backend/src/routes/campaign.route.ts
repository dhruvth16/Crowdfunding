import express from 'express'
import { createCampaign, getAllCampaign } from '../controller/campaign.controller'
import { authMiddleware } from '../middleware/auth.middleware.'
import multer from 'multer'

export const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

router.post('/create-campaign', upload.single("image"), authMiddleware, createCampaign)
router.get('/campaigns', getAllCampaign)