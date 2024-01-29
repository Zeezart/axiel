import React, { useContext, useState, useEffect } from "react"
import {db} from "../firebase"
import {addDoc, collection,query, onSnapshot,where,orderBy,doc} from "firebase/firestore"
import { AuthContext } from "./authContext"
import { useNavigate } from "react-router-dom"

function WelcomePage(){
    const [joinCommunityInput, setJoinCommunityInput] = useState("")
    const [showInputBox, setShowInputBox] = useState(false)
    const [createCommunityInput, setCreateCommunityInput] = useState("")
    const [communities, setCommunities] = useState([])
    const {room, setRoom} = useContext(AuthContext)

    const handleCommunityChoice = () => {
        setShowInputBox(true)
    }


    //create community
    const createCommunityRef = collection(db, "communities");

    useEffect(() => {
        const queryCommunities = query(
            createCommunityRef,
        //   where("room", "==", room),
        //   orderBy("createdAt")
        );
        const unsuscribe = onSnapshot(queryCommunities, (snapshot) => {
          let communities = [];
          snapshot.forEach((doc) => {
            communities.push({ ...doc.data(), id: doc.id });
          });
          // console.log(messages);
          setCommunities(communities);
        });

        return () => unsuscribe();
    },[])

    const handleCreateCommunity = async () => {
        setJoinCommunityInput(createCommunityInput)
        setRoom(createCommunityInput)
        console.log(createCommunityInput)

        if (createCommunityInput === "") return;
        await addDoc(createCommunityRef, {
          roomName: createCommunityInput,
        //   user: auth.currentUser.displayName ? auth.currentUser.displayName : userDetails.displayName,
        //   uid: auth.currentUser.uid,
        });

        console.log(communities)
    }


    //join community
    const {setInChat} = useContext(AuthContext)
    const navigate = useNavigate()
    const handleJoinCommunity = async () => {
        setRoom(joinCommunityInput)
        setInChat(true)
        navigate("/account")
    }
    return(
        <div className="welcome">
            <h1>WELCOME TO AXIEL</h1>
            <div onClick = {handleCommunityChoice}>
                <h3>Join a community</h3>
                {showInputBox && 
                    <div>
                        <input 
                            type="text"
                            name="join"
                            placeholder="Enter community name"
                            onChange={(e) => setJoinCommunityInput(e.target.value)}
                            value={joinCommunityInput}
                        />
                        <button onClick={handleJoinCommunity}>Join</button>
                    </div>
                }
            </div>

            <div onClick = {handleCommunityChoice}>
                <h3>Create a community</h3>
                {showInputBox && 
                    <div>
                        <input 
                            type="text"
                            name="create"
                            placeholder="Enter community name"
                            onChange={(e) => setCreateCommunityInput(e.target.value)}
                            value={createCommunityInput}
                        />
                        <button onClick={handleCreateCommunity}>Create</button>
                    </div>
                }


            </div>
        </div>
    )
}

export default WelcomePage