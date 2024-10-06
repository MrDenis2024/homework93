import express from 'express';
import cors from 'cors';
import config from './config';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import chatRouter from './routes/chat';
import expressWs from 'express-ws';

const app = express();
expressWs(app);
const port = 8000;

app.use(cors(config.corsOptions));
app.use(express.json());
app.use('/users', usersRouter);
app.use('/chat', chatRouter);

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