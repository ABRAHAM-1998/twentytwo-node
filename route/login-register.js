const express = require('express');
const token = require('./middleware');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../database/dbmongo')


// ===============================LOGIN-ROUTE================================
router.login = (req, res) => {
    console.log(req.body)
        db.getDB().collection('userdata').findOne({ username: req.body.username, password: req.body.password },{ projection: { mobile:0,dob:0,imgurl:0,email:0, repassword: 0 }}, (err, result) => {
        if (err)
            throw err;
        else if (result == null) {
            res.json({ apistatus: false, arrMsg: ['INVALID_USER'] })
        } else {
            const tokens = jwt.sign(req.body, 'kuttuzhrtshgsdugdsudysguydstgdyusdysudfy')
            res.json({ apistatus: true, arrMsg: ['success'], token: tokens,id:result._id})
        }
    });
}

// ============================REGISTER -ROUTE================================
router.register = (req, res) => {

        const regdata = req.body;
    
        switch (0) {
            case 0:
                c = []
    
            case 1:
                db.getDB().collection('userdata').findOne({ name: regdata.name }, (err, result) => {
                    if (result == null)
                        console.log(err, 'DUSUSUUSUSU');
                    else {
                        // console.log(result)
                        return c.push('NAME_FALSE')
                    }
                })
            case 2:
                db.getDB().collection('userdata').findOne({ username: regdata.username }, (err, result) => {
                    if (result == null)
                        console.log(err);
                    else {
                        return c.push('USERNAME_FALSE');
                    }
                })
            case 3:
                db.getDB().collection('userdata').findOne({ email: regdata.email }, (err, result) => {
                    if (result == null)
                        console.log(err);
                    else {
                        return c.push('EMAIL_FALSE')
                    }
                })
            case 4:
                db.getDB().collection('userdata').findOne({ mobile: regdata.mobile }, (err, result) => {
                    if (result == null)
                        console.log(err);
                    else {
                        c.push('MOBILE_FALSE')
                    }
                    console.log(c.length)
                    if (c.length == 0) {
                        db.getDB().collection('userdata').insertOne(regdata, { upsert: true }, (err, result) => {
                            if (err)
                                console.log(err);
                            else {
    
                                res.json({ apistatus: true, arrMsg: 'success', data: result })
    
                            }
                        })
                    } else {
                        console.log(c)
                        res.json(403, { apistatus: false, arrMsg: c })
                    }
                })
            default:
                break;
        }
    }

// ============================WILD-CAED-ROUTE================================
router.wildcard = (req, res) => {
    res.status(404).send('<h1>404 : REQUESTED PATH NOT FOUND <h1/>');
};


module.exports = router;