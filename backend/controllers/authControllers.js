import { User } from "../models/User.js"
import bcrypt from 'bcryptjs'
import { generateTokenAndSetCookie } from "../utility/generateTokenAndSetCookie.js"

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
         
        res.status(201).json({success: true, message: "User created successfully", user: {
            ...user._doc, 
            password: undefined 
        }})


    } catch (error) {

    }
}

export const login = async (req, res) => {
    res.send("login from controller")
}

export const logout = async (req, res) => {
    res.send("logout from controller")
}