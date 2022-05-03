import { DataStore } from "aws-amplify";
import { useEffect, useState } from "react";
import rules from "../../pages/rules";
import { CalcuationEngine } from "../../steezy-wasm/pkg/steezy_wasm";
import { TimePeriod } from "../components/Scoreboard/Scoreboard";
import { EarnedPoint, Rider, RiderLevels, Rule, Season } from "../models";
import { useCurrentSeason, useData } from "./useData";
import { riderLevelToPointsMap } from '../utils/utils';

// const engine = CalcuationEngine.new(rules,ruleScalings,s);

// TODO: make this a real cache
const scoreCache = new Map<string, number>();

//map of time period, to map of rider id to score
// might want to change this to immutable types
type ScoreState = Map<TimePeriod, Map<string, number>>;

//change to ...riders: Rider[]
export const useRiderScores = () => {
    const [timePeriod, setTimePeriod] = useState<TimePeriod>('all')
    const {season} = useCurrentSeason();
    const {data: riders} = useData(Rider);


    // Should this be in a non-react item? or maybe just immutable types?
    const [scoreState, setScoreState] = useState<ScoreState>(new Map())

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
    
    useEffect(()=> {
        //Sums up all of the earned points for a rider for the current time period. 
        const getAllRidersPoints = async () => {
            let map: Map<string, number> = new Map();
            if(riders && season){
                for (const rider of riders) {
                    const riderTotal = await getSumOfPoints(rider.id, rider.riderLevel as RiderLevels, season, timePeriod)
                    
                        map.set(rider.id, riderTotal);
                    
                }
                console.log("setting map for timePeriod: " + timePeriod);
                
                setScoreState( s => new Map(s.set(timePeriod, map)));
                // if(scoreState?.has(timePeriod))
            }
        } 
        getAllRidersPoints();
    },[riders, timePeriod, season, setScoreState])

    // useEffect(()=> {
        // create async function that does calc, and setLoading prior to calling it. 


        // let s = seasons ? seasons : []
        // if(rules && ruleScalings && s && rules.length > 0 && ruleScalings.length >0 ){
        //     console.log(`${JSON.stringify(rules)} | ${JSON.stringify(ruleScalings)}`)
        //     console.log(ruleScalings)
        //     console.log(s)
        
        //     // console.log(engine.get_rule_ids())
        // }
    // },[])

    return {data: scoreState.get(timePeriod), setTimePeriod}

}



const getCacheKey = (start: Date, end: Date, rider: Rider): string => {
    return `${start.toString()}+${end.toString()}+${rider.id}`
}