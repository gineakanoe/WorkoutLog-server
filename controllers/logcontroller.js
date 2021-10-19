const router = require('express').Router();
const validateJWT = require('../middleware/validate-jwt');
const {LogModel} = require('../models');

router.get('/practice', validateJWT, (req, res) => {
    res.send('Hey!! This is a practice route!')
});

router.get('/about', (req, res) => {
    res.send('Hello! This is the about route!')
});

//* (POST) CREATE *\\
router.post('/create', validateJWT, async (req, res) => {
    const {description, definition, result} = req.body.log;
    const {id} = req.user;
    const logEntry = {description, definition, result, owner_id: id}

    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog);
    } catch(err) {
        res.status(500).json({error: err});
    }
    // LogModel.create(logEntry)
});

// //* (GET) ALL BY USER *\\
router.get('/mine', validateJWT, async (req, res) => {
    try {
        const userLogs = await LogModel.findAll();
        res.status(200).json(userLogs);
    } catch(err) {
        res.status(500).json({error: err});   
    }
});

//* (GET) LOGS BY ID *\\
router.get('/mine/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const results = await LogModel.findAll({
            where: {id: id}
        });
        res.status(200).json(results);
    } catch(err) {
        res.status(500).json({error: err});
    }
});

//* (PUT) UPDATE LOG *\\
router.put("/update/:id", validateJWT, async (req, res) => {
    const {description, definition, result} = req.body;
    try {
        const updatedLog = await LogModel.update(
            {description, definition, result},
            {where: {id: req.params.id}, returning: true}
        );
        res.status(200).json({
            message: 'Log successfully updated!',
            updatedLog
        });
    } catch(err) {
        res.status(500).json({
            message: `Failed to update log: ${err}`
        });
    }
});

//* (DELETE) LOG ENTRY *\\
router.delete("/delete/:id", validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const logId = req.params.id;
    try {
        const query = {
            where: {id: logId, owner_id: ownerId}
        };
        await LogModel.destroy(query);
        res.status(200).json({ message: "Log Entry Removed" });
    } catch(err) {
        res.status(500).json({error: err});
    }
});


module.exports = router;