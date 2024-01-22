import React, {useState} from "react"
import { collection, query, where, getDocs } from "firebase/firestore";
import {db} from "../firebase"


function SearchUsers(){

    const [username, setUsername] = useState("")
    const [user, setUser] = useState(null)
    const [error, setError] = useState(false)

    const handleSearch = async() => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", username));
        try{
            const querySnapshot = await getDocs(q);
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
            {user && <div>
                <p>{user.email}</p>
            </div>}
        </>
    )
}

export default SearchUsers