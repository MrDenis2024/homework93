import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import Message from './models/Message';

const run = async () => {
  await mongoose.connect(config.database);
  const db = mongoose.connection;

  try {
    await db.dropCollection('users');
    await db.dropCollection('messages');
  } catch (error) {
    console.log('Skipping drop...');
  }

  const firstUser = new User({
    username: 'den',
    password: 'denpassword',
    displayName: 'Denis K',
  });
  firstUser.generateToken();
  await firstUser.save();

  const secondUser = new User({
    username: 'toxa',
    password: 'toxapassword',
    displayName: 'Anton D',
  });
  secondUser.generateToken();
  await secondUser.save();

  await Message.create({
    user: firstUser,
    text: 'Привет всем',
    datetime: new Date(),
  }, {
    user: secondUser,
    text: 'Как у вас дела?',
    datetime: new Date(),
  });

  await db.close();
}

run().catch(console.error);