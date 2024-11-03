import { User } from "../models/User.js"
import bcrypt from 'bcryptjs'
import { generateTokenAndSetCookie } from "../utility/generateTokenAndSetCookie.js"
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js"

export const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body 
        if (!email || !password || !name) {
            throw new Error("All fields are required")
        }
        const userAlreadyExists = await User.findOne({email})
        if (userAlreadyExists) {
            return res.status(400).json({success: false, message: "User already exists"})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const verificationToken = Math.floor(10000 + Math.random()*900000).toString()
        const user = new User({email, password: hashedPassword, name, verificationToken: verificationToken, verificationTokenExpiresAt: Date.now() + 24*60*60*1000})
        await user.save()

        //jwt
        generateTokenAndSetCookie(res, user._id) //will return jwt token 

        await sendVerificationEmail(user.email, verificationToken)
         
        res.status(201).json({success: true, message: "User created successfully", user: {
            ...user._doc, 
            password: undefined 
        }})


    } catch (error) {

    }
}

export const verifyEmail = async (req, res) => {
    const { verificationCode } = req.body //from ui 
    try {
        const user = await User.findOne({
            verificationToken: verificationCode, 
            verificationTokenExpiresAt: { $gt: Date.now() }
        })
        if (!user) {
            return res.status(400).json({success: false, message: "Invalid or expired verification code"})
        }
        user.isVerified=true
        user.verificationToken=undefined
        user.verificationTokenExpiresAt=undefined 
        await user.save() 

        await sendWelcomeEmail(user.email, user.name)

        res.status(200).json({success: true, message: "Email verified succesfully", user: {
            ...user._doc, 
            password: undefined 
        }})


    } catch (error) {
        res.status(500).json({success: false, message: "Server error"})
    }
}

export const login = async (req, res) => {
    res.send("login from controller")
}

export const logout = async (req, res) => {
    res.clearCookie("token")
    res.status(200).json({success: true, message: "Logged out successfully"})
}