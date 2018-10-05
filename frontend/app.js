const path = require('path');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require("socket.io").listen(http)
// our room to connect users too
let playerRoom;
// the amount of players that are ready
let playerSet = 0;
// our players
let players = {};

app.use("/public", express.static("public"))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html'); //route to the files directory
});

// when we connect, we start listening for client:emits
io.on("connection", function(socket) {
    console.log("a user is connected")
    socket.on("disconnect", function() {
      console.log("a user is disconnected")
    })

    // when we recieve a client:start game
    socket.on("start game", function(user, user2) {
      // set our players object from line 11 to
      // hold both of our users
      players[0] = user
      players[1] = user2
      // then server:emit start a game with our players object
      io.emit("start a game", players)
    })

    // when we receive a client:room
    socket.on("room", function(room) {
      // update our room on line 7 with the room the user wants to join
      playerRoom = room
      // join that room
      socket.join(room)
      // then server:emit to people in that room that someone has joined the room
      io.sockets.in(room).emit("player joined", "player has joined the room")
    })

    // when we receive a client:ship set
    socket.on("ship set", function() {
      // increment our players set from line 9
      playerSet++
      // if both users are ready
      if(playerSet === 2) {
        // server:emit battle
        io.emit("battle")
      }
    })

    // when we receive a client:guess
    socket.on("guess", function(squareId) {
      // server:emit check with the squareId
      // this allows each user to check on their own board without knowing the other board
      io.emit("check", squareId)
    })

    // when we receive a client: hit or miss
    socket.on("hit or miss", function(guess, squareId) {
        // server:emit registerHitOrMiss with whether it
        // was a 'hit' or 'miss' and then pass the ID
        io.emit('registerHitOrMiss', guess, squareId)
    })

    // when we receive a client:change
    socket.on('change', function() {
      // server:emit changeTurns so we change the user turns
      io.emit('changeTurns')
    })

    // when we receive a client:add win
    socket.on('add win', function(user){
      // server:emit add win to user
      io.emit('add win to user', user)
    })

});

http.listen(3001, function(){
  console.log('listening on *:3001');
});
