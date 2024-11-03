import express from 'express'
import { signup, login, logout, verifyEmail, forgotPassword, resetPassword, checkAuth } from '../controllers/authControllers.js'
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router(); 


router.get("/check-auth", verifyToken, checkAuth) //verifyToken middleware -> checkAuth (middleware are func that have access to req, res, and next)

router.post("/signup", signup) 
router.post("/login", login) 
router.post("/logout", logout) 

router.post("/verify-email", verifyEmail)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword) //takes token in url 

export default router 

//Finished signup, login, logout, verifiy-email routes, 1:27:24 checkpoint 