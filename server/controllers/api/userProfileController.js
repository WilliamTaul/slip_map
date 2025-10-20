const UserProfile = require('../../models/userProfileSchema');

const getUserProfiles = async (req, res) => {
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
        if (!req.user.id) return res.status(400).json({ message: "No user id provided" });
        const userProfile = await UserProfile.findOne({ userId: req.user.id });
        if (!userProfile) return res.status(404).json({message: "User not found" });
        return res.status(200).json(userProfile);   
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).json({ error: "Failed to retrieve user!" });
    }
};

const createUserProfile = async (req, res) => {
    try {
        const errors = {};
        if (!req.body.firstName || req.body.firstName.length < 2) {
            errors.firstName = "First name must be at least 2 characters";
        }
        if (!req.body.lastName || req.body.lastName.length < 2 ) {
            errors.lastName = "Last name must be at least 2 characters";
        }
        if (Object.keys(errors).length > 0) return res.status(400).json({error: errors});
        
        const userProfile = new UserProfile({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userId: req.user.id
        });
        await userProfile.save();
        return res.status(201).json({ message: "User profile created" });
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).json({ error: "Failed to create user!" });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const errors = {};
        if (!req.user.id) return res.status(400).json({ message: "User id must be provided" });
        const userProfile = await UserProfile.findOne({ userId: req.user.id });
        if (!userProfile) return res.status(404).json({ message: "user profile not found!" });

        if (!req.body.firstName || req.body.firstName.length < 2) {
            errors.firstName = "First name must be at least 2 characters";
        }
        if (!req.body.lastName || req.body.lastName.length < 2 ) {
            errors.lastName = "Last name must be at least 2 characters";
        }
        if (Object.keys(errors).length > 0) return res.status(400).json({error: errors});

        userProfile.firstName = req.body.firstName;
        userProfile.lastName = req.body.lastName;

        await userProfile.save();
        return res.status(200).json({ message: "updated successfull!" });
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).json({ error: "Failed to update user!" });
    }
};

module.exports = {
    getUserProfiles,
    getUserProfile,
    createUserProfile,
    updateUserProfile
}
