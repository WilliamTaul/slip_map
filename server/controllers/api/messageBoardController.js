const MessageBoard = require('../../models/messageBoardSchema');

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
        if (!req.body.boardId) return res.status(400).json({ message: "board id not provided" });
        const messageBoard = await MessageBoard.findOne({ _id: req.body.boardId });
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
        if (!req.body.boardId) return res.status(400).json({ message: "Message board must be provided!" });

        const deletedBoard = await MessageBoard.deleteOne({ _id: req.body.boardId });
        
        if (deletedBoard > 0) return res.status(204).json({ message: "Board successfully deleted" });
        return res.status(404).json({ message: "Not Found!" });
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).json({ error: "Server Error" });
    }
}

const messageBoardAddUser = async (req, res) => {
    try {
        if (!req.body.boardId || !req.user.id) return res.status(400).json({ message: "Board and user must be provided!" });
        await MessageBoard.updateOne({ _id: req.body.boardId }, { $addToSet: { users: req.user.id } });
        return res.status(200).json({ message: "User added to board." });
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).json({ error: "Server Error" });
    }
};

const messageBoardRemoveUser = async (req, res) => {
    try {
        if (!req.body.boardId || !req.user.id) return res.status(400).json({ message: "Board and user must be provided!" });
        await MessageBoard.updateOne({ _id: req.body.boardId }, { $pull: { users: req.user.id } });
        return res.status(200).json({ message: "User removed from board." });
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).json({ error: "Server Error" });
    }
};

module.exports = { getMessageBoards, newMessageBoard, deleteMessageBoard,
                   getMessageBoard, messageBoardAddUser, messageBoardRemoveUser,
                   getUserBoards, }