let socketIo = io(); // set the argument to the URL of the server on Glitch when using the p5 web editor
let clients = []; // has the ids of all clients (array is identical across clients)

let bgColor; // just for this example

function setup() {
  createCanvas(200, 200);

  // just for this example
  let redButton = createButton("Red");
  redButton.mousePressed(sendRed);
  let greenButton = createButton("Green");
  greenButton.mousePressed(sendGreen);
  let blueButton = createButton("Blue");
  blueButton.mousePressed(sendBlue);
  bgColor = color(255);
}

function draw() {
  background(bgColor);
}

// This example sends a "color" message to all other connected clients
// whenever the user clicks one of the buttons. The message contains
// the following ("payload") data: numbers for red, green and blue,
// as well as the ID of the client that enacted this change.

// Instead of "color", your code could have clients send various
// other messages, with a range of (custom) parameters.

function sendRed() {
  bgColor = color(255, 0, 0);
  socketIo.emit("color", 255, 0, 0, socketIo.id);
}

function sendGreen() {
  bgColor = color(0, 255, 0);
  socketIo.emit("color", 0, 255, 0, socketIo.id);
}

function sendBlue() {
  bgColor = color(0, 0, 255);
  socketIo.emit("color", 0, 0, 255, socketIo.id);
}

// This code runs once the client is connected to
// the server, and we have received "our" ID from it.
// (The ID will change when the user reloads the page,
// by the way, it is "ephemeral".)

socketIo.on("connect", function (socket) {
  console.log("Connected to server");
  console.log("My ID is " + socketIo.id);
});

// The server will send an updated list of all clients
// whenever a client joins or leaves. This way, every
// client has the same "clients" array - so if your
// own client ID matches the value of the first element
// in the array, you could e.g. be the "game master" etc.

socketIo.on("joinOrLeave", function (data) {
  clients = data;
  console.log("Received updated clients list: ", clients);
});

// This is just for the example, but demonstrate
// how to listen for a certain type of message ("color")
// and to receive the four arguments that the sender
// has sent in their emit() call.

socketIo.on("color", function (data) {
  bgColor = color(data[0], data[1], data[2]);
  console.log(data[3] + " changed the color");
});
