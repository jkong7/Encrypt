import { User } from "../models/User.js"
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { generateTokenAndSetCookie } from "../utility/generateTokenAndSetCookie.js"
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from "../mailtrap/emails.js"

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
    const { email, password } = req.body
    try {
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({success: false, message: "Invalid credentials"})
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({success: false, message: "Invalid credentials"})
        }
        generateTokenAndSetCookie(res, user._id)
        user.lastLogin = new Date()
        await user.save() 

        res.status(200).json({success: true, message: "Logged in successfully", user: {
            ...user._doc, 
            password: undefined
        }})
    } catch (error) {
        res.status(400).json({success: false, message: error.message})
    }
    
}

export const logout = async (req, res) => {
    res.clearCookie("token")
    res.status(200).json({success: true, message: "Logged out successfully"})
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({success: false, message: "Invalid email"})
        }
        //password tokens
        const resetPasswordToken = crypto.randomBytes(20).toString('hex')
        const resetPasswordExpiresAt = Date.now()+1*60*60*1000
        user.resetPasswordToken = resetPasswordToken
        user.resetPasswordExpiresAt = resetPasswordExpiresAt
        await user.save() 

        // now send email (email, and token url)
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`)

        res.status(200).json({success: true, message: "Password reset link sent to your email"})
    
    } catch (error) {
        res.status(400).json({success: false, message: error.message})
    }
}

export const resetPassword = async (req, res) => {
    const { password } = req.body
    const resetPasswordToken = req.params.token
    try {
        const user = await User.findOne({
            resetPasswordToken: resetPasswordToken, 
            resetPasswordExpiresAt: { $gt: Date.now()}
        })
        if (!user) {
            return res.status(200).json({success: false, message: "Invalid or expired reset token"})
        }

        user.resetPasswordToken=undefined 
        user.resetPasswordExpiresAt = undefined
        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword
        await user.save() 

        await sendResetSuccessEmail(user.email)

        res.status(200).json({success: true, message: "Password reset successful"})

    } catch (error) {
        res.status(400).json({success: false, message: error.message})
    }
}

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password") //rem this has access to req.userId from jwt verify payload 
        if (!user) {
            return res.status(400).json({success: false, message: "User not found"})
        }
        res.status(200).json({success: true, user})
    } catch {
        res.status(400).json({success: false, message: error.message})
    }
}