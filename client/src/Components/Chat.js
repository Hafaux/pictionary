import { useEffect } from 'react';
import '../css/Chat.css';
import { useState, useRef } from 'react';
import ChatMessage from './ChatMessage';
// import twemoji from 'twemoji';

function Chat({ socket }) {
    const [ messages, setMessages ] = useState([]);
    const messagesEndRef = useRef(null);
    const chatMessages = useRef(null);

    function scrollToBottom() {
        messagesEndRef.current.scrollIntoView();
    }

    useEffect(() => {
        console.log('chatmessages update');
        scrollToBottom();
        // twemoji.parse(chatMessages.current);
    }, [messages]);

    useEffect(() => {
        function onChatMessage(msg) {
            setMessages((prevMessages) => {
                if (prevMessages.length >= 100) {
                    prevMessages.shift()
                    // prevMessages = prevMessages.slice(1);
                };
                return [...prevMessages, msg]
            });
        }
        
        socket.on('chatMessage', onChatMessage);

        return () => {
            socket.off('chatMessage');
        }
    }, []);
    
    const msgs = () =>{
        const arr = messages.map((msg, index) => {
            return (
                <ChatMessage key={index} msg={msg} />
            )
        });
        console.log(arr);
        return arr; 
    } 

    function handleInput(e) {
        e.preventDefault();

        const chatInput = document.querySelector('#chatInput');
        const chatMessage = chatInput.value;

        if (chatMessage !== '') {
            chatInput.value = '';
            socket.emit('chatMessage', chatMessage);
        }
    }

    return (
        <div className="chatContainer">
                <ul className="chatMessages" ref={chatMessages}>
                    {msgs()}
                    <div ref={messagesEndRef} />
                </ul>
            <form onSubmit={handleInput}>
                <input 
                    placeholder="Send a guess or chat" 
                    id="chatInput" 
                    type="text"
                    autoComplete="off"
                    maxLength="128"
                ></input>
            </form>
        </div>
    )
}

export default Chat;