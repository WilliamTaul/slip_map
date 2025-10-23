const MessageBoard = require('../../models/messageBoardSchema');
const Message = require('../../models/messageSchema');

const getMessageBoards = async (req, res) => {
    try {
        const messageBoards = await MessageBoard.find({});
        res.status(200).json(messageBoards);
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).json({ error: "Failed to retrieve message boards!" });
    }
};

const getMessageBoard = async (req, res) => {
    try {
        if (!req.params.boardId) return res.status(400).json({ message: "board id not provided" });
        const messageBoard = await MessageBoard.findById(req.params.boardId);
        if (!messageBoard) return res.status(404).json({ message: "Board not found" });
        return res.status(200).json(messageBoard);
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).json({ error: "Failed to retrieve message board!" });
    }
};

const getUserBoards = async (req, res) => {
    try {
        if (!req.user.id) return res.status(400).json({message: "no user provided" });
        const boards = await MessageBoard.find({ users: req.user.id });
        return res.status(200).json(boards);
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).json({ error: "Failed to retrieve message boards!" });
    }
}

const newMessageBoard = async (req, res) => {
    try {
        if (!req.body.title) return res.status(400).json({ message: "Message board must have a title!" });

        const uniqueTitle = await MessageBoard.findOne({ title: req.body.title });
        if (uniqueTitle) return res.status(400).json({ message: "Message Board Title must be unique!" });

        const messageBoard = new MessageBoard({ title: req.body.title });
        await messageBoard.save();
        res.status(201).json(messageBoard);
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).json({ error: "Server Error" });
    }
};

const deleteMessageBoard = async (req, res) => {
    try {
        if (!req.params.id) return res.status(400).json({ message: "Message board must be provided!" });

        const deletedBoard = await MessageBoard.deleteOne({ _id: req.params.id });
        console.log("Board deleted: ", req.params);
        
        if (deletedBoard.deletedCount > 0) return res.status(204).json({ message: "Board successfully deleted" });
        return res.status(404).json({ message: "Not Found!" });
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).json({ error: "Server Error" });
    }
}

const messageBoardAddUser = async (req, res) => {
    try {
        if (!req.body.boardId || !req.body.userId) return res.status(400).json({ message: "Board and user must be provided!" });
        const exists = await MessageBoard.findOne({_id: req.body.boardId, users: req.body.userId});
        if (exists) return res.status(409).json({ message: "that user is already in the board" });
        await MessageBoard.updateOne({ _id: req.body.boardId }, { $addToSet: { users: req.body.userId } });
        return res.status(200).json({ message: "User added to board." });
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).json({ error: "Server Error" });
    }
};

const messageBoardRemoveUser = async (req, res) => {
    try {
        if (!req.params.boardid || !req.params.userid) return res.status(400).json({ message: "Board and user must be provided!" });
        const exists = await MessageBoard.findOne({_id: req.params.boardid, users: req.params.userid});
        if (!exists) return res.status(409).json({ message: "that user is not in the board" });
        await MessageBoard.updateOne({ _id: req.params.boardid }, { $pull: { users: req.params.userid } });
        return res.status(200).json({ message: "User removed from board." });
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).json({ error: "Server Error" });
    }
};

const messageBoardGetMessages = async (req, res) => {
    try {
        if (!req.params.boardId) return res.status(400).json({ error: {messageBoard: "No board provided" } });
        const messageBoard = await MessageBoard.findById(req.params.boardId);
        if (!messageBoard) return res.status(400).json({ error: "no message board found"});
        if (!messageBoard.users.includes(req.user.id)) return res.status(403).json({ error: "User not authorized for messages" });
        const messages = await Message.find({ boardId: req.params.boardId });
        return res.status(200).json(messages);
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).json({ error: "server error" });
    }
}

const addToDefaultBoard = async (req, res) => {
     try {
        if (!req.body.userId) return res.status(400).json({ message: "Board and user must be provided!" });
        const exists = await MessageBoard.findOne({_id: process.env.DEFAULT_BOARD_ID, users: req.body.userId});
        if (exists) return res.status(409).json({ message: "that user is already in the board" });
        await MessageBoard.updateOne({ _id: process.env.DEFAULT_BOARD_ID }, { $addToSet: { users: req.body.userId } });
        return res.status(200).json({ message: "User added to board." });
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).json({ error: "Server Error" });
    }
}

module.exports = { getMessageBoards, newMessageBoard, deleteMessageBoard,
                   getMessageBoard, messageBoardAddUser, messageBoardRemoveUser,
                   getUserBoards, messageBoardGetMessages, addToDefaultBoard }