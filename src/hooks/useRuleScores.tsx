import { DataStore } from "aws-amplify";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import rules from "../../pages/rules";
import { CalcuationEngine } from "../../steezy-wasm/pkg/steezy_wasm";
import { TimePeriod } from "../components/Scoreboard/Scoreboard";
import { EarnedPoint, Rider, RiderLevels, Rule, Season } from "../models";
import { useCurrentSeason, useData } from "./useData";
import { riderLevelToPointsMap } from '../utils/utils';
import internal from "stream";

// const engine = CalcuationEngine.new(rules,ruleScalings,s);

//map of time period, to map of rider id to score
type ScoreState = Map<TimePeriod, Map<string, number>>;

type ScoreContext = {
    scoresByRiderId: Map<string, number> | undefined;
    currentTimePeriod: TimePeriod
    setTimePeriod: (period: TimePeriod) => void;
    loadingPercent: number;
}

const scoreContext = createContext<ScoreContext>(
    {scoresByRiderId: new Map(), 
    setTimePeriod: () => {}, 
    loadingPercent: 0,
    currentTimePeriod: 'all'
});

export const ProvideScore = ({children}: {children: React.ReactNode}) => {
    const contextValue = useProvideRiderScores();
    return <scoreContext.Provider value={contextValue}>{children}</scoreContext.Provider>
}


export const useRiderScores = (): ScoreContext => {

    return useContext(scoreContext);
}




// Get a single riders points. 
const getSumOfPoints = async (riderId: string, riderLevel: RiderLevels, season: Season, timePeriod: TimePeriod): Promise<number> => {
    // first gets  all of the earned points for current rider
    let ridersEarnedPoints = await DataStore.query(EarnedPoint, c=> c.riderID('eq', riderId).seasonID('eq',season.id))

    // filter earned rules by the time period
    // We just check the month right now
    if(timePeriod !== 'all'){
        ridersEarnedPoints = ridersEarnedPoints.filter(point=> new Date(point.date).getMonth() === Number.parseInt(timePeriod))
    }
    // then map that list of earned POints to rules, so we can get the points per rule
    let ruleListForEarnedPointsPromise = ridersEarnedPoints.map(point=> DataStore.query(Rule, r => r.id('eq', point.ruleID)).then(rules=> {
        if(rules.length !== 1){
            console.log('something is broken');
        }
        return rules[0];
    }))
    // await the promise due to the return type of Datastore, could combine with above line.
    let rules = await Promise.all(ruleListForEarnedPointsPromise)
    // sum them up
    let sum = 0; //@ts-ignore: the rider level is gonna be in the level points map
    rules.forEach(rule => sum = sum + Number.parseInt(rule.levelPointsMap[riderLevelToPointsMap.get(riderLevel)]))
    // return sum for rider
    return sum;
}





//change to ...riders: Rider[]
//Gets the scores of all riders for a current time period?
export const useProvideRiderScores = () => {
    const [timePeriod, setTimePeriod] = useState<TimePeriod>('all')
    const {season} = useCurrentSeason();
    const {data: riders} = useData(Rider);
    const [loadingPercent, setLoadingPercent] = useState(1);
    const [scoreState, setScoreState] = useState<ScoreState>(new Map())

    useEffect(()=> {
        //Sums up all of the earned points for a rider for the current time period. 
        const getAllRidersPoints = async () => {
            let map: Map<string, number> = new Map();
            if(riders && season){
                setLoadingPercent(0);
                let index = 0;
                for (const rider of riders) {
                    index++;
                    const riderTotal = await getSumOfPoints(rider.id, rider.riderLevel as RiderLevels, season, timePeriod)
                        map.set(rider.id, riderTotal);
                    setLoadingPercent((index / riders.length) * 100)
                }
                setLoadingPercent(100);
                setScoreState( s => new Map(s.set(timePeriod, map)));
            }
        } 
        getAllRidersPoints();
    },[riders, timePeriod, season, setScoreState])

    return {scoresByRiderId: scoreState.get(timePeriod), setTimePeriod, loadingPercent, currentTimePeriod: timePeriod}
}
