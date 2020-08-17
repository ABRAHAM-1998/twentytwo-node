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
router1.userpost = (req, res)=>{
    let data={
    }
                db.getDB().collection('userdata').find({_id:ObjectId(req.body.id)}).toArray((errr, result) => {
                    // data = result ;
                    if (errr) throw errr;
    
                     db.getDB().collection('posts').find({ key:ObjectId(req.body.id) }).toArray((err,resul)=>{
                        // data.append(result,resul)
                         Object.assign(data,{usrdata:result,post:resul})
                    res.json({data})

                    });
                    // console.log(element.userdata)


            })  
    
}
router1.postdelete = (req,res)=>{
    db.getDB().collection('posts').deleteOne({_id:ObjectId(req.body.key)},(err,result)=>{
        // console.log(result)
        if(err) throw err;

        res.json({apistatus:true, statusMsg:'succesfully deleted'})
    })
}

module.exports = router1;
