import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from './emailTemplates.js'
import { mailtrapClient, sender } from './mailtrapConfig.js'

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}]
    try {
        await mailtrapClient.send({
            from: sender, 
            to: recipient, 
            subject: "Verify your email", 
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken), 
            category: "Email Verification"
        })
    } catch (error) {
        throw new Error("Error sending verification email")
    }
}

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{email}]
    try {
        await mailtrapClient.send({
            from: sender, 
            to: recipient, 
            template_uuid: "24cfba10-7968-4523-974c-09fb8547d99b", 
            template_variables: {
                company_info_name: "Auth company", 
                name: name
            }
        })
    } catch (error) {
        throw new Error("Error sending welcome email")
    }
}

export const sendPasswordResetEmail = async (email, tokenURL) => {
    const recipient = [{email}]
    try {
        await mailtrapClient.send({
            from: sender,
            to: recipient, 
            subject: "Reset your password", 
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", tokenURL), 
            category: "Password Reset"
        })
    } catch (error) {
        throw new Error("Error sending password reset email")
    }
}

export const sendResetSuccessEmail = async (email) => {
    const recipient = [{email}]
    try {   
        await mailtrapClient.send({
            from: sender, 
            to: recipient, 
            subject: "Password successfully reset", 
            html: PASSWORD_RESET_SUCCESS_TEMPLATE, 
            category: "Password Reset"
        })
    } catch (error) {
        throw new Error("Error sending password reset success email")
    }
}