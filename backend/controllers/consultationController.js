import Consultation from "../models/Consultation.js";

export const bookConsultation = async (req, res) => {
    try {
        const { name, phone, city, message } = req.body;

        // user ka real data save hoga
        const newConsultation = new Consultation({
            name,
            phone,
            city,
            message,
        });

        await newConsultation.save();

        res.status(201).json({
            success: true,
            message: "Consultation booked successfully",
            data: newConsultation,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};