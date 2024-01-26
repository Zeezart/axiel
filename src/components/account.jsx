import React, { useContext, useState, useEffect, useRef } from "react"
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
    const {userDetails} = useContext(AuthContext)
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
          // console.log(messages);
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
          user: auth.currentUser.displayName ? auth.currentUser.displayName : userDetails.displayName,
          uid: auth.currentUser.uid
        });
    
        setNewMessage("");
      };

      // const usersRef = collection(db, "users");
      // console.log(usersRef)
    
    const scroll = useRef()
    return(
        <div className="chat-page">
            {/* <h1>WELCOME {currentUser&& currentUser.email}</h1> */}
            <div className="header">
              <h1>KHAYR</h1>
              <button onClick={logOut}>LOG OUT</button>
            </div>

            <div className="all-messages" >
              {messages.map((message) => (
                <div key={message.id} className={`message ${message.uid === auth.currentUser.uid ? 'sent' : 'received'}`}>
                  {message.uid === auth.currentUser.uid ?  null :  <p className="sender-name"><small>{message.user}</small></p>}
                  <div>
                    <span className="user">{message.text}</span> 
                  </div>
                </div>
              ))}

             
    
            </div>
              <div className="input-message-box" scroll={scroll}>
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
              </div>              <div ref={scroll}></div>
        </div>
    )
}

export default Account