import { DataStore } from "aws-amplify";
import { useEffect, useState } from "react";
import { ZenObservable } from "zen-observable-ts";
import { Rider } from "../models";
import { useAuth } from "./useAuth";
import { useSyncStatus } from "./useSyncStatus";



export const useSignedInRider = (): {riderData: Rider | undefined} => {
    //Query to get the rider data for the currenly logged in user.  
    const [riderData, setRiderData] = useState<Rider>()
    const {signedIn, cognitoId} = useAuth();
    // not sure if the below is needed, might impact performance.  
    const {syncReady} = useSyncStatus();
    let subscription: ZenObservable.Subscription;
    useEffect(() => {
        if (signedIn && cognitoId ) {
            // console.log(`Query for: ${cognitoId}`)
            subscription = DataStore.observeQuery(Rider, r => r.cognitoId('eq', cognitoId))
                .subscribe(snapshot => {
                    // console.log("in rider subscripton: "+JSON.stringify(snapshot))
                    setRiderData(snapshot.items[0])
                })
                return () => subscription.unsubscribe()
        } else {
            setRiderData(undefined)
            return () => subscription? subscription.unsubscribe() : null
        }
         
    }, [cognitoId, signedIn])

    return {riderData}
}