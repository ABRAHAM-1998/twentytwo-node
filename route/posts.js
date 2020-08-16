const express = require('express');
const token = require('./middleware');
const router1 = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../database/dbmongo');
const { ObjectId } = require('mongodb');

// ==============================GET-POSTS-ROUTE================================
router1.getposts = (req, res) => {
    // console.log(req.headers)

    token1 = req.headers["authorization"]
    jwt.verify(req.token, 'kuttuzhrtshgsdugdsudysguydstgdyusdysudfy',  (err, decoded) =>{
        if (err)
            throw err;
        else {
            console.log(decoded)
            // db.getDB().collection('posts').find({}).toArray((errr, result) => {
            //     if (errr) throw errr;
            //     result.forEach(element => {
            //         element.userdata = db.getDB().collection('userdata').findOne({ _id: result.key });
            //         console.log(element.userdata)
            //         res.json({data:element})
            //     });

            // })
            db.getDB().collection('posts').aggregate([
                { $lookup:
                  {
                    from: 'userdata',
                    localField: 'key',
                    foreignField: '_id',
                    as: 'postdetails'
                  }
                }
              ]).sort( { date: -1 } ).toArray((err, result)=> {
                if (err) throw err;
                res.json({ apistatus: true, arrMsg: ['success post saved'], data: result });
              });
        }
    });
}
// ==============================CREATE-POST-ROUTE================================
router1.newpost = (req, res) => {
    var data = {
        key: ObjectId(req.body.id),
        location: req.body.location,
        Description: req.body.Description,
        image: req.body.image,
        date: req.body.date
    }

    db.getDB().collection('posts').insertOne(data, (err, result) => {
        if (err)
            throw err;
        else {
            res.json({ apistatus: true, arrMsg: ['success post saved'] });
        }
    })
}

module.exports = router1;
