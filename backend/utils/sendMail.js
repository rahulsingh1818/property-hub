import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "YOUR_EMAIL",
        pass: "APP_PASSWORD",
    },
});

export const sendBookingMail = async (to, property) => {
    await transporter.sendMail({
        from: "Real Estate",
        to,
        subject: "Booking Confirmed",
        text: `Your booking for ${property.title} is confirmed.`,
    });
};
