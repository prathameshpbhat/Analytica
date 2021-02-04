const express = require('express');
const router = express.Router();

router.get('/analytica/tweet/search/:variable', (req, res) => {
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn('python', ["./test.py", req.params.variable]);
    pythonProcess.stdout.on('data', (data) => {
        data = JSON.parse(data);
        console.log(data);
        return res.status(200).json(data);
    });

    pythonProcess.stderr.on('data', (data) => {
        return res.status(400).send(data);
    });
})

module.exports = router;