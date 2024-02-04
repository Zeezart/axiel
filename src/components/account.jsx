import React, { useContext, useState, useEffect, useRef } from "react"
import { auth, db } from "../firebase"
import {signOut} from "firebase/auth"
import { AuthContext } from "./authContext"
import {collection, onSnapshot,orderBy,query,addDoc,serverTimestamp,where, deleteDoc, doc, updateDoc, getDoc} from "firebase/firestore"
import { FaElementor, FaEllipsisH, FaBars, FaTimes } from "react-icons/fa"
import SearchUsers from "./searchUsers"
 
function Account(){

    const currentUser = useContext(AuthContext)
    const {room} = useContext(AuthContext)

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
    const {communities} = useContext(AuthContext)

    // console.log(communities)

    useEffect(() => {
        const queryMessages = query(
          messagesRef,
          where("room", "==", room),
          orderBy("createdAt")
        );

        const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
          console.log('New messages')
          let messages = [];
          snapshot.forEach((doc) => {
            messages.push({ ...doc.data(), id: doc.id });
          });
          // console.log(messages);
          setMessages(messages);
          console.log(messages.text)
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
          uid: auth.currentUser.uid,
          room
        });
    
        setNewMessage("");
      };

    const scroll = useRef()
    const [showSidebar, setShowSidebar] = useState(false)
    const handleShowSidebar = () => {
      setShowSidebar(!showSidebar)
    }
    return(
      <div id="account">
          <div className={`sidebar ${showSidebar ? 'open-sidenav' : ''}`}>
            <div className="sidebar-header"><p>Your Communities</p></div>
            <div className="your-communities">
            {communities.map((community) => (
                <p>{community.roomName}</p>
            ))}
        
            
            </div>
            <div className="account-nav">
              
              <p>Your Profile</p>
              <p onClick={logOut}>Log Out</p>
            </div>
          </div>
          <div className="chat-page">
              <div className="header">
                <h1>{room}</h1>
                <div className = "sidebar-icon" onClick={handleShowSidebar}>
                  {showSidebar ? <FaTimes   /> : <FaBars />}
                </div>
              </div>

              <div className="all-messages" >
                {messages.map((message,index) => (
                  !message.deleted && (<div key={message.id} className={`message ${message.uid === auth.currentUser.uid ? 'sent' : 'received'}`}>
                    <div style={{display: "flex", justifyContent:"space-between", alignItems: "center", gap:"2rem"}}>
                      {message.uid === auth.currentUser.uid ?  null :  <p className="sender-name"><small>{message.user}</small></p>}
                    </div>
                      
                    <div>
                      <span className="user">{message.text}</span> 
                    </div>
                  </div>)
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
      </div>
    )
}


export default Account


// // const userId = auth.currentUser.uid;
// const userDocRef = collection(db, 'users');

// const querySnapshot = await getDocs(userDocRef);

// // Iterate over each document and retrieve its ID
// querySnapshot.forEach((doc) => {
//   // Access the document ID
//   const documentId = doc.id;
//   console.log('Document ID:', documentId);

//   // Access other data in the document
//   const userData = doc.data();
//   console.log('User Data:', userData);
// });