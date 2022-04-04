import { DataStore } from "aws-amplify";
import { useEffect, useState } from "react";
import { Rider } from "../models";
import { useAuth } from "./useAuth";
import { useSyncStatus } from "./useSyncStatus";



export const useSignedInRider = (): {riderData: Rider | undefined} => {
    //Query to get the rider data for the currenly logged in user.  
    const [riderData, setRiderData] = useState<Rider>()
    const {signedIn, cognitoId} = useAuth();
    // not sure if the below is needed, might impact performance.  
    const {syncReady} = useSyncStatus();
    useEffect(() => {
        if (signedIn && cognitoId ) {
            // console.log(`Query for: ${cognitoId}`)
            DataStore.query(Rider, r => r.cognitoId('eq', cognitoId))
                .then(riders => {
                    // console.log(`saving riders: ${JSON.stringify(riders)}`)
                    setRiderData(riders[0])

                }).catch(console.error);
        } else {
            setRiderData(undefined)
        }

    }, [cognitoId, signedIn, syncReady])

    return {riderData}
}