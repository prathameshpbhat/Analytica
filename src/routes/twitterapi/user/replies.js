const express = require('express');
const router = express.Router();
// const fs = require('fs');


// router.get('/analytica/tweet/personal/reply', (req, res) => {
//     const spawn = require("child_process").spawn;
//     const pythonProcess = spawn('python', [`./PythonFiles/other_testing_pickle.py`, '1363614916322742272', 2]);
//     let body = "";
//     pythonProcess.stdout.on('data', (data) => {
//         body += data;
//     });
//     pythonProcess.stdout.on('end', function () {
//         let data = JSON.parse(body);
//         return res.status(200).json(data);
//     });

//     pythonProcess.stderr.on('data', (data) => {
//         return res.status(400).send(data);
//     });
// })

// router.get('/analytica/tweet/new-search', (req, res) => {
//     let str = '{"id": 903232137222082562, "conversation_id": "902802569801682944", "created_at": "2017-08-31 17:54:57 India Standard Time", "date": "2017-08-31", "time": "17:54:57", "timezone": "+0530", "user_id": 832616602352783362, "username": "raunaknaik5", "name": "Raunak Naik", "place": "", "tweet": "@Skins_Cash Skins are love, skins are life", "language": "en", "mentions": [], "urls": [], "photos": [], "replies_count": 0, "retweets_count": 0, "likes_count": 0, "hashtags": [], "cashtags": [], "link": "https://twitter.com/RaunakNaik5/status/903232137222082562", "retweet": false, "quote_url": "", "video": 0, "thumbnail": "", "near": "", "geo": "", "source": "", "user_rt_id": "", "user_rt": "", "retweet_id": "", "reply_to": [{"screen_name": "Skins_Cash", "name": "SkinsCash", "id": "733650554816192514"}], "retweet_date": "", "translate": "", "trans_src": "", "trans_dest": ""} {"id": 903232137222082562, "conversation_id": "902802569801682944", "created_at": "2017-08-31 17:54:57 India Standard Time", "date": "2017-08-31", "time": "17:54:57", "timezone": "+0530", "user_id": 832616602352783362, "username": "raunaknaik5", "name": "Raunak Naik", "place": "", "tweet": "@Skins_Cash Skins are love, skins are life", "language": "en", "mentions": [], "urls": [], "photos": [], "replies_count": 0, "retweets_count": 0, "likes_count": 0, "hashtags": [], "cashtags": [], "link": "https://twitter.com/RaunakNaik5/status/903232137222082562", "retweet": false, "quote_url": "", "video": 0, "thumbnail": "", "near": "", "geo": "", "source": "", "user_rt_id": "", "user_rt": "", "retweet_id": "", "reply_to": [{"screen_name": "Skins_Cash", "name": "SkinsCash", "id": "733650554816192514"}], "retweet_date": "", "translate": "", "trans_src": "", "trans_dest": ""} {"id": 903232137222082562, "conversation_id": "902802569801682944", "created_at": "2017-08-31 17:54:57 India Standard Time", "date": "2017-08-31", "time": "17:54:57", "timezone": "+0530", "user_id": 832616602352783362, "username": "raunaknaik5", "name": "Raunak Naik", "place": "", "tweet": "@Skins_Cash Skins are love, skins are life", "language": "en", "mentions": [], "urls": [], "photos": [], "replies_count": 0, "retweets_count": 0, "likes_count": 0, "hashtags": [], "cashtags": [], "link": "https://twitter.com/RaunakNaik5/status/903232137222082562", "retweet": false, "quote_url": "", "video": 0, "thumbnail": "", "near": "", "geo": "", "source": "", "user_rt_id": "", "user_rt": "", "retweet_id": "", "reply_to": [{"screen_name": "Skins_Cash", "name": "SkinsCash", "id": "733650554816192514"}], "retweet_date": "", "translate": "", "trans_src": "", "trans_dest": ""} {"id": 903232137222082562, "conversation_id": "902802569801682944", "created_at": "2017-08-31 17:54:57 India Standard Time", "date": "2017-08-31", "time": "17:54:57", "timezone": "+0530", "user_id": 832616602352783362, "username": "raunaknaik5", "name": "Raunak Naik", "place": "", "tweet": "@Skins_Cash Skins are love, skins are life", "language": "en", "mentions": [], "urls": [], "photos": [], "replies_count": 0, "retweets_count": 0, "likes_count": 0, "hashtags": [], "cashtags": [], "link": "https://twitter.com/RaunakNaik5/status/903232137222082562", "retweet": false, "quote_url": "", "video": 0, "thumbnail": "", "near": "", "geo": "", "source": "", "user_rt_id": "", "user_rt": "", "retweet_id": "", "reply_to": [{"screen_name": "Skins_Cash", "name": "SkinsCash", "id": "733650554816192514"}], "retweet_date": "", "translate": "", "trans_src": "", "trans_dest": ""}""'
//     console.log(str.substring(800, 880))
//     const spawn = require("child_process").spawn;
//     const pythonProcess = spawn('python', [`./PythonFiles/search.py`]);
//     pythonProcess.stdout.on('data', (data) => {});
//     pythonProcess.stdout.on('end', function () {});
//     pythonProcess.stderr.on('data', (data) => {
//         return res.status(400).send(data);
//     });

//     let rawdata = fs.readFileSync('./none.json');
//     let student = JSON.parse(rawdata);
//     console.log(student);
// })

module.exports = router;