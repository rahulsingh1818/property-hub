import Property from "../models/Property.js";

export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "approved" });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const searchProperties = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const properties = await Property.find({
      status: "approved",
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } },
      ],
    });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};