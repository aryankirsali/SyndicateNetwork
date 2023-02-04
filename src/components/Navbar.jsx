import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const handleLogout = async () => {
    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        onlineUser: false,
      });
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="navbar">
      <span className="logo">Syndicate Network</span>
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span>{currentUser.displayName}</span>
        <button onClick={handleLogout}>logout</button>
      </div>
    </div>
  );
};

export default Navbar;
