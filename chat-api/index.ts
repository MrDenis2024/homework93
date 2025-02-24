import express from 'express';
import cors from 'cors';
import config from './config';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import expressWs from 'express-ws';
import {WebSocket} from 'ws';
import {IncomingMessage, OnlineUser} from './types';
import User from './models/User';
import Message from './models/Message';

const app = express();
expressWs(app);
const port = 8000;

app.use(cors(config.corsOptions));
app.use(express.json());
app.use('/users', usersRouter);

const chatRouter = express.Router();

const connectedClients: WebSocket[] = [];
const onlineUsers: OnlineUser[] = [];

chatRouter.ws('/chat',  (ws, req) => {
  let token: string | null = null;

  ws.on('message', async (message) => {
    try {
      const decodedMessage = JSON.parse(message.toString()) as IncomingMessage;
      if(decodedMessage.type === 'LOGIN') {
        token = decodedMessage.payload;
        const user = await User.findOne({token});
        if(!user) {
          ws.send(JSON.stringify({type: 'ERROR', payload: 'Wrong token'}));
          ws.close();
          return;
        }

        connectedClients.push(ws);
        onlineUsers.push({token: user.token, displayName: user.displayName});

        const messages = await Message.find().sort({datetime: 1}).limit(30).populate('user', 'displayName');
        ws.send(JSON.stringify({type: 'MESSAGES', payload: messages}));
        connectedClients.forEach((clientsWs) => {
          clientsWs.send(JSON.stringify({type: 'USERS', payload: onlineUsers}));
        });
      }

      if(decodedMessage.type === 'SEND_MESSAGE') {
        const user = await User.findOne({token});

        if(!user) {
          ws.send(JSON.stringify({type: 'ERROR', payload: 'Wrong token'}));
          ws.close();
          return;
        }
        const datetime = new Date();

        const newMessage = new Message({
          user: user._id,
          text: decodedMessage.payload,
          datetime,
        });
        await newMessage.save();

        connectedClients.forEach((clientWS) => {
          clientWS.send(JSON.stringify({
            type: 'NEW_MESSAGE',
            payload: {
              user: {
                _id: user._id,
                displayName: user.displayName,
              },
              text: decodedMessage.payload,
              datetime,
            },
          }));
        });
      }

      if(decodedMessage.type === 'LOGOUT') {
        const userIndex = onlineUsers.findIndex(onlineUser => onlineUser.token === token);
        onlineUsers.splice(userIndex, 1);
        const index = connectedClients.indexOf(ws);
        connectedClients.splice(index, 1);

        connectedClients.forEach((clientsWs) => {
          clientsWs.send(JSON.stringify({type: 'USERS', payload: onlineUsers}));
        });
      }
    } catch (error) {
      ws.send(JSON.stringify({type: 'ERROR', payload: 'Invalid message'}));
    }
  });

  ws.on('close', () => {
    const userIndex = onlineUsers.findIndex(onlineUser => onlineUser.token === token);
    onlineUsers.splice(userIndex, 1);
    const index = connectedClients.indexOf(ws);
    connectedClients.splice(index, 1);

    connectedClients.forEach((clientsWs) => {
      clientsWs.send(JSON.stringify({type: 'USERS', payload: onlineUsers}));
    });
  });
});

app.use(chatRouter);

const run = async () => {
  await mongoose.connect(config.database);

  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
};

run().catch(console.error);