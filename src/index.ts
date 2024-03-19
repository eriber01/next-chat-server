import 'dotenv/config'

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import AppDataSource from "../config/data-source";
import { onSaveChats } from './modules/Chats/actions';
import { onSaveChatI } from './modules/Chats/interface';
const app = express()

import { createClient } from "redis";
import { getChannelsForUser } from './modules/Channels/actions';


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
    //send and get the created message
    socket.on('send-message', async (message: onSaveChatI) => {
      console.log({ message });

      const client = await createClient(/* {
        url: 'redis://alice:foobared@awesome.redis.server:6379'
      } */)
        .on('error', err => console.log('Error init Redis: ', err))
        .connect();

      const chat = {
        "message": "ready",
        "userId": 1,
        "channelId": 7,
        "id": 8,
        "createdAt": "2024-03-19T16:50:33.386Z",
        "updatedAt": "2024-03-19T16:50:33.386Z"
      }//await onSaveChats(message)

      // await client.del('message')
      // await client.rPush('message', JSON.stringify(chat))
      const res = await (await client.lRange('message', 0, -1)).map(item => JSON.parse(item))

      // await client.set('message', 'chat')
      console.log({ chat, res });
      socket.emit('send-message', res)
    })

    //get all message for the chanel
    socket.on('get-all-channels', async (data: onSaveChatI) => {
      const channels = await getChannelsForUser(data.userId)

      console.log({ channels });
      socket.emit('get-all-channels', channels)
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