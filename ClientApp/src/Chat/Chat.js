import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import './Chat.css';
import ChatWindow from './ChatWindow/ChatWindow';
import ChatInput from './ChatInput/ChatInput';
import { ListViewComponent } from '@syncfusion/ej2-react-lists';

const Chat = () => {
    const [ chat, setChat ] = useState([]);
    const [user, setUser] = useState('');
    const latestChat = useRef(null);

    latestChat.current = chat;

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl('https://localhost:44367/hubs/chat')
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(result => {
                console.log('Connected!');

                connection.on('ReceiveMessage', message => {
                    const updatedChat = [...latestChat.current];
                    updatedChat.push(message);
                
                    setChat(updatedChat);
                });
            })
            .catch(e => console.log('Connection failed: ', e));
    }, []);

    const sendMessage = async (user, message) => {
        const chatMessage = {
            user: user,
            message: message
        };

        try {
            await  fetch('https://localhost:44367/chat/messages', { 
                method: 'POST', 
                body: JSON.stringify(chatMessage),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        catch(e) {
            console.log('Sending message failed.', e);
        }
    }
    function listTemplate(data) {
        const sendertemplate = (<div className="settings">
        <div id="content">
          <div className="name">{data.user}</div>
          <div id="info">{data.message}</div>
        </div>
      </div>);
        const receivertemplate = (<div className="settings">
        <div id="content1">
          <div className="name1">{data.user}</div>
          <div id="info1">{data.message}</div>
        </div>
      </div>);
        return <div>{data.user === user ? sendertemplate : receivertemplate}</div>;
    }
    function btnClick() {
      const value = document.getElementById("inputname").value;
      var message = String(value);
      sendMessage(user, message)
      document.getElementById("inputname").value = "";
  }
    return (
        <div style={{margin: "200px 0 0 0"}}>
            {/* <ChatInput sendMessage={sendMessage} /> */}
            <input value={user} onChange={(e)=>setUser(e.target.value)}/>
            <hr />
            {/* <ChatWindow chat={chat}/> */}
            <ListViewComponent id="List" dataSource={chat} headerTitle="Chat" showHeader={true} template={listTemplate}/>
            <input id="inputname" className="e-input" type="text" placeholder="Type your message"/>

    <button id="btn" onClick={btnClick.bind(this)}>
      Send
    </button>
        </div>
    );
};

export default Chat;
