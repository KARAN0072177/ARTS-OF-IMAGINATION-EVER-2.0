import { getFromAddress, sendMail } from "./resendClient.mjs";

const sendEmail = async (to, subject, html) => {
    try {
        await sendMail({
            from: getFromAddress("ARTS OF IMAGINATION EVER"),
            to,
            subject,
            html,
        });
        console.log("Login email sent successfully.");
    } catch (error) {
        console.error("Error sending login email:", error);
    }
};

export default sendEmail;
