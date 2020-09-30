const express = require('express');
const token = require('./middleware');
const router4 = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../database/dbmongo');
const { ObjectId } = require('mongodb');


router4.deletechat = (req, res)=>{
    // console.log(req.body.id)
    // res.json({ apistatus: true, arrMsg:" message Deleted" })
    db.getDB().collection('chats').deleteOne({ _id: ObjectId(req.body.id) }, (err, result) => {
        // console.log(result)
        if (err) throw err;
        else{

        res.json({ apistatus: true, statusMsg: 'succesfully deleted' })
        }
    })

}


module.exports = router4;