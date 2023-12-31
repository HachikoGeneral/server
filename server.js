var server = require("http").createServer();
var options = {
  cors: true,
};

var io = require("socket.io")(server, options);

var players = {};

function Player(id) {
  this.id = id;
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.entity = null;
}

io.sockets.on("connection", function (socket) {
  socket.on("initialize", function () {
    var id = socket.id;
    var newPlayer = new Player(id);
    // Creates a new player object with a unique ID number.

    players[id] = newPlayer;
    // Adds the newly created player to the array.

    socket.emit("playerData", { id: id, players: players });
    // Sends the connecting client his unique ID, and data about the other players already connected.

    socket.broadcast.emit("playerJoined", newPlayer);
    // Sends everyone except the connecting player data about the new player.
  });
});
io.sockets.on("positionUpdate", function (data) {
  players[data.id].x = data.x;
  players[data.id].y = data.y;
  players[data.id].z = data.z;

  io.sockets.broadcast.emit("playerMoved", data);
});
console.log("Server started.");
server.listen(3000);
