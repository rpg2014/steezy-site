import { PersistentModel, PersistentModelConstructor } from "@aws-amplify/datastore";
import { DataStore } from "aws-amplify";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

export const useData =<T extends PersistentModel>(type: PersistentModelConstructor<T>) => {
    const [data, setData] = useState<T[]>();
    const {signedIn } = useAuth()
    useEffect(()=> {
        DataStore.query(type).then(data => setData(data));
    },[signedIn])

    return {data}
}

export const useUpdatingData=<T extends PersistentModel>(type: PersistentModelConstructor<T>) => {
    const [data, setData] = useState<T[]>();
    const [isSynced, setIsSynced] = useState<boolean>(false);
    const {signedIn } = useAuth()
    useEffect(()=> {
        let subscription = DataStore.observeQuery(type).subscribe(snapshot => {
            // console.log("in subscription: "+snapshot)
            setData(snapshot.items)
            setIsSynced(snapshot.isSynced)
        });
        return () => subscription.unsubscribe()
    },[signedIn])

    return {data, isSynced}
}

