import User from "../models/user.model.js";

export const createUser = async (req, res) => {
  try {
    const { clerkId, fullName, email, userName, profileImageUrl } = req.body; 

    const newUser = new User({
      clerkId,
      fullName,
      email,
      userName,
      profileImageUrl,
    });

    await newUser.save();
    res.status(201).json(newUser); // Send back the created user
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get user by Clerk ID
export const getUserByClerkId = async (req, res) => {
  try {
    const { clerkId } = req.params; // Clerk ID from URL parameter
    const user = await User.findOne({ clerkId });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error getting user by clerkId:", error);
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
