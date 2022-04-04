import { useEffect, useState } from "react";
import rules from "../../pages/rules";
import { CalcuationEngine } from "../../steezy-wasm/pkg/steezy_wasm";
import { Rider } from "../models";
import { useData } from "./useData";

// const engine = CalcuationEngine.new(rules,ruleScalings,s);

// TODO: make this a real cache
const scoreCache = new Map<string, number>();


//change to ...riders: Rider[]
const useRuleScores = (startDate: Date, endDate: Date, riders: Rider) => {

    let initalData;
    // first check cache
    if(scoreCache.has(getCacheKey(startDate, endDate, riders))) {
        initalData = (scoreCache.get(getCacheKey(startDate, endDate, riders)))
    }

    
    

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<number | undefined>(initalData)

    

    useEffect(()=> {
        

        // create async function that does calc, and setLoading prior to calling it. 


        // let s = seasons ? seasons : []
        // if(rules && ruleScalings && s && rules.length > 0 && ruleScalings.length >0 ){
        //     console.log(`${JSON.stringify(rules)} | ${JSON.stringify(ruleScalings)}`)
        //     console.log(ruleScalings)
        //     console.log(s)
        
        //     // console.log(engine.get_rule_ids())
        // }
    },[])

    return {data, loading}

}



const getCacheKey = (start: Date, end: Date, rider: Rider): string => {
    return `${start.toString()}+${end.toString()}+${rider.id}`
}