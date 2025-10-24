const Message = require('../../models/messageSchema');

const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({});
        res.status(200).json(messages);
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).json({ error: "Failed to retrieve messages!" });
    }
};

const newMessage = async (req, res) => {
    try {
        if (!req.body.content) return res.status(400).json({ error: "Message must contain content" });
        const message = new Message({ content: req.body.content, senderId: req.body.senderId,
                                    receiverId: req.body.receiverId });
        await message.save();
        res.status(201).json(message);
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).json({ error: "Server Error" });
    }
}

module.exports = { getMessages, newMessage }