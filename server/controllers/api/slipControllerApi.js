const Slip = require('../../models/slip');

const getSlips = async (req, res) => {
     console.log('Request Headers:', req.headers);
    try {
        const slips = await Slip.find({});
        res.status(200).json(slips);
    } catch {
        res.status(500).json({ error: "Failed to retrieve slips"});
    }
    res.on('finish', () => {
  console.log('Response headers sent:', res.getHeaders());
});

}

const newSlip = async (req, res) => {
    try {
        const existingSlip = await Slip.findOne({ name: req.body.slipName });
        if (existingSlip) return res.status(409).json({ message: "Slip with that name exists!", 
            errors: { slipName: "Slip name is already being used." }
        });

        if (req.body.slipX === "69" && req.body.slipY === "420") {
            return res.status(409).json({errors: {slipX: "Magic Number", slipY: "Has Been ACHIEVED!"}})
        }

        const slip = new Slip({ name: req.body.slipName, x: req.body.slipX,
                                y: req.body.slipY, season: req.body.season });
        await slip.save();
        res.status(201).json({ message: "Slip created successfully" });
    } catch (err) {
        console.error("Database error: ", err);
        res.status(500).send("Server Error");
    }
}

module.exports = {
    getSlips,
    newSlip
}