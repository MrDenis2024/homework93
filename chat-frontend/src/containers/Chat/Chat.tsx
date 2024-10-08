import React, {useEffect, useRef, useState} from 'react';
import {useAppSelector} from '../../app/hooks';
import {selectUser} from '../../store/usersSlice';
import {Navigate} from 'react-router-dom';
import {ChatMessage, OnlineUser} from '../../types';
import dayjs from 'dayjs';

const Chat = () => {
  const user = useAppSelector(selectUser);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [messageText, setMessageText] = useState('');
  const ws = useRef<WebSocket | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      if(!user) return;
      ws.current = new WebSocket('ws://localhost:8000/chat');

      ws.current.onopen = () => {
        ws.current!.send(JSON.stringify({
          type: 'LOGIN',
          payload: user.token,
        }));
      };

      ws.current.onmessage = (event) => {
        const decodedMessage = JSON.parse(event.data);

        if(decodedMessage.type === 'MESSAGES') {
          setMessages(decodedMessage.payload);
        }

        if(decodedMessage.type === 'USERS') {
          setOnlineUsers( [...decodedMessage.payload]);
        }

        if(decodedMessage.type === 'NEW_MESSAGE') {
          setMessages((prevState) => [...prevState, decodedMessage.payload]);
        }
      };

      ws.current.close = () => {
        console.log('WS disconnected');
        ws.current!.send(JSON.stringify({
          type: 'LOGOUT',
        }));
        setTimeout(connectWebSocket, 5000);
      };
    };
    connectWebSocket();

    return () => {
      ws.current?.close();
    };
  }, [user]);

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if(!ws.current) return;

    ws.current.send(JSON.stringify({
      type: 'SEND_MESSAGE',
      payload: messageText,
    }));
    setMessageText('');
  };

  useEffect(() => {
    if (messagesRef.current) {
      const { scrollHeight, clientHeight } = messagesRef.current;
      messagesRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [messages]);


  if(!user) {
    return <Navigate to='/login' />;
  }

  return (
    <div className="d-flex gap-3 mt-5" style={{height: "80vh"}}>
      <div className="w-25 border border-2 rounded-2 border-black d-flex flex-column">
        <h3 className="p-3">Online users</h3>
        <div className="overflow-auto flex-grow-1">
          <ul className="list-group">
            {onlineUsers.map((onlineUser, index) => (
              <li key={index} className="list-group-item">
                {onlineUser.displayName}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='d-flex flex-column flex-grow-1'>
        <div className='border border-2 rounded-2 border-black d-flex flex-column h-75 flex-grow-1'>
          <h3 className='text-center flex-grow-1'>Chat</h3>
          <div className='overflow-auto' ref={messagesRef}>
            <div className='d-flex flex-column flex-grow-1'>
              {messages.map((message, index) => (
                <div key={message._id || index}
                     className='p-2 d-flex border-top justify-content-between align-items-center'>
                  <div className='d-flex'>
                    <span><strong>{message.user.displayName}:</strong></span>
                    <p className="mb-0 ms-3">{message.text}</p>
                  </div>
                  <span>{dayjs(message.datetime).format('DD.MM.YYYY HH:mm')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='mt-4'>
          <form className='border rounded-4 border-2 p-4 d-flex gap-3' onSubmit={sendMessage}>
            <input type="text" className="form-control border-dark" value={messageText}
                   onChange={e => setMessageText(e.target.value)} required/>
            <button type='submit' className='btn btn-success col-2'>Send message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;