const express = require('express');
const router = express.Router();

router.get('/analytica/tweet/search/:variable', (req, res) => {
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn('python', ["./test.py", req.params.variable]);
    let body = "";
    pythonProcess.stdout.on('data', (data) => {
        body += data;
        body = JSON.parse(body);
    });
    pythonProcess.stdout.on('end', function () {
        console.log(body);
        return res.status(200).json(body);
    });

    pythonProcess.stderr.on('data', (data) => {
        return res.status(400).send(data);
    });
})

module.exports = router;