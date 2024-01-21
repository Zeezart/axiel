import React from "react"
import { auth } from "../firebase"
import {signOut} from "firebase/auth"

function Account(){
    const logOut = async() => {
        try{
            await signOut(auth)
        }catch{error => {
            console.log(error)
        }}
    }
    return(
        <>
            <h1>WELCOME</h1>
            <button onClick={logOut}>Log Out</button>
        </>
    )
}

export default Account