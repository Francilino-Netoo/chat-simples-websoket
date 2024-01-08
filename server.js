const express = require("express");
const path = require("path");
const http = require("http");
const soketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = soketIO(server);

server.listen(3000);

app.use(express.static(path.join(__dirname, "public")));

let connecteUsers = [];

io.on("connection", (socket) => {
  socket.on("join-request", (username) => {
    socket.username = username;
    connecteUsers.push(username);
    console.log(connecteUsers);

    socket.emit("user-ok", connecteUsers);
    socket.broadcast.emit("list-update", {
      joined: username,
      list: connecteUsers,
    });
  });

  socket.on("disconnect", () => {
    connecteUsers = connecteUsers.filter((u) => u != socket.username);

    socket.broadcast.emit("list-update", {
      left: socket.username,
      list: connecteUsers,
    });
  });

  socket.on("send-msg", (txt) => {
    let obj = {
      username: socket.username,
      message: txt,
    };

    socket.broadcast.emit("show-msg", obj);
  });
});
