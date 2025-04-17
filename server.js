const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["*"]
<<<<<<< HEAD
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
=======
  }
});

// Store current state
let currentPages = [{ id: 1, lines: [], shapes: [] }];
>>>>>>> 312b9fabc2cbb3cb1152a2899c02e26b27de8fa3

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('a user connected');
  
<<<<<<< HEAD
  // Send current state to new connections
  socket.emit('draw-update', currentState);

  socket.on('draw-update', (data) => {
    currentState = data;
    socket.broadcast.emit('draw-update', data);
=======
  // Send current state to new clients
  socket.emit('draw-update', { pages: currentPages });

  // Handle all drawing updates
  socket.on('draw-update', (data) => {
    if (data.pages) {
      // Process and validate shape data
      const processedPages = data.pages.map(page => ({
        ...page,
        shapes: Array.isArray(page.shapes) ? page.shapes.map(shape => {
          // Ensure shape has required properties
          if (!shape.id) shape.id = Date.now().toString();
          
          // Make sure shape has all required properties based on type
          if (shape.type === 'line' && !shape.points) {
            shape.points = [];
          }
          
          // Ensure numeric properties are valid
          if (shape.x === undefined) shape.x = 0;
          if (shape.y === undefined) shape.y = 0;
          if (shape.width === undefined) shape.width = 10;
          if (shape.height === undefined) shape.height = 10;
          if (shape.strokeWidth === undefined) shape.strokeWidth = 5;
          
          return shape;
        }) : []
      }));
      
      currentPages = processedPages;
      // Broadcast to all clients including sender
      io.emit('draw-update', { pages: currentPages });
    }
  });

  // Keep this handler for backward compatibility
  socket.on('add-page', (data) => {
    if (data.pages) {
      currentPages = data.pages;
      io.emit('draw-update', { pages: currentPages }); // Changed to use draw-update for consistency
    }
>>>>>>> 312b9fabc2cbb3cb1152a2899c02e26b27de8fa3
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = 3001;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});