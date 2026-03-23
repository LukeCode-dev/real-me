import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import config from './config/index.js';
import authRoutes from './routes/auth.js';
import avatarRoutes from './routes/avatars.js';
import productRoutes from './routes/products.js';
import storeRoutes from './routes/stores.js';
import orderRoutes from './routes/orders.js';
import tryOnRoutes from './routes/tryOn.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: config.clientUrl, methods: ['GET', 'POST'] },
});

// Middleware
app.use(cors({ origin: config.clientUrl }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(config.uploadDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/avatars', avatarRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/try-on', tryOnRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Socket.IO for real-time world
let onlineUsers = 0;

io.on('connection', (socket) => {
  onlineUsers++;
  io.emit('users:count', onlineUsers);

  socket.on('player:move', (data) => {
    socket.broadcast.emit('player:moved', {
      userId: socket.id,
      position: data.position,
      rotation: data.rotation,
    });
  });

  socket.on('player:enterStore', (data) => {
    socket.join(`store:${data.storeId}`);
    io.to(`store:${data.storeId}`).emit('store:userCount', {
      storeId: data.storeId,
      count: io.sockets.adapter.rooms.get(`store:${data.storeId}`)?.size || 0,
    });
  });

  socket.on('disconnect', () => {
    onlineUsers--;
    io.emit('users:count', onlineUsers);
  });
});

// Connect to MongoDB and start server
async function start() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.warn('MongoDB not available, running without database:', err.message);
  }

  httpServer.listen(config.port, () => {
    console.log(`Real Me server running on port ${config.port}`);
  });
}

start();
