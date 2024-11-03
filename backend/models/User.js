import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true, 
        unique: true
    }, 
    password: {
        type: String, 
        required: true, 
    }, 
    name: {
        type: String, 
        required: true
    },
    lastLogin: {
        type: Date, 
        default: Date.now()
    }, 
    isVerified: {
        type: Boolean, 
        default: false
    }, 
    resetPasswordToken: String, 
    resetPasswordExpiresAt: String, 
    verificationToken: String, 
    verificationTokenExpiresAt: Date, 
}, {timestamps: true})

export const User = mongoose.model('User', userSchema)


//createdAt and updatedAt fields will be auto added to the document with timestamps: true