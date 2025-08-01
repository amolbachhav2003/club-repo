import { mailtrapClient, sender } from "./mailtrapConfig.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}]

    try {
        const response = mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification",
        })

        console.log("Email sent successfully", response);
        
    } catch (error) {
        console.error(`Error sending verification email`, error);
        
        throw new Error(`Error sending verification email to ${email}`);
    }
}

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid:"9321c577-b18c-4a27-ab1c-4fc7c9d59af3",
            template_variables: {
                company_info_name: "DevXtreme",
                name: name, 
            },  
        })
        console.log("welcome Email sent successfully", response);
        
    } catch (error) {
        console.error(`Error sending welcome email`, error);
        throw new Error(`Error sending welcome email to ${email}`);
    }
}

export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{ email }]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset",
        })
        return response;
    } catch (error) {
        console.error("Mailtrap Error:", error);
        throw new Error(error.message || `Error sending password reset email to ${email}`);
    }
}

export const sendResetSuccessEmail = async (email) => {
    const recipient = [{ email }]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password reset successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset",
        })
        return response;
    } catch (error) {
        console.error("Mailtrap Error:", error);
        throw new Error(error.message || `Error sending password reset email to ${email}`);
    }
}