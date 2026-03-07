import Contact from "../models/Contact.js";

export const createContact = async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    const newContact = await Contact.create({ name, phone, message });

    res.status(201).json({
      success: true,
      message: "Form submitted successfully",
      data: newContact,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};