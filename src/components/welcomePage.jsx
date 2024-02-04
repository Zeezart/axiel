import React, { useContext, useState, useEffect } from "react"
import {auth,db} from "../firebase"
import {addDoc, collection,query, onSnapshot,where,orderBy,getDocs, getDoc, updateDoc, doc,arrayUnion} from "firebase/firestore"
import { AuthContext } from "./authContext"
import { useNavigate } from "react-router-dom"

function WelcomePage(){
    //...............defining state..................
    const [joinCommunityInput, setJoinCommunityInput] = useState("")
    const { setCommunities,setUserdata } = useContext(AuthContext)
    const {room, setRoom} = useContext(AuthContext)
    const navigate = useNavigate()

    // //create community
    // const createCommunityRef = collection(db, "users");

    // useEffect(() => {
    //     const queryCommunities = query(
    //         createCommunityRef,
          
    //     );
    //     const unsuscribe = onSnapshot(queryCommunities, (snapshot) => {
    //       let communities = [];
    //       snapshot.forEach((doc) => {
    //         communities.push({ ...doc.data(), id: doc.id });
    //       });
    //       // console.log(messages);
    //       setCommunities(communities);
    //     });

    //     return () => unsuscribe();
    // },[])


    //..................join community.........................
    const usersRef = collection(db, "users")
    const handleJoinCommunity = async (e,uid) => {
        e.preventDefault()
        setRoom(joinCommunityInput)
        if(room === ""){
            alert("Enter community name")
        }else{
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
                console.log(userData)
            //     const usersCollectionRef = collection(db, 'users');
            //     const communityRef = collection(db, "communities")

            //     const querySnapshot2 = await getDocs(usersCollectionRef);

            //     querySnapshot2.forEach( (doc) => {
                    
            //     const documentId = doc.id;
            
            //     console.log(userData.email)
            //     console.log(typeof userData.communities)
            //         if (userData.communities.length > 0){
            //             userData.communities.forEach(async (eachCommunity) => {
            //                 try{
            //                     await addDoc(communityRef, {
            //                         roomName: eachCommunity
            //                     })
            //                 }catch{}
            //             })
            //         }else{
            //             console.log("community not created")
            //         }
            //     });
            //         }else{
            //     console.log('No documents found.');
            // } 
        }
            
               
        }
        
        navigate("/account")
    }

    return(
        <div id="welcome-page">
            <div className="signin-form-container welcome">
                <div >
                </div>
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
                    </form>            
                </div>
                
            </div>
        </div>
    )
}

export default WelcomePage