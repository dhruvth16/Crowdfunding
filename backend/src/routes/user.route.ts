import express, { Request, Response } from 'express'
import { userLogout, userSignin, userSignup } from '../controller/user.controller'
import { authMiddleware } from '../middleware/auth.middleware.'
export const router = express.Router()

router.get('/', (req, res) => {
    res.send("Hii, there")
})

router.post('/signup', userSignup)
router.post('/signin', userSignin)
router.post('/logout', authMiddleware, userLogout)


