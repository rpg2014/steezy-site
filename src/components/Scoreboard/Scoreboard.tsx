
import { DataStore } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentSeason, useData } from '../../hooks/useData';
import { EarnedPoint, Rider, Rule } from '../../models'
import { combineStyles } from '../../utils/utils';
import styles from './Scoreboard.module.scss'
import { riderLevelToPointsMap } from '../../utils/utils';

export const ScoreboardList = () => {
    const {data: riders} = useData(Rider);
    const {signedIn} = useAuth();
    const {season} = useCurrentSeason();
    if(!signedIn) {
        <Alert variant='secondary' >Logging In?</Alert>
    }
    return (<> 
        <div className={combineStyles(styles.formContainer, styles.container)}>
        <h1>Scoreboard</h1>
        <p>{season?.name}</p>
        <hr />
        <div className={styles.container}>
            {riders?.map(rider=> <RiderComp key={rider.id} rider={rider}/>)}
        </div>
        </div>
    </>)
}


const RiderComp = (props: {rider: Rider}) => {
    // Will prob wanna move this to context?
    const [totalPoints, setTotalPoints] = useState(0);
    const {season} = useCurrentSeason();
    useEffect(()=> {
        //Sums up all of the earned points for a rider.  
        const getSumOfPoints = async () => {
            if(props.rider && season){
                // first gets  all of the earned points for current rider
                let ridersEarnedPoints = await DataStore.query(EarnedPoint, c=> c.riderID('eq', props.rider.id).seasonID('eq',season.id))
                
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
                rules.forEach(rule => sum = sum + Number.parseInt(rule.levelPointsMap[riderLevelToPointsMap.get(props.rider.riderLevel)]))
                setTotalPoints(sum)
            }
        }
        getSumOfPoints()
    },[props.rider.id, props.rider.riderLevel, season])
    return (<div className={styles.rider}>
        {props.rider.name}
        <div className={styles.totalPoints}>
            Total Points: {totalPoints}
        </div>
    </div>)
}