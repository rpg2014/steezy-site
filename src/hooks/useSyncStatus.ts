import { HubPayload, Hub } from "@aws-amplify/core";
import { useState, useEffect } from "react";






export const useSyncStatus= () => {
    //Sync listener for datastore, so we only query when we have fetched the data.  
    const [syncReady, setSyncReady] = useState(false);
    const listener = (data: {payload: HubPayload}) => {
        if(data.payload.event === 'ready') {
            setSyncReady(true)
        }else if (data.payload.event  === 'syncQueriesStarted') {
            setSyncReady(false);
        }
    } 
    useEffect(()=> {
        Hub.listen('datastore', listener )
        return () => Hub.remove('datastore', listener)
    },[])

    return {
        syncReady,
    }
}