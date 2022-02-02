import { HubPayload } from "@aws-amplify/core";
import { Auth, DataStore, Hub } from "aws-amplify"
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react"



interface useAuthResult {
    signedIn: boolean
    name?: string,
    email?: string,
    cognitoId?: string,
    isCommish: boolean,
}


const authContext = createContext<useAuthResult>({signedIn: false, isCommish: false});

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }: {children: React.ReactNode}) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
  }

  // Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
    return useContext(authContext);
  };

export const useProvideAuth = ():useAuthResult => {
    const[data, setData] = useState<useAuthResult>({signedIn: false, isCommish: false});
    const [mostRecentEvent, setMostRecentEvent] = useState<string>();

    const listener = (data: { payload: HubPayload; }) => {
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
            if(user === null) {
                setData({signedIn: false, isCommish: false})
                return ;
            }
            let {attributes} = user;
            
            let isCommish = user.signInUserSession.accessToken.payload["cognito:groups"]?.includes("commissioners");
            setMostRecentEvent("signIn")
            setData({
                cognitoId: attributes.sub,
                email: attributes.email,
                name: attributes.preferred_username,
                signedIn: true,
                isCommish,
            })
            // if(data.signedIn === false) {
            //     DataStore.start();
            // }
            
        })
        .catch(e => {
            console.error(e)
            setData({signedIn:false, isCommish: false})
        })
            
    },[mostRecentEvent])

    return(data)
}



export function useRequireCommish(redirectUrl = "/") {
    const auth = useAuth();
    const router = useRouter();
    const [firstRender,setFirstRender] = useState(true);
    // If auth.user is false that means we're not
    // logged in and should redirect.
    useEffect(() => {
        setFirstRender(false)
      if (auth.isCommish === false && !firstRender) {
        router.back();
      }
    }, [auth, router, firstRender]);
  
    return auth;
}