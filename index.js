const express = require("express");
const app = express();
const cors = require('cors');
const dotenv = require("dotenv");
const path = require('path');
const connect = require("./connection/connection.js");
const bodyParser = require('body-parser');
dotenv.config();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(formidable());
// app.options('*', cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(cors());


// /////////////////// test browser /////////
// app.get("/", (req, res) => {
//   res.send("task managment running bro");
// })


//////////// routes /////////////
app.use("/v1/user", require("./routes/User.route.js"));
app.use("/v1/Jim", require("./routes/Jim.route.js"));
app.use("/v1/attendence", require("./routes/Attendence.route.js"));
app.use("/v1/packages", require("./routes/packages.routes.js"));
app.use("/v1/earning", require("./routes/expense.route.js"));
app.use("/v1/contact", require("./routes/Contact.route.js"));
app.use("/v1/notifications", require("./routes/Notifications.route.js"));


////////////// images Route ///////////////////////
app.use('/profile/images', express.static("./upload/images/"));



/////////// error handiling middleware ///////////
app.use((error, req, res, next) => {
  const message = error.message || "invalid error";
  const status = error.status || 500;
  console.log({ "status": status })
  return res.status(status).json({
    success: false,
    message: message,
    status: status,
    error: error.stack,
  });
});

///////// connection ////////////
const PORT = process.env.PORT || 8000;
app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);
connect();

//////////// images path //////////////////////////////
// app.use('/profile/images', express.static("./upload/images/"));
// app.use('/profile/files', express.static("./upload/files/"));

/////////////////////////////////////////////////////////////////////////////
const __dirname1 = path.resolve();

app.use(express.static(path.join(__dirname1, "build")));

app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname1, "Html", "index.html"))
);
///////////////// socket connection ///////////////////
// const io = require("socket.io")(server, {
//   pingTimeout: 60000,
//   cors: {},
// });



//////////// sockets ///////////////////
// io.on("connection", (socket) => {
//   console.log("Connected to socket.io");
//   socket.on("setup", (userData) => {
//     socket.join(userData._id);
//     socket.emit("connected");
//   });

//   socket.on("join chat", (room) => {
//     socket.join(room);
//     console.log("User Joined Room: " + room);
//   });
//   socket.on("typing", (room) => socket.in(room).emit("typing"));
//   socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

//   socket.on("new message", (newMessageRecieved) => {
//     var chat = newMessageRecieved.chat;

//     if (!chat.users) return console.log("chat.users not defined");

//     chat.users.forEach((user) => {
//       if (user._id == newMessageRecieved.sender._id) return;

//       socket.in(user._id).emit("message recieved", newMessageRecieved);
//     });
//   });


//   // Listen for incoming messages from the client
//   socket.on('Notifications', (message) => {
//     console.log(`received Notifications: ${message}`);

//     // Broadcast the message to all connected clients
//     io.emit('Notifications', message);
//   });

//   // Listen for disconnections
//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });

//   socket.off("setup", () => {
//     console.log("USER DISCONNECTED");
//     socket.leave(userData._id);
//   });
// });
