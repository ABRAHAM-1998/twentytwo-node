const express = require('express');
const token = require('./middleware');
const router4 = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../database/dbmongo');
const { ObjectId } = require('mongodb');


router4.deletechat = (req, res) => {
    // console.log(req.body.id)
    // res.json({ apistatus: true, arrMsg:" message Deleted" })
    db.getDB().collection('chats').deleteOne({ _id: ObjectId(req.body.id) }, (err, result) => {
        // console.log(result)
        if (err) throw err;
        else {

            res.json({ apistatus: true, statusMsg: 'succesfully deleted' })
        }
    })

}
router4.onlinecheck = (req, res) => {
    if(req.body.id != ''){
        db.getDB().collection('userdata').findOne({ _id: ObjectId(req.body.id) }, { projection: { mobile: 0, dob: 0, imgurl: 0, email: 0, password: 0, repassword: 0, friends: 0, sendreq: 0, requested: 0, name: 0, username: 0, socketid: 0, _id: 0, socketId: 0 } }, (err, result) => {
            if (err) throw err;
            else{
            res.json({res:result})
    
            }
    
        });
    }

}


module.exports = router4;