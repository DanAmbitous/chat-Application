const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const uuid = require("uuid");
const port = 5800;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  //Gives the user an option to input a username or else get a default one to be used for messages
  socket.on("register", (username) => {
    if (username === null || username.length === 0) {
      username = `Guest ${uuid.v4()}`;
    }

    //Informs that a user has joined the chat room
    console.log(`User: ${username} has joined the chat`); 
    io.emit('chat message', `User: ${username} has joined the chat`);

    //Informs who is typing
    socket.on("typing", () => {
      socket.broadcast.emit("typing", username);
    });

    /*socket.on('typing status', () => {
      console.log(`User: ${username} is typing...`);
      io.emit('typing message', `User: ${username} is typing...`);
    })*/

    //Shows the message of a user
    socket.on('chat message', (msg) => {
      console.log(`User: ${username} says: ${msg}`);
      io.emit('chat message', `User: ${username} says: ${msg}`);
    });

    //Tells who has disconnected
    socket.on('disconnect', () => {
      console.log(`User: ${username} has left the chat`);
      io.emit('chat message', `User: ${username} has left the chat`);
    });
  })
});

http.listen(port, () => {
  console.log(`Listening on port ${port}`);
}); 