import { doc, onSnapshot, collection,
  query,
  where, } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

const Chats = () => {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    const getOnlineUsers = () => {
      const unsub = onSnapshot(
        query(collection(db, "users"), where("onlineUser", "==", true)),
        (snapshot) => {
          const users = [];
          snapshot.forEach((doc) => {
            users.push(doc.data());
          });
          setOnlineUsers(users);
        }
      );
      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
    currentUser.uid && getOnlineUsers();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <div className="chats">
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => (
          <div
            className="userChat"
            key={chat[0]}
            onClick={() => handleSelect(chat[1].userInfo)}
          >
            <img src={chat[1].userInfo.photoURL} alt="" />
            <div className="userChatInfo">
              <span>{chat[1].userInfo.displayName}</span>
              <span className={onlineUsers.find((user) => user.uid === chat[1].userInfo.uid) ? "online-status" : "offline-status"}>
                {onlineUsers.find((user) => user.uid === chat[1].userInfo.uid)
                  ? "Online"
                  : "Offline"}
              </span>
              <p>
                {chat[1].lastMessage?.text
                  ? chat[1].lastMessage.text.substr(0, 30) +
                    (chat[1].lastMessage.text.length > 20 ? "..." : "")
                  : "No chats"}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Chats;
