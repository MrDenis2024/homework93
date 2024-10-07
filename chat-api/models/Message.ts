import mongoose, {Types} from 'mongoose';
import User from './User';

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => {
        const user = await User.findById(value);
        return Boolean(user);
      },
      message: 'User does not exist',
    },
  },
  text: {
    type: String,
    required: true,
  },
  datetime: {
    type: Date,
    required: true,
  },
});

const Message = mongoose.model('Message', MessageSchema);

export default Message;