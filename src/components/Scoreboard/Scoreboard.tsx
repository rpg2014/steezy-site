
import { DataStore } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { Alert, ProgressBar, Spinner } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentSeason, useData } from '../../hooks/useData';
import { EarnedPoint, Rider, RiderLevels, Rule } from '../../models'
import { combineStyles } from '../../utils/utils';
import styles from './Scoreboard.module.scss'

import {useRiderScores } from '../../hooks/useRuleScores';

export type TimePeriod = "all" | '10' | '11' | '0' | '1' | '2' | '3';

export const ScoreboardList = () => {
    const {data: riders} = useData(Rider);
    const {signedIn} = useAuth();
    const {season} = useCurrentSeason();
    const{scoresByRiderId: scoreMapForPeriod, setTimePeriod, loadingPercent, currentTimePeriod} = useRiderScores();

    

    if(!signedIn) {
        return <Alert variant='secondary' >Logging In?</Alert>
    }
    if(!season) {
        return <h2 className={styles.container} style={{paddingTop: '5rem'}}>The season hasn't started yet, come back later!</h2>
    }
    if(!scoreMapForPeriod){
        return <div className={combineStyles(styles.formContainer, styles.container)}>
        <h2 className={styles.scoreboardContainer}>Calculating Scores... {loadingPercent}% completed</h2>
        <ProgressBar className={styles.progressBar} animated now={loadingPercent} />
        {/* <Spinner  style={{marginTop: '2rem'}} animation={'border'} /> */}
        </div>
    }
    return (<> 
        <div className={combineStyles(styles.formContainer, styles.container)}>
        <h1 className={styles.scoreboardContainer}>Scoreboard</h1>
        <p>{season?.name}</p>
        <div className={styles.periodSelector}>
            Time Period
            <select name="period" id="period" value={currentTimePeriod} onChange={(event) => setTimePeriod(event.target.value as TimePeriod)}>
                <option value="all">Total</option>
                <option value='10'>November</option>
                <option value="11">December</option>
                <option value="0">January</option>
                <option value="1">Feburary</option>
                <option value="2">March</option>
                <option value="3">April</option>
            </select>
        </div>
        <hr />
        <div className={styles.container}>
            {riders?.map(rider=> <RiderComp key={rider.id} rider={rider} score={scoreMapForPeriod.get(rider.id)}/>)}
        </div>
        </div>
    </>)
}


const RiderComp = (props: {rider: Rider, score?: number}) => {
    return (<div className={styles.rider}>
        {props.rider.name}
        <div className={styles.totalPoints}>
            Points: {props.score ? props.score.toLocaleString() : 0 }
        </div>
    </div>)
}