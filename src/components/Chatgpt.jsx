import React from "react";
import MessagesChatgpt from "./MessagesChatgpt";
import InputChatgpt from "./InputChatgpt";

const Chatgpt = () => {

  return (
    <div className="chatgpt">
      <div className="chatInfo">
        <span>Virtual Assistant</span>
      </div>
      <MessagesChatgpt />
      <InputChatgpt/>
    </div>
  );
};

export default Chatgpt;
