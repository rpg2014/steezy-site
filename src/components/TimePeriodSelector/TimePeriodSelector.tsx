
import { TimePeriod } from '../Scoreboard/Scoreboard';
import styles from './TimePeriod.module.scss';


export const TimePeriodSelector = ({currentTimePeriod, setTimePeriod}: {currentTimePeriod: string, setTimePeriod: (newPeriod: TimePeriod)=> void}) => {
    return <div className={styles.periodSelector}>
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
}