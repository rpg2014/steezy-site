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

