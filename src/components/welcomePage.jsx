import React, { useContext, useState, useEffect } from "react"
import {auth,db} from "../firebase"
import {addDoc, collection,query, limit, onSnapshot,where,orderBy,getDocs, getDoc, updateDoc, doc,arrayUnion} from "firebase/firestore"
import { AuthContext } from "./authContext"
import { useNavigate } from "react-router-dom"

function WelcomePage(){
    //...............defining state..................
    const [joinCommunityInput, setJoinCommunityInput] = useState("")
    const { setCommunities,setUserdata, communities } = useContext(AuthContext)
    const {room, setRoom} = useContext(AuthContext)
    const navigate = useNavigate()

   
    //................setting community data....................
    useEffect(() => {
        const communityData = async () => {
            const data = await fetchCommunities(20)
            setCommunities(data)
        }
        communityData()
    },[])


    //..................join community.........................
    const usersRef = collection(db, "users")
    const handleJoinCommunity = async (e,uid) => {
        e.preventDefault()
        setRoom(joinCommunityInput)
        if(room === ""){
            alert("Enter community name")
        }else{
            //..............................checking if the current users list of community...................................
            const userEmail = auth.currentUser.email;

            // Create a query to find the document with the specified email
            const q = query(collection(db, 'users'), where('email', '==', userEmail));

            // Execute the query
            const querySnapshot = await getDocs(q);

            // Check if any documents match the query
            if (querySnapshot.size > 0) {
                // Access the first document in the result set
                const firstDoc = querySnapshot.docs[0]
                const documentId = firstDoc.id
                // Access other data in the document
                const userData = firstDoc.data()

                //not get the document and add the community to it
                const userDocRef = doc(db, 'users', documentId);

                // Assuming 'communityToAdd' is the element you want to add to the array
                const communityToAdd = room;

                // Update the array field in the document
                try {
                    await updateDoc(userDocRef, {
                    communities: arrayUnion(communityToAdd),
                    });

                } catch (error) {
                    console.error('Error adding element to the array:', error);
                }
                setUserdata(userData)
            }

            //..............navigating to chat page when conditions are met..................
            navigate("/account")   


            //..................checking list of existing communities........................ 
            const communityRef = collection(db, "communities")
            const qry = query(collection(db,"communities"), where("roomName","==",room.toLowerCase()))
            const queryCommunity = await getDocs(qry)
        

            if (queryCommunity.size > 0){
                return
            }else{
                try{
                    await addDoc(communityRef, {
                        roomName: room.toLowerCase()
                    })
                }catch (error) {
                    console.log(error)
                }
            } 
        }
    }

    //...............getting the list of existing communities to be displayed....................
    const fetchCommunities = async (limitCount) => {
        const communityRef = collection(db, "communities")
        const communityQuery = query(communityRef, limit(limitCount))
        const getCommunity = await getDocs(communityQuery)
        const communityList = getCommunity.docs.map(doc => ({
            id: doc.id, ...doc.data()
        }))
        return communityList
    }

    //...................entering selected community chat room from thee list of displayed communities..................
    const selectCommunity = (event) => {
        const communityName = event.target.textContent
        console.log(communityName)
        setRoom(communityName)
        navigate("/account")
    }


    //..........................displaying web content...............................
    return(
        <div id="welcome-page">
            <div className="signin-form-container welcome">
                
                <div className="form-div">
                    <h1>WELCOME TO AXIEL</h1>
                    <form onSubmit={handleJoinCommunity} className="each-welcome-option">
                        <h3>Join a community</h3>
                            <div className="input-div">
                                <input 
                                    type="text"
                                    name="join"
                                    placeholder="Enter community name"
                                    onChange={(e) => setJoinCommunityInput(e.target.value)}
                                    value={joinCommunityInput}
                                />
                            </div>
                            <button type="submit" className="primary-btn">Join</button>
                            
                            {communities.length > 0 ? <div>
                                <p style={{textAlign: "left", marginBottom:"1rem", color: "#00A3FF"}}><small>Suggested Communities</small></p>
                                <div className="all-community-div">
                                    {communities.map(community => (
                                        <div key={community.id} className = "each-community-displayed" onClick={selectCommunity}>
                                            <p id="community-name">{community.roomName}</p>
                                        </div>
                                    )   
                                    )}
                                </div>
                            </div> : <p>Loading communities suggestions...</p>}
                    </form>            
                </div>
                
            </div>
        </div>
    )
}

export default WelcomePage