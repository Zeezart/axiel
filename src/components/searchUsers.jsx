import React, {useState, useContext} from "react"
import { collection, query, where, getDoc, setDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"
import {AuthContext} from "./authContext"


function SearchUsers(){

    const [username, setUsername] = useState("")
    const [user, setUser] = useState(null)
    const [error, setError] = useState(false)

    const currentUser = useContext(AuthContext)
    const handleSearch = async() => {
        c
        const q = query(usersRef, where("displayName", "==", username));
        try{
            const querySnapshot = await getDoc(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data())
            });
        }catch{err =>{
            setError(true)
        }}        
    }

    const handleKeyDown = (e) => {
        e.code === "Enter" && handleSearch()
    }

    const handleSelectChat = async() => {
        const combinedId = currentUser?.uid > user.uid 
            ? currentUser?.uid + user.uid 
            : user.uid + currentUser?.uid
        // console.log(combinedId) this is working
        try{
        const res = await getDoc(doc(db,"chats", combinedId))
        if(!res.exists()){
            await setDoc(doc(db,"chats", combinedId),{messages:[]})
            await updateDoc(doc(db,"usersChat", currentUser.uid),{
                [combinedId+"userInfo"]:{
                    uid:user.uid,
                    displayName: user.displayName
                },
                [combinedId + ".date"]:serverTimestamp()
            })

            await updateDoc(doc(db,"usersChat", user.uid),{
                [combinedId+"userInfo"]:{
                    uid:currentUser.uid,
                    displayName: currentUser.displayName
                },
                [combinedId + ".date"]:serverTimestamp()
            })
        }
        }catch{error => console.log(error)}
        console.log("selected")
        }
    
    return(
        <>
            <input 
                type="text"
                placeholder="Find friends..."
                onChange = {(e) => setUsername(e.target.value)}
                onKeyDown= {handleKeyDown}
            />
            <button onClick={handleSearch}>Search</button>
            {error && <p>user not found</p>}
            {user && <div onClick={handleSelectChat}>
                <p>{user.displayName}</p>
            </div>}
        </>
    )
}

export default SearchUsers