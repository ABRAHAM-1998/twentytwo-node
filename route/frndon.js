const express = require('express');
const token = require('./middleware');
const router2 = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../database/dbmongo');
const { ObjectId } = require("mongodb");


router2.searchFrfnd = (req, res)=>{
    var text1 = new RegExp(req.body.search);
    db.getDB().collection('userdata').find( {$or: [{ name: text1 }, { username: text1 }]},{ projection: { mobile:0,dob:0,imgurl:0,email:0, password: 0, repassword: 0 }}).limit(10).toArray((err,result)=>{
        if (err)
        throw err;
    else {
        res.json({ apistatus: true, arrMsg: ['success post saved'] ,data:result});
    }
    })
}
router2.profile = (req, res)=>{
    db.getDB().collection('userdata').findOne({ _id: ObjectId(req.body.id) }, { projection: { password: 0, repassword: 0 } }, (err, result) => {
        if (err) {
            throw err;
        } else {
            let data = {
                apistatus: true,
                arrMsg: 'succcess',
                arrList: result
            }

            res.json(data)
        }
    })
}
router2.uploadimage = (req, res)=>{
    // console.log(req.body.pdata)
    db.getDB().collection('userdata').updateOne({ _id: ObjectId(req.body.id) }, { $set: { imgurl: req.body.img } }, (err, result) => {
        if (err)
            throw err;
        else {
            res.json({ apistatus: true, arrMsg: ['success'] });
            // console.log('succcesss',result)
        }
    })
}

router2.friendList = (req,res)=>{
    db.getDB().collection('userdata').find({},{projection:{password:0,repassword:0,email:0,dob:0,mobile:0}}).sort({name:1}).toArray((err,result)=>{
        if(err) throw err;
        res.json({apistatus:true,data:result})
    })
}


module.exports = router2;