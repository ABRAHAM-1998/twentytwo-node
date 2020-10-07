const express = require('express');
const app = express();
const bodyParser = require("body-parser");
var cors = require('cors')

const db = require('./database/dbmongo');
const router = require('./route/login-register');
const router1 = require('./route/posts');
const router2 = require('./route/frndon');
const router4 = require('./route/chat')

const token = require("./route/middleware");





app.use(bodyParser.json({ limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true, useUnifiedTopology: true }));
app.use(cors())

app.use(require("./route/login-register"));
app.use(require('./route/posts'));
app.use(require('./route/frndon'));


// ROUTESs  *%%%
app.post("/api/login", router.login);
app.post("/api/register", router.register);
app.post("/api/getposts", token, router1.getposts);
app.post("/api/frndSearch", router2.searchFrfnd);
app.post("/api/userp", router2.profile);
app.post("/api/upload", router2.uploadimage);
app.post("/api/newpost", router1.newpost);
app.post('/api/friends', router2.friendList);
app.post('/api/userpost', router1.userpost);
app.post('/api/postdelete', router1.postdelete);

app.post('/api/request', router2.request);
app.post('/api/requestedin', router2.showreqst);
app.post('/api/requestedout', router2.requestedlist);
app.post('/api/cancelreq', router2.cancelreq);

app.post('/api/acceptreq', router2.acceptreq);
app.post("/api/deleteGchat", router4.deletechat);




app.get("*", router.wildcard);


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
const server = app.listen(PORT, console.log('PORT RUNNING ON ::::::4201 :::::'));
var io = require('socket.io').listen(server);
io.on('connection', (socket) => {
  socket.on('join', function (data) {
    socket.join(data.room);
    db.getDB().collection('chats').find({}).sort({ $natural: -1 }).limit(50).toArray((err, res) => {
      io.emit('new user joined', res);

    })
  });
  socket.on('leave', function (data) {
    io.emit('left room', { user: data.user, message: 'has left chat.' });
    socket.leave(data.room);
  });

  socket.on('message', function (data) {
    if (data.message !== '') {
      db.getDB().collection('chats').insertOne({ user: data.user, message: data.message, date: data.date }, (err, res) => {
        if (err)
          throw err;
        else {

        }
        io.in(data.room).emit('new message', data);

      })
    } else {
      console.log("empty messsage")
    }

  })
  // _____________________________________________________________________________________________

  socket.on('recievemsg', (message) => {

    // console.log(data)
    io.emit(message.from, message)
    // console.log("Sending message from "+ message.from + " to " + message.to);
    console.log(message)
    
    if (message.message !== '') {
      db.getDB().collection('chatprivate').insertOne({ from:message.from,to:message.to,message:message.message}, (err, res) => {
        if (err)
          throw err;
        else {

        }
        io.emit(message.from, message)

      })
    } else {
      console.log("empty messsage")
    }
  })
  socket.on('messages', function (data) {

    const data1 = {
      '$or' : [
        { '$and': [
          {
            'to': data.from
          },{
            'from': data.to
          }
        ]
      },{
        '$and': [ 
          {
            'to': data.to
          }, {
            'from': data.from
          }
        ]
      },
    ]
  };


    db.getDB().collection('chatprivate').find(data1).sort({ $natural: -1 }).limit(50).toArray((err, res) => {
      io.emit(data.from, res);
    })
  });
});



module.exports = { server }