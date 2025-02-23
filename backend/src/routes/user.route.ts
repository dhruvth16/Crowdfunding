import express, { Request, Response } from 'express'
import { userSignin, userSignup } from '../controller/user.controller'
export const router = express.Router()

router.get('/', (req, res) => {
    res.send("Hii, there")
})

router.post('/signup', userSignup)
router.post('/signin', userSignin)


