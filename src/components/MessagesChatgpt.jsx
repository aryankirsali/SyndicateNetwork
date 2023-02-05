import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import MessageChatgpt from "./MessageChatgpt";

const MessagesChatgpt = () => {
  const [messages, setMessages] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  console.log(data, "data")
  const chatId = `${currentUser.uid}chatgpt`;

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  console.log(messages)

  return (
    <div className="messages">
      {messages.map((m) => (
        <MessageChatgpt message={m} key={m.id} />
      ))}
    </div>
  );
};

export default MessagesChatgpt;
