import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import './Chat.css';
import { ListViewComponent } from '@syncfusion/ej2-react-lists';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { TimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DropDownButtonComponent } from '@syncfusion/ej2-react-splitbuttons';

const Chat = () => {
    const [ chat, setChat ] = useState([]);
    const [user, setUser] = useState('');
    const [control, setControl] = useState('');
    const [dvalue, setdvalue] = useState('');
    const [tvalue, settvalue] = useState('');
    const latestChat = useRef(null);
 
    let items = [
        {
            text: 'Date',
            
        },
        {
            text: 'Time',
            
        }
    ];
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

    const sendMessage = async (user, message ,control,dvalue, tvalue) => {
        const chatMessage = {
            user: user,
            control:control,
            message: message,
            dvalue: dvalue,
            tvalue: tvalue
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
        {data.control === 'Date' && data.control !== '' ? (<div id="datecontent">
            <DatePickerComponent id="datepicker" value={data.dvalue} placeholder="Select date" />
        </div>) : data.control === 'Time' ? (<div  id="timecontent">
        <TimePickerComponent id="timepicker" value={data.tvalue}></TimePickerComponent>
        </div>) : <div style={{display:'none'}}></div>}
      </div>);
        const receivertemplate = (<div className="settings">
        <div id="content1">
          <div className="name1">{data.user}</div>
          <div id="info1">{data.message}</div>
        </div>
        {data.control === 'Date' && data.control !== '' ? (<div id="datecontent1">
            <DatePickerComponent id="datepicker1" placeholder="Select date" change={datechange}/>
        </div>) : data.control === 'Time' ? (<div  id="timecontent1">
        <TimePickerComponent id="timepicker1" change={timechange} ></TimePickerComponent>
        </div>) : <div style={{display:'none'}}></div>}
      </div>);
        return <div>{data.user === user ? sendertemplate : receivertemplate}</div>;
    }
    function btnClick() {
      const value = document.getElementById("inputname").value;
      var message = String(value);
      sendMessage(user, message,control,dvalue,tvalue)
      setControl('');
      document.getElementById("inputname").value = "";
  }

    function onSelect(args) {
      var value = String(args.item.text);
      setControl(value);
   }

   function datechange(){
     var message = document.getElementById('datepicker1').value;
     var dvalue = message;
     sendMessage(user, message,control,dvalue,tvalue)
   }

   function timechange(){
       var message =  document.getElementById('timepicker1').value;
       var tvalue = message;
       sendMessage(user, message,control,dvalue,tvalue)
   }

    return (
        <div style={{margin: "80px 0 0 20px", width:"400px"}}>
            <h4>Please enter name here:</h4>
            <input value={user} onChange={(e)=>setUser(e.target.value)}/>
            <hr />
            <ListViewComponent id="List" dataSource={chat} headerTitle="Chat" showHeader={true} template={listTemplate}/>
            <input id="inputname"  style={{width:"250px"}} className="e-input" type="text" placeholder="Type your message"/>

           <ButtonComponent id="btn" onClick={btnClick.bind(this)}>
           Send
           </ButtonComponent>
           <DropDownButtonComponent id='ddnlist' items={items} select={onSelect}>+</DropDownButtonComponent>
        </div>
    );
};

export default Chat;
