import { DataStore } from "aws-amplify";
import { useState, useEffect, ReactNode, memo, useMemo } from "react";
import { Spinner } from "react-bootstrap";
import { useData } from "../../hooks/useData";
import { useRiderScores } from "../../hooks/useRuleScores";
import { Rider, EarnedPoint, Rule, RiderLevels } from "../../models";
import { combineStyles, getPoints, riderLevelToPointsMap } from "../../utils/utils";
import { TimePeriodSelector } from "../TimePeriodSelector/TimePeriodSelector";
import styles from './RiderScore.module.scss'




export const RiderScoreComponent = (props: {riderId?: string}) => {
    //TODO: This line is causing a rerender, because the hook is changing I think its b/c rider id is changing?
    const {data: rider} = useData(Rider, props.riderId? [props.riderId] : undefined)
    const [earnedPoints, setEarnedPoints] = useState<EarnedPoint[]>();
    const {scoresByRiderId, currentTimePeriod, setTimePeriod} = useRiderScores();
    
    useEffect(()=> {
        let queryData = async () => {
            let allPoints = await DataStore.query(EarnedPoint);
            setEarnedPoints(allPoints.filter(earnedPoint => earnedPoint.riderID === props.riderId))
        }
        queryData();
    },[props.riderId])

   
    if(!rider) {
        return <>Select a Rider [enter list]</>
    }
    if(rider.length > 1) {
        return <>Somethings wrong</>
    }
    
    const currentRider = rider[0];
    

    
    // console.log(rider[0])
    return (
    <div className={combineStyles(styles.formContainer, styles.container)}>
        <h1 className={styles.scoreboardContainer}>{currentRider.name}'s Scores</h1>
        <TimePeriodSelector currentTimePeriod={currentTimePeriod} setTimePeriod={setTimePeriod} />
        <p>Total Score: {scoresByRiderId?.get(currentRider.id)}</p>
        <div className={styles.container}>
            <PointsList  points={earnedPoints} riderLevel ={currentRider.riderLevel}/>
        </div>
    </div>)
}

const PointsList= memo(function PointsList({points, riderLevel}: {points?: EarnedPoint[]; riderLevel: RiderLevels | keyof typeof RiderLevels}) {
    
    if(!points) {
        return <>{"Loading "} <Spinner animation='border'/> </>
    }
    if(points.length === 0) {
        return<>You dont have any points.</>
    }
    let currentDate = new Date(points[0].date);
    let list = [];
    for (let point of points) {
        // console.log(point.id)
        const pointDate = new Date(point.date)
        if(currentDate.getTime() !== pointDate.getTime()){
            currentDate = pointDate;
            list.push(<div >{pointDate.toLocaleDateString()}</div>)
        } 
        
        list.push(<PointComponent key={point.id} earnedPoint={point} riderLevel={riderLevel}/>)
        
    }
    return <>{list}</>;
}, (a,b)=> a.points === b.points)
const PointComponent = memo(function PointComponent({earnedPoint, riderLevel}: {earnedPoint: EarnedPoint, riderLevel: RiderLevels | keyof typeof RiderLevels}) {
    
    const {data} = useData(Rule, Array.of(earnedPoint.ruleID) )
    if(!data){
        return <>Loading</>
    }
    const rule = data[0]
    return <div className={styles.pointContainer}>
        <div>
            {earnedPoint.date}
        </div>
        <span>{getPoints(rule.levelPointsMap, riderLevel)}</span>
    </div>
}, (a,b)=> a.earnedPoint.id === b.earnedPoint.id)

