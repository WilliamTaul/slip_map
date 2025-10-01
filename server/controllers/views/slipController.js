const Slip = require('../../models/slip');

const showSlips = async (req, res) => {
    try {
        const slips = await Slip.find({season: 1});
        res.render('slips', {title: 'All Slips', slips});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

const showSlipForm = (req, res) => {
    res.render('slipForm', {errors: null, formData: {} });
};

const handleSlipForm = async (req, res) => {
    const formData = req.body
    console.log(formData.x);
    
    const slip = new Slip({name: formData.name,
                            x: formData.x,
                            y: formData.y,
                            season: formData.season
    });

    try {
        console.log("saving slips..")
        await slip.save();
        res.redirect('/slips');
    } catch (err) {
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);

            return res.status(400).render('slipForm', {
                errors,
                formData: {name: formData.name,
                            x: formData.x,
                            y: formData.y,
                            season: formData.season
                }
            });
        }
        console.error(err);
        res.status(500).send('server error');
    }
};

const slipMap = async (req, res) => {
    try {
        const slips = await Slip.find();
        res.render('slipMap', {title: 'Slip Map'});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
    
}

module.exports = { showSlipForm, handleSlipForm,
                    showSlips, slipMap};