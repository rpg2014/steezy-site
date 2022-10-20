import { PersistentModel, PersistentModelConstructor, ProducerModelPredicate } from "@aws-amplify/datastore";
import { PredicateAll } from "@aws-amplify/datastore/lib-esm/predicates";
import { DataStore } from "aws-amplify";
import { useEffect, useState } from "react";
import { Season } from "../models";
import { useAsyncAction } from "./useAsyncAction";
import { useAuth } from "./useAuth";

export const useData =<T extends PersistentModel>(type: PersistentModelConstructor<T>, ids: string[] =  []) => {
    const [data, setData] = useState<T[]>();
    const {signedIn } = useAuth()

    useEffect(()=> {
        //@ts-ignore: Works for me, says id as a string is not assignable to some internal type
        DataStore.query(type, c => c.or((c) => ids.reduce((c, id) => c.id('eq', id), c))).then(data => setData(data));
    },[signedIn, ids])

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



export const useCurrentSeason = (): {season: Season | undefined, loading: boolean} => {
    const {data: seasons} = useData(Season)
    let currentSeasonInit;
    if(seasons && seasons.length > 0){
        currentSeasonInit = seasons.find(findSeason)
    }

    useEffect(() => {
        if(seasons) {
            setCurrentSeason(seasons.find(findSeason))
        }
    }, [seasons])

    const [currentSeason, setCurrentSeason] = useState(currentSeasonInit)

    return {season: currentSeason, loading: !seasons }
}
const findSeason = (season: Season) => {
    let startDate = new Date(season.startDate);
    let endDate = new Date(season.endDate)
    const currentDate = new Date();
    
    return currentDate >= startDate && currentDate <= endDate;
}
