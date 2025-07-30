import { mailtrapClient, sender } from "./mailtrapConfig.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";

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
            template_uuid:"f27f5b65-9a61-44bf-8aa9-0b4191ca7795",
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