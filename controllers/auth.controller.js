import User from "../models/user.model.js";

export const getCredentials = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    // Find the user in the database
    const user = await User.findOne({ username, password });

    // Check if user exists
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid username or password." });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error in fetching credentials:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
