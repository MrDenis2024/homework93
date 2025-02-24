import {Model} from 'mongoose';

export interface UserFields {
  username: string;
  password: string;
  displayName: string;
  token: string;
}

export interface UserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

export type UserModel = Model<UserFields, {}, UserMethods>;

export interface IncomingMessage {
  type: string;
  payload: string;
}

export interface OnlineUser {
  token: string;
  displayName: string;
}