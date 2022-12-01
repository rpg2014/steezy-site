
import { DataStore } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { Alert, ProgressBar, Spinner } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentSeason, useData } from '../../hooks/useData';
import { EarnedPoint, Rider, RiderLevels, Rule } from '../../models'
import { combineStyles } from '../../utils/utils';
import styles from './Scoreboard.module.scss'

import { useRiderScores } from '../../hooks/useRuleScores';
import Link from 'next/link';
import { TimePeriodSelector } from '../TimePeriodSelector/TimePeriodSelector';

export type TimePeriod = "all" | '10' | '11' | '0' | '1' | '2' | '3';

export const ScoreboardList = () => {
    const { data: riders } = useData(Rider);
    const { signedIn } = useAuth();
    const { season } = useCurrentSeason();
    const { scoresByRiderId: scoreMapForPeriod, setTimePeriod, loadingPercent, currentTimePeriod } = useRiderScores();



    if (!signedIn) {
        return <Alert variant='dark' >Logging In... <Spinner animation='border' size='sm'/></Alert>
    }
    if (!season) {
        return <h2 className={styles.container} style={{ paddingTop: '5rem' }}>The season hasn't started yet, come back later!</h2>
    }
    return (<>
        <div className={combineStyles(styles.formContainer, styles.container)}>
            <h1 className={styles.scoreboardContainer}>Scoreboard</h1>
            <p>{season?.name}</p>
            <TimePeriodSelector currentTimePeriod={currentTimePeriod} setTimePeriod={setTimePeriod}/>
            <hr />
            <div className={styles.container}>
                {!scoreMapForPeriod ? <div className={styles.container}>
                    <h4 className={styles.scoreboardContainer}>Calculating Scores... {loadingPercent}% completed</h4>
                    <ProgressBar className={styles.progressBar} animated now={loadingPercent} />
                </div>
                : riders?.map(rider => <RiderComp key={rider.id} rider={rider} score={scoreMapForPeriod.get(rider.id)} />)}
            </div>
        </div>
    </>)
}


const RiderComp = (props: { rider: Rider, score?: number }) => {
    return (<div className={combineStyles(styles.rider, styles.riderLink)}>
        <Link href={`/scores/${props.rider.id}`}>
            <div className={styles.riderLink}>
            {props.rider.name}
            </div>
        </Link>
        <div className={styles.totalPoints}>
            Points: {props.score ? props.score.toLocaleString() : 0}
        </div>
    </div>)
}