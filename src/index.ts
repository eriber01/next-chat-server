import 'dotenv/config'

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import AppDataSource from "../config/data-source";
import { onSaveChats } from './modules/Chats/actions';
import { onSaveChatI } from './modules/Chats/interfaces';
const app = express()

const httpServer = createServer(app)

const PORT = process.env.PORT || 3001

const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
})


io.on('connection', async (socket) => {
  console.log('a user connected');
  try {
    socket.on('message', async (message: onSaveChatI) => {
      console.log({ message });
      const chat = await onSaveChats(message)
      io.emit('message', chat)
    })
  } catch (error) {
    console.log(error);
  }

  socket.on('disconnect', () => {
    console.log('user disconnect');
  })
})

httpServer.listen(PORT, () => {
  console.log('hola en el puerto ', PORT);
  AppDataSource.initialize()
    .then(() => {
      console.log('Database Init');
    })
    .catch((err) => {
      console.log('Error init Database: ', err);
    })
})