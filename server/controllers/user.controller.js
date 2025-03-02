import User from "../models/user.model.js";

export const createUser = async (req, res) => {
  try {
    // Extract user data from request body
    const { personalDetails, address, previousCaseHistory, legalDocuments } =
      req.body;

    // Validate required fields
    if (
      !personalDetails?.firstName ||
      !personalDetails?.lastName ||
      !personalDetails?.email
    ) {
      return res
        .status(400)
        .json({ error: "First name, last name, and email are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      "personalDetails.email": personalDetails.email,
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists." });
    }

    // Create new user instance
    const newUser = new User({
      personalDetails,
      address,
      previousCaseHistory,
      legalDocuments,
    });

    // Save user to the database
    await newUser.save();

    // Respond with the created user data
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params; // Clerk ID from URL parameter
    const user = await User.findOne({ _id: id });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error getting user by id:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update an existing user
export const updateUser = async (req, res) => {
  try {
    const { clerkId } = req.params; // Clerk ID from URL parameter
    const userData = req.body; // Data to update

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: clerkId },
      userData,
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure Mongoose validators run
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a user (using Clerk ID)
export const deleteUser = async (req, res) => {
  try {
    const { clerkId } = req.params; // Clerk ID from URL parameter
    const deletedUser = await User.findOneAndDelete({ clerkId: clerkId });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(204).send(); // No content on successful deletion
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: error.message });
  }
};
