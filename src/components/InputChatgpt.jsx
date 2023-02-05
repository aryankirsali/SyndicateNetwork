import React, { useContext, useState } from "react"; 
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { v4 as uuid } from "uuid";


const { Configuration, OpenAIApi } = require("openai");

const InputChatgpt = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!text) {
      return;
    }
    setLoading(true);
    setInputDisabled(true);

    const configuration = new Configuration({
      apiKey: "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",
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: text,
      temperature: 0,
      max_tokens: 200,
    });

    const chatId = `${currentUser.uid}chatgpt`;

    await updateDoc(doc(db, "chats", chatId), {
      messages: arrayUnion({
        id: uuid(),
        text,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      }),
    });
  await updateDoc(doc(db, "chats", chatId), {
      messages: arrayUnion({
        id: uuid(),
        text: response.data.choices[0].text,
        senderId: "Chatgpt",
        date: Timestamp.now(),
      }),
    });

    setLoading(false);
    setInputDisabled(false);
    setText("");
  };
  return (
    <div className="input">
      <input
        type="text"
        placeholder="Ask me anything..."
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        value={text}
        disabled={inputDisabled}
      />
      <div className="send">
      {loading ? (
          <div className="loader"></div>
        ) : (
          <button onClick={handleSend}>Send</button>
        )}
      </div>
    </div>
  );
};

export default InputChatgpt;
