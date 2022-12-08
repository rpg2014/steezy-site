import { DataStore } from "aws-amplify";
import { useState, useEffect, ReactNode, memo, useMemo } from "react";
import { Spinner } from "react-bootstrap";
import { useData, useSingleData } from "../../hooks/useData";
import { useRiderScores } from "../../hooks/useRuleScores";
import { Rider, EarnedPoint, Rule, RiderLevels } from "../../models";
import { combineStyles, getPoints, riderLevelToPointsMap } from "../../utils/utils";
import { TimePeriodSelector } from "../TimePeriodSelector/TimePeriodSelector";
import styles from './RiderScore.module.scss'




export const RiderScoreComponent = (props: {riderId?: string}) => {
    const {data: currentRider} = useSingleData(Rider, props.riderId)
    const [earnedPoints, setEarnedPoints] = useState<EarnedPoint[]>();
    const {scoresByRiderId, currentTimePeriod, setTimePeriod} = useRiderScores();
    
    useEffect(()=> {
        let queryData = async () => {
            let allPoints = await DataStore.query(EarnedPoint);
            setEarnedPoints(allPoints.filter(earnedPoint => earnedPoint.riderID === currentRider?.id).filter(earnedPoint => currentTimePeriod === "all" || new Date(earnedPoint.date).getMonth().toString() === currentTimePeriod))
        }
        queryData();
    },[currentRider, currentTimePeriod])

   
    if(!currentRider) {
        return <>This shouldn't happen, we might be loading</>
    }
    
    

    
    // console.log(rider[0])
    return (
    <div className={combineStyles(styles.formContainer, styles.container)}>
        <h1 className={styles.scoreboardContainer}>{currentRider.name}'s Scores</h1>
        <TimePeriodSelector currentTimePeriod={currentTimePeriod} setTimePeriod={setTimePeriod} />
        <p>Total Score for period: {scoresByRiderId?.get(currentRider.id)}</p>
        <div className={combineStyles(styles.container, styles.pointList)}>
            <PointsList  points={earnedPoints} riderLevel ={currentRider.riderLevel} />
        </div>
    </div>)
}

const PointsList= memo(function PointsList({points, riderLevel}: {points?: EarnedPoint[]; riderLevel: RiderLevels | keyof typeof RiderLevels}) {
    
    if(!points) {
        return <>{"Loading "} <Spinner animation='border'/> </>
    }
    if(points.length === 0) {
        return<>You dont have any points. Try changing the time period.</>
    }
    points = points.sort((a,b)=> new Date(a.date).getTime() - new Date(b.date).getTime())
    let currentDate = new Date(points[0].date);
    let list = [];
    
    list.push(<div className={styles.dateHeader} >{new Date(points[0].date).toLocaleDateString(undefined, {timeZone: "UTC"})}</div>)
    for (let point of points) {
    
        const pointDate = new Date(point.date)
        if(currentDate.getTime() !== pointDate.getTime()){
            currentDate = pointDate;
            list.push(<div key={pointDate.toLocaleDateString(undefined, {timeZone: 'UTC'})} className={styles.dateHeader} >{pointDate.toLocaleDateString(undefined, {timeZone: "UTC"})}</div>)
        } 
        
        list.push(<PointComponent key={point.id} earnedPoint={point} riderLevel={riderLevel}/>)
        
    }
    return <>{list}</>;
}, (a,b)=> a.points === b.points)


const PointComponent = memo(function PointComponent({earnedPoint, riderLevel}: {earnedPoint: EarnedPoint, riderLevel: RiderLevels | keyof typeof RiderLevels}) {
    
    const {data: rule} = useSingleData(Rule, earnedPoint.ruleID )
    if(!rule){
        return <>Loading</>
    }
    return <div key={earnedPoint.ruleID} className={styles.pointContainer}>
        <div className={styles.ruleName}>
            
            {rule.name}
        </div>
        <span>{getPoints(rule.levelPointsMap, riderLevel)}</span>
    </div>
}, (a,b)=> a.earnedPoint.id === b.earnedPoint.id)

