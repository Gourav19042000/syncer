const express = require('express');
const app = express();
const http = require('http');
const path = require('path');

const ACTIONS = require('./src/Actions');

const PORT = process.env.PORT || 5000;
const server = app.listen(5000, () => console.log(`Listening on port.. ${PORT}`))

const io = require("socket.io")(server, {
  pingTimeout: 5000,
  cors: {
    origin: "http://localhost:3000",
  },
})

app.use(express.static('build'));
app.use((req,res,next)=>{
res.sendFile(path.join(__dirname,'build','index.html'))
})
function getAllConnectedClients(roomId) {
  // Map
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

const userSocketMap = {};


io.on('connection', (socket) => {
  console.log('socket connected relief');

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {

    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    //  console.log(clients);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });

  });


  socket.on('code-change', ({ roomId, code }) => {
    socket.in(roomId).emit('code-change', { code });

  });

  // socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
  //   io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  // });



  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});
