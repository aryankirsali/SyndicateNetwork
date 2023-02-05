import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const MessageChatgpt = ({ message }) => {
  const { currentUser } = useContext(AuthContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const timeDifference = (currentTime, messageTime) => {
    const timeDiff = currentTime - messageTime;
    if (timeDiff < 60000) {
      return "just now";
    } else if (timeDiff < 3600000) {
      return Math.floor(timeDiff / 60000) + "m ago";
    } else if (timeDiff < 86400000) {
      return Math.floor(timeDiff / 3600000) + "h ago";
    } else {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(messageTime);
    }
  };

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : "https://firebasestorage.googleapis.com/v0/b/syndicate-network-363ee.appspot.com/o/openai-avatar.png?alt=media&token=e03472e3-117f-4140-abf9-6929d36f4b60"
          }
          alt=""
        />
        <span>
          {message.date
            ? timeDifference(
                Date.now(),
                message.date.seconds * 1000 + message.date.nanoseconds / 1000000
              )
            : ""}
        </span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default MessageChatgpt;
