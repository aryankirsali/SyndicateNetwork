import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { v4 as uuid } from "uuid";

const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
              onlineUser: true
            });
            
            //create empty user chats on firestore
            const chatId = `${res.user.uid}chatgpt`;
            await setDoc(doc(db, "userChats", res.user.uid), {});
            //create empty user chats on firestore for chatgpt
            await setDoc(doc(db, "chats", chatId), { messages: [] });
            await updateDoc(doc(db, "chats", chatId), {
              messages: arrayUnion({
                id: uuid(),
                text: "Welcome to Syndicate Network! I'm Maverick, your personal assistant, here to help you with anything you need. You can ask me questions, get help with your account, or just say hi!",
                senderId: "Chatgpt",
                date: Timestamp.now(),
              }),
            });
            navigate("/");
          } catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
          }
        });
      });
    } catch (err) {
      setErr(true);
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Syndicate Network</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="display name" />
          <input required type="email" placeholder="email" />
          <input required type="password" placeholder="password" />
          <input required style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button disabled={loading}>Sign up</button>
          {loading && <span className="loadingMessage">Uploading the image please wait...</span>}
          {err && <span className="loadingMessage">Something went wrong</span>}
        </form>
        <p>
          You do have an account? <Link style={{color: "red"}} to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
