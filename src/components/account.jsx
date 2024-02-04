import React, { useContext, useState, useEffect, useRef } from "react"
import { auth, db } from "../firebase"
import {signOut} from "firebase/auth"
import { AuthContext } from "./authContext"
import {collection, onSnapshot,orderBy,query,addDoc,serverTimestamp,where, deleteDoc, doc, updateDoc, getDoc} from "firebase/firestore"
import { FaBars, FaTimes } from "react-icons/fa"
import SearchUsers from "./searchUsers"
 
function Account(){
    //................defining states........................
    const currentUser = useContext(AuthContext)
    const {room, setRoom} = useContext(AuthContext)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("");
    const messagesRef = collection(db, "messages");
    const {userDetails} = useContext(AuthContext)
    const {userdata} = useContext(AuthContext)


    //................handling logout.................................
    const logOut = async() => {
        try{
            await signOut(auth)
        }catch{error => {
            console.log(error)
        }}
    }

    //...............handling community selection in sidebar...................
    const handleCommunitySelection = (community) => {
      return () => {
        setRoom(community);
      };
    }


    //...............manging changes based on room change...........................
    useEffect(() => {
        const queryMessages = query(
          messagesRef,
          where("room", "==", room),
          orderBy("createdAt")
        );

        const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
          let messages = [];
          snapshot.forEach((doc) => {
            messages.push({ ...doc.data(), id: doc.id });
          });
          
          setMessages(messages);
        });

        return () => unsuscribe();
    },[room])


    //......................handling send message....................
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

    //.............handling display sidebarn mobile...........................
    const [showSidebar, setShowSidebar] = useState(false)
    const handleShowSidebar = () => {
      setShowSidebar(!showSidebar)
    }

   //........................page display..........................
    return(
      <div id="account">
          <div className={`sidebar ${showSidebar ? 'open-sidenav' : ''}`}>
            <div className="sidebar-header"><p>Your Communities</p></div>
            <div className="your-communities" >
                {userdata && userdata.communities.map((community)=>(
                    <div className="community" key={community} onClick={handleCommunitySelection(community)}>{community}</div>
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
                  (<div key={message.id} className={`message ${message.uid === auth.currentUser.uid ? 'sent' : 'received'}`}>
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
