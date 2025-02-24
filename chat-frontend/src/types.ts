export interface User {
  _id: string;
  username: string;
  displayName: string;
  token: string;
}

export interface RegisterMutation {
  username: string;
  password: string;
  displayName: string;
}

export interface LoginMutation {
  username: string;
  password: string;
}


export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
  message: string;
  name: string;
  _message: string;
}

export interface GlobalError {
  error: string;
}

export interface ChatMessage {
  _id?: string;
  user: {
    _id: string;
    displayName: string;
  };
  text: string;
  datetime: string;
}

export interface OnlineUser {
  token: string;
  displayName: string;
}