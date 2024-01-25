import React, { useContext, useState, useEffect } from "react"
import { auth, db } from "../firebase"
import {signOut} from "firebase/auth"
import { AuthContext } from "./authContext"
import {collection, onSnapshot,orderBy,query,addDoc,serverTimestamp} from "firebase/firestore"
import SearchUsers from "./searchUsers"
 
function Account(){

    const currentUser = useContext(AuthContext)

    const logOut = async() => {
        try{
            await signOut(auth)
        }catch{error => {
            console.log(error)
        }}
    }

    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("");
    const messagesRef = collection(db, "messages");
    // useEffect(() => {
    //     collection(db,"messages").orderBy("createdAt").limit(50).onSnapshot(snapshot => {
    //         setMessages(snapshot.docs.map(doc => doc.data))
    //     })
    // },[])

    useEffect(() => {
        const queryMessages = query(
          messagesRef,
          orderBy("createdAt")
        );
        const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
          let messages = [];
          snapshot.forEach((doc) => {
            messages.push({ ...doc.data(), id: doc.id });
          });
          console.log(messages);
          setMessages(messages);
        });

        return () => unsuscribe();
    },[])

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (newMessage === "") return;
        await addDoc(messagesRef, {
          text: newMessage,
          createdAt: serverTimestamp(),
          user: currentUser.displayName, 
        });
    
        setNewMessage("");
      };

      // const usersRef = collection(db, "users");
      // console.log(usersRef)
    return(
        <div className="chat-page">
            {/* <h1>WELCOME {currentUser&& currentUser.email}</h1> */}
            <div className="header">
              <h1>WELCOME TO KHAYR CHATGROUP</h1>
            </div>

            <div className="all-messages">
              {messages.map((message) => (
                <div key={message.id} className="message">
                  <span className="user">{message.user}:</span> {message.text}
                </div>
              ))}
            </div>

              <div className="input-message-box">
                <form onSubmit={handleSubmit} className="new-message-form">
                  <input
                  type="text"
                  value={newMessage}
                  onChange={(event) => setNewMessage(event.target.value)}
                  className="new-message-input"
                  placeholder="Type your message here..."
                  />
                  <button type="submit" className="send-button">
                  Send
                  </button>
                </form>
              </div>
            
            <button onClick={logOut}>Log Out</button>
        </div>
    )
}

export default Account