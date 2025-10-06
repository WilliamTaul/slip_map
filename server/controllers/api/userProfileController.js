const UserProfile = require('../../models/userProfileSchema');

const getUserProfiles = async (req, res) => {
    // Development only return all user profiles
    try {
        const userProfiles = await UserProfile.find({});
        return res.status(200).json(userProfiles);
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).json({ error: "Failed to retrieve profieles!" });
    }
};

const getUserProfile = async (req, res) => {
    try {
        if (!req.body.userId) return res.status(400).json({ message: "No user id provided" });
        const userProfile = await UserProfile.findOne({ _id: req.body.userId });
        if (!userProfile) return res.status(404).json({message: "User not found" });
        return res.status(200).json(userProfile);   
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).json({ error: "Failed to retrieve user!" });
    }
};

const createUserProfile = async (req, res) => {
    try {
        if (!req.body.firstName || !req.body.lastName) return res.status(400).json({ message: "Must provide first and last name" });
        const userProfile = new UserProfile({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userId: req.user.id
        });
        await userProfile.save();
        return res.status(201).json(userProfile);
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).json({ error: "Failed to create user!" });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        if (!req.user.id) return res.status(400).json({ message: "User id must be provided" });
        const userProfile = await UserProfile.findOne({ _id: req.user.id });
        if (!userProfile) return res.status(404).json({ message: "user profile not found!" });

        if (req.body.firstName) userProfile.firstName = req.body.firstName;
        if (req.body.lastName) userProfile.lastName = req.body.lastName;

        await userProfile.save();
        return res.status(200).json({ message: "updated successfull!" });
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).json({ error: "Failed to update user!" });
    }
};
