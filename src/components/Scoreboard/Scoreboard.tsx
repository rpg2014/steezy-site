
import { DataStore } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentSeason, useData } from '../../hooks/useData';
import { EarnedPoint, Rider, RiderLevels, Rule } from '../../models'
import { combineStyles } from '../../utils/utils';
import styles from './Scoreboard.module.scss'

import {useRiderScores } from '../../hooks/useRuleScores';

export type TimePeriod = "all"  | '12' | '1' | '2' | '3' | '4';

export const ScoreboardList = () => {
    const {data: riders} = useData(Rider);
    const {signedIn} = useAuth();
    const {season} = useCurrentSeason();
    const{data: scoreDataForTimePeriod, setTimePeriod} = useRiderScores();

    // const [timePeriod, setTimePeriod] = useState<TimePeriod>('all')

    

    if(!signedIn) {
        return <Alert variant='secondary' >Logging In?</Alert>
    }
    if(!season) {
        return <h2 className={styles.container} style={{paddingTop: '5rem'}}>The season hasn't started yet, come back later!</h2>
    }
    if(!scoreDataForTimePeriod){
        return <>
        <h2>Loading Scores... </h2>
        <Spinner  style={{marginTop: '2rem'}} animation={'border'} />
        </>
    }
    return (<> 
        <div className={combineStyles(styles.formContainer, styles.container)}>
        <h1 className={styles.scoreboardContainer}>Scoreboard</h1>
        <p>{season?.name}</p>
        <div className={styles.periodSelector}>
            Time Period
            <select name="period" id="period" onChange={(event) => setTimePeriod(event.target.value as TimePeriod)}>
                <option value="all">Total</option>
                <option value="12">December</option>
                <option value="1">January</option>
                <option value="2">Feburary</option>
                <option value="3">March</option>
                <option value="4">April</option>
            </select>
        </div>
        <hr />
        <div className={styles.container}>
            {riders?.map(rider=> <RiderComp key={rider.id} rider={rider} score={scoreDataForTimePeriod.get(rider.id)}/>)}
        </div>
        </div>
    </>)
}


const RiderComp = (props: {rider: Rider, score?: number}) => {
    // Will prob wanna move this to context?
    // const [totalPoints, setTotalPoints] = useState(0);
    // const {season} = useCurrentSeason();
    // useEffect(()=> {
    //     //Sums up all of the earned points for a rider.  
    //     const getSumOfPoints = async (riderId: string, riderLevel: RiderLevels, season: Season, timePeriod: TimePeriod) => {
    //         if(riderId && season){
    //             // first gets  all of the earned points for current rider
    //             let ridersEarnedPoints = await DataStore.query(EarnedPoint, c=> c.riderID('eq', riderId).seasonID('eq',season.id))

    //             // filter earned rules by the time period
    //             // We just check the month right now
    //             if(timePeriod !== 'all'){
    //                 ridersEarnedPoints = ridersEarnedPoints.filter(point=> new Date(point.date).getMonth() === Number.parseInt(timePeriod))
    //             }
    //             // then map that list of earned POints to rules, so we can get the points per rule
    //             let ruleListForEarnedPointsPromise = ridersEarnedPoints.map(point=> DataStore.query(Rule, r => r.id('eq', point.ruleID)).then(rules=> {
    //                 if(rules.length !== 1){
    //                     console.log('something is broken');
                        
    //                 }
    //                 return rules[0];
    //             }))
    //             // await the promise due to the return type of Datastore, could combine with above line.
    //             let rules = await Promise.all(ruleListForEarnedPointsPromise)
    //             // sum them up
    //             let sum = 0; //@ts-ignore: the rider level is gonna be in the level points map
    //             rules.forEach(rule => sum = sum + Number.parseInt(rule.levelPointsMap[riderLevelToPointsMap.get(riderLevel)]))
    //             setTotalPoints(sum)
    //         }
    //     }
    //     getSumOfPoints(props.rider.id, props.rider.riderLevel, season, props.timePeriod)
    // },[props.rider.id, props.rider.riderLevel, season, props.timePeriod])
    return (<div className={styles.rider}>
        {props.rider.name}
        <div className={styles.totalPoints}>
            Points: {props.score ? props.score.toLocaleString() : 0 }
        </div>
    </div>)
}