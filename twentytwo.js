const express = require('express');
const app = express();
const bodyParser = require("body-parser");

const db = require('./database/dbmongo');
const router = require('./route/login-register');
const router1 = require('./route/posts');
const router2 = require('./route/frndon');

const token =require("./route/middleware");
    




app.use(bodyParser.json({ limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));


app.use(require("./route/login-register"));
app.use(require('./route/posts'));
app.use(require('./route/frndon'));

// ROUTESs  *%%%
app.post("/api/login",router.login);
app.post("/api/register",router.register);
app.post("/api/getposts",token,router1.getposts);
app.post("/api/frndSearch", router2.searchFrfnd);
app.post("/api/userp",router2.profile);
app.post("/api/upload",router2.uploadimage)
app.post("/api/newpost",router1.newpost)


app.get("*",token,router.wildcard);


// database
db.connect((err) => {
    if (err) {
        console.log('unable to connect to database');
        process.exit(1);
    }

    else {

        console.log('CONNECTED TO MONGO :::27017::::');
    }
});

const PORT = process.env.PORT || 4201;
app.listen(PORT,console.log('PORT RUNNING ON ::::::4201 :::::'));
