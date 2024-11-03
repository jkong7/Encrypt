import { VERIFICATION_EMAIL_TEMPLATE } from './emailTemplates.js'
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

        console.log("Success")
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
        console.log("Welcome email sent")
    } catch (error) {
        throw new Error("Error sending welcome email")
    }
}