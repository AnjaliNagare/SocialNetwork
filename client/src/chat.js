import { useState, useEffect } from "react";

import io from "socket.io-client";

let socket;

// lazy initialise pattern!
const connect = () => {
    if (!socket) {
        socket = io.connect();
    }
    return socket;
};

const disconnect = () => (socket = null);

export default function Chat() {
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        const socket = connect();
        function onRecentMessages(incomingMessages) {
            setChatMessages(() => {
                return incomingMessages;
            });
        }

        function onBroadcastMessage(message) {
            setChatMessages((prevChatMessages) => {
                return [...prevChatMessages, message];
            });
        }

        socket.on("recentMessages", onRecentMessages);
        socket.on("broadcastMessage", onBroadcastMessage);

        // cleanup function returned from useEffect
        return () => {
            socket.off("recentMessages", onRecentMessages);
            socket.off("broadcastMessage", onBroadcastMessage);
            disconnect();
        };
    }, []);

    console.log("chatmessages", chatMessages);
    function onSubmit(event) {
        console.log("click");
        event.preventDefault();
        const socket = connect();
        // emit the right socket event and send the right info
        const newMessage = event.target.message.value;
        
        console.log("newMessage" ,newMessage);
        socket.emit("sendMessage", newMessage);
        event.target.message.value = "";
    }

    return (
        <section className="chat">
            <h2>Chat</h2>
            <ul className="messages">
                {chatMessages.map((chatMessage) => (
                    <li key={chatMessage.message_id}>
                        <div>
                            <p>{chatMessage.first_name}:</p>

                            <p>
                                {chatMessage.message}{" "}{chatMessage.created_at}
                            </p>
                            <img
                                className="chat-img"
                                src={chatMessage.profile_picture_url}
                            />
                        </div>
                    </li>
                ))}
            </ul>
            <form onSubmit={onSubmit}>
                <textarea
                    name="message"
                    rows={1}
                    placeholder="Write your message..."
                    required
                ></textarea>
                <button>Send</button>
            </form>
        </section>
    );
}
