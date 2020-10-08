const express = require('express');
const app = express();
const bodyParser = require("body-parser");
var cors = require('cors')
const { ObjectId } = require("mongodb");

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
app.post("/api/onlinecheck",router4.onlinecheck);




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
    console.log(data, 'connecterd ============')

    db.getDB().collection('userdata').updateOne({ _id: ObjectId(data.localid) }, { $set: { socketId: socket.id, online: 'online' } }, (err, result) => {
      if (err)
        throw err;
      else {

        console.log('succcesss')
      }
    })

    socket.join();
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
    // console.log("Sending message from "+ message.from + " to " + message.to);

    if (message.message !== '') {
      db.getDB().collection('chatprivate').insertOne({ from: message.from, to: message.to, message: message.message }, (err, res) => {
        if (err)
          throw err;
        else {
          io.emit(message.to, message)
        }

      })
    } else {
      console.log("empty messsage")
    }

  })
  socket.on('messages', function (data) {

    const data1 = {
      '$or': [
        {
          '$and': [
            {
              'to': data.from
            }, {
              'from': data.to
            }
          ]
        }, {
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


  socket.on('typing', (data) => {
    io.emit(data.to, data)
    console.log('typing')
  })


  socket.on('disconnect', function (data) {
    console.log('user disconnected', data, socket.id);
    let date = new Date()

    db.getDB().collection('userdata').updateOne({ socketId: socket.id }, { $set: { online :date} }, (err, result) => {
      if (err)
        throw err;
      else {

        console.log('succcesss disconnected')
      }
    });
  });

  // // socket.on('onlinecheck',(data)=>{
  // //   console.log(data)
	// // 	return new Promise( async (resolve, reject) => {
	// // 		try {
	// // 			db.getDB().collection('userdata').findOne( { _id : ObjectId(data.to)},{ projection: { mobile: 0, dob: 0, imgurl: 0, email: 0, password: 0, repassword: 0,friends:0,sendreq:0,requested:0,name:0,username:0,socketid:0,_id:0,socketId:0 }}, (err, result) => {
	// // 				if( err ){
	// // 					reject(err);
	// // 				}
  // //         console.log(result);
  // //         io.emit(data.from, result)
	// // 			});	
	// // 		} catch (error) {
	// // 			reject(error)
	// // 		}
	// // 	});

  // })






});



module.exports = { server }