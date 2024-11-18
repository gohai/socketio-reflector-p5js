const express = require("express");
const app = express();
const http = require("http");
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.static('public'));

let clients = [];

io.on("connection", (socket) => {
  clients.push(socket.id);
  console.log(socket.id + " joined (" + clients.length + " clients connected)");
  io.emit("joinOrLeave", clients);

  socket.on("disconnect", (reason) => {
    for (let i = 0; i < clients.length; i++) {
      if (clients[i] == socket.id) {
        clients.splice(i, 1);
        break;
      }
    }
    console.log(socket.id + " left (" + clients.length + " clients connected)");
    io.emit("joinOrLeave", clients);
  });

  socket.onAny((event, ...args) => {
    socket.broadcast.emit(event, args);
  });
});

server.listen(port, () => {
  console.log("Listening on *:" + port);
});
