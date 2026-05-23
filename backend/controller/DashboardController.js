import UserModel from "../Models/UserModel.js";

const DashboardController = async (req, res) => {
  try {
    const { email } = req.body; // Destructure email from request body
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await UserModel.findOne({ email }); // Await the result of findOne

    if (user) {
      res.json({ name: user.name }); // Respond with the user's name
    } else {
      res.json({ message: "User Not Found" });
    }
  } catch (error) {
    res.status(500).json({
      message: `This is the Error: ${error.message}`,
      error,
    });
  }
};

export default DashboardController;
