const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["*"]
  },
  maxHttpBufferSize: 1e8, // Increase buffer size to 100MB
  pingTimeout: 60000,     // 60 seconds timeout
  pingInterval: 25000,    // 25 seconds ping interval
  transports: ['websocket', 'polling']
});

// Store current state
let currentState = {
  lines: [],
  shapes: []
};

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('a user connected');
  
  // Send current state to new connections
  socket.emit('draw-update', currentState);

  socket.on('draw-update', (data) => {
    currentState = data;
    socket.broadcast.emit('draw-update', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = 3001;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});