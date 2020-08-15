const { ObjectId } = require("mongodb");

const  MongoClient  = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;
const dbname = 'twentytwo';
const url = "mongodb://localhost:27017";
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