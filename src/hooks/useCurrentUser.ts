import { HubPayload } from "@aws-amplify/core";
import { Auth, DataStore, Hub } from "aws-amplify"
import { useEffect, useState } from "react"



interface useAuthResult {
    signedIn: boolean
    name?: string,
    email?: string,
    cognitoId?: string,
    isCommish: boolean,
}




export const useAuth = ():useAuthResult => {
    const[data, setData] = useState<useAuthResult>({signedIn: false, isCommish: false});
    const [mostRecentEvent, setMostRecentEvent] = useState<string>();

    const listener = (data: { payload: HubPayload; }) => {
        
        console.log('A new auth event has happened: ', data.payload.data.username + ' has ' + data.payload.event);
        console.log(data.payload.event)
        setMostRecentEvent(data.payload.event)
    }

    
    useEffect(()=> {
        //setup auth event listener
        Hub.listen('auth', listener);
        return () => Hub.remove("auth", listener)
        
    },[])

    useEffect(()=> {
        
        Auth.currentAuthenticatedUser()
        .then((user) => {
            let {attributes} = user;
            
            let isCommish = user.signInUserSession.accessToken.payload["cognito:groups"].includes("commissioners");
            setMostRecentEvent("signIn")
            setData({
                cognitoId: attributes.sub,
                email: attributes.email,
                name: attributes.preferred_username,
                signedIn: true,
                isCommish,
            })
            DataStore.start();
        })
        .catch(e => 
            {
            console.error(e)
            setData({signedIn:false, isCommish: false})
            })
            
    },[mostRecentEvent])

    return(data)
}