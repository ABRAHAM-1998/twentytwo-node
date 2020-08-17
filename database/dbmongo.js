const { ObjectId } = require("mongodb");

const  MongoClient  = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;
const dbname = 'twentytwo';
const url = 'mongodb+srv://K1u2t3t4u5:6quDurZRz0kJG5bG@twentytwo.d0ccj.mongodb.net/<dbname>?retryWrites=true&w=majority'
const mongotype = { useUnifiedTopology: true };
const state = {
    db : null
};
const connect = (cb)=>{
    if(state.db)
    db();
    else {
        MongoClient.connect(url,mongotype,(err ,client)=>{
            if(err)
            console.log(err);
            else{
                state.db = client.db(dbname);
                cb();
            };
        })
    }
}
const getPrimaryKey = (_id)=>{
    return ObjectId(_id);
};
const getDB =()=>{
    return state.db;
}
module.exports ={
    getDB,
    getPrimaryKey,
    connect
}