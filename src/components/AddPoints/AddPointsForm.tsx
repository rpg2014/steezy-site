import { DataStore, Predicates } from 'aws-amplify';
import { randomUUID } from 'crypto';
import Link from 'next/link';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentSeason, useData } from '../../hooks/useData';
import { useSignedInRider } from '../../hooks/useRider';
import { EarnedPoint, Rider, RiderLevels, Rule } from '../../models';
import { combineStyles, riderLevelToPointsMap } from '../../utils/utils';
import { RuleComponent } from '../Rules/Rule';
import styles from './AddPointsForm.module.scss';
import {DateTime } from 'luxon'



//Maybe add button to go to rule when selectedRules is empty?
export const AddPointsForm = (props: {ruleIds?: string[]} ) => {
    const {riderData} = useSignedInRider();
    const {signedIn} = useAuth();
    
    const {data: rules} = useData(Rule, props.ruleIds)

    // const[selectedRules, setSelectedRules] = useState(props.ruleIds && data ? data : []);
    const [date, setDate] = useState(DateTime.utc());
    const {season, loading: seasonLoading} = useCurrentSeason();

    const[rulesThatFailValidation, setRulesThatFailValidation] = useState<Rule[] | undefined>();


    useEffect(()=> {
        const validateRules = async () => {
            if(!rules || rules.length === 0 || !riderData){
                setRulesThatFailValidation(undefined);
                return ;
            }
            // validation here that checks the users earned points for any of the same rules
            // then makes sure that none of them are already added in the time period the rule requires.  
            let newRulesThatFailValidation = []
            for (let rule of rules){
                // this function returns true if a given rule has already been earned within the frequency.  
                let pointsFromSameRule = await DataStore.query(EarnedPoint, c => c.and(c => c.ruleID('eq',rule.id).and(c => c.riderID('eq', riderData?.id))))
                let previousEarnedPointInSamePeriod = false;
                let prevEarnedDate;
                for (let earnedPoint of pointsFromSameRule){
                    const earnedPointDate = DateTime.fromISO(earnedPoint.date)
                    // console.log(`earned Point date: ${earnedPointDate.toISODate()}`)
                    // console.log(`chosen date: ${date.toISODate()}`)
                    switch (rule.frequency) {
                        case "SEASON": 
                            if(earnedPoint.seasonID === season?.id) {
                                previousEarnedPointInSamePeriod = true;
                                prevEarnedDate = earnedPointDate
                            }
                            break;
                        case "MONTH":
                            if(date.month === earnedPointDate.month){
                                previousEarnedPointInSamePeriod = true;
                                prevEarnedDate = earnedPointDate
                            }
                            break;
                        case "WEEK": 
                            if(date.weekNumber === earnedPointDate.weekNumber){
                                // console.log("setting to true")
                                previousEarnedPointInSamePeriod = true;
                                prevEarnedDate = earnedPointDate
                            }
                            break;
                        case "DAY":
                            // test day equality
                            if(date.day === earnedPointDate.day && date.month === earnedPointDate.month && date.year === earnedPointDate.year){
                                previousEarnedPointInSamePeriod = true;
                                prevEarnedDate = earnedPointDate
                            }
                            break;
                        case "ANYTIME":
                            // false by default
                            break;
                    }
                }   
                if(previousEarnedPointInSamePeriod) {
                    newRulesThatFailValidation.push({...rule, prevEarnedDate: prevEarnedDate});
                }
            }
            setRulesThatFailValidation(newRulesThatFailValidation)
        }
        validateRules()
    }, [props.ruleIds, date, season, riderData, rules])
    


    // make this return all of the datastore promises from each earned point addition.  
    const createPoints = () => {
        if(!rules || rules.length == 0){
            throw new Error("You must select a rule to add");
        }
        if(!riderData) {
            throw new Error("You dont seem to be logged in.")
        }
        if(!season){
            throw new Error("There isn't an active season")
        }
        
        if(rulesThatFailValidation && rulesThatFailValidation.length > 0) {
            throw new Error(`Please fix the below validation errors`)
        }
        
        return Promise.all(rules.map(rule => {
            const pointProps = {
                date: date.toJSDate().toISOString().substring(0,10),
                riderID: riderData.id,
                ruleID: rule.id,
                seasonID: season.id,
            }
            return DataStore.save(
                new EarnedPoint(pointProps)
            )
        }))
    }

    const { data, error: submitError, loading: submitLoading, execute: executeCreatePoints } = useAsyncAction<EarnedPoint[]>(createPoints);


    if(!riderData && !signedIn ) {
        return <Alert style={{marginTop: '1rem'}} variant='danger'>Please sign in or <Link href='/create-account'> create an account</Link></Alert>
    }
    if(!rules || !riderData){
        return <div ><Spinner variant='dark' animation='border'/></div>
    }
    
    return (
        <>
        <div className={styles.formContainer}>
            <div className={styles.formTitle}  >
                       Add Points
            </div>
            <div className={styles.formSectionTitle}>
                Date of Points 
            </div>
            <DatePicker value={date.toJSDate()} setValue={v=>setDate(DateTime.fromJSDate(v,{zone: "UTC"}))} />
            
                <div className={styles.formSectionTitle}>
                    Points to add
                </div>
                <div className={styles.ruleList}>
                {rules && rules.map((rule) => {
                    return (
                        <RuleComponent disableButtons key={rule.id} smallVersion rule={rule}  addToSelected={() => {
                            // const params: URLSearchParams = new URLSearchParams()
                            // let newList: Rule[];
                            // if (!selectedRules.some(r=> r.id === rule.id)) {
                            //     newList = selectedRules.concat(rule);
                            // } else {
                            //     newList = selectedRules.filter(r => r.id !== rule.id);
                            // }

                            // // router.push({ query: params.toString() })
                            // setSelectedRules(newList)
                        }} /> 
                    )
                })}
            </div>
            
            {rules.length> 0 && <div className={styles.totalPointsContainer} >
                <h4>
                    Total Points:
                </h4>
                <h4>
                {/*@ts-ignore: We verify the rider level is in the map or we show 0}*/}
                {rules.map(r=> Number.parseInt(riderLevelToPointsMap.has(riderData.riderLevel as RiderLevels) ? r.levelPointsMap[riderLevelToPointsMap.get(riderData.riderLevel)]: '0')).reduce((pv, cv) => pv + cv)}
                </h4>
            </div>}

            <div className={styles.formInteractionContainer}>
                {submitError && <Alert variant='danger'>{submitError.message}</Alert>}
                {submitLoading && <Spinner size='sm' animation={'border'}/>}
                {data && <Alert variant='success'>Points Added!</Alert>}
                {/* @ts-ignore: this works*/}
                {!submitError && !submitLoading && !data && <Button disabled={rulesThatFailValidation?.length > 0}  variant='success' onClick={executeCreatePoints}>
                        Submit
                    </Button>
                }
            </div>
            {/*@ts-ignore: The below works*/}
            {rulesThatFailValidation?.length > 0 && 
                    <div className={styles.duplicateAlertContainer}>
                        <Alert className={styles.duplicateAlert} variant='warning'>
                            <>
                                {`The following points have already been added during their time period:`}
                                <br />
                                <div className={styles.conflictingRule}>
                                    <span >Rule Name</span>
                                    <span >Conflicting Date</span>
                                    <span >Rule Frequency</span>
                                </div>
                                <hr />
                                {rulesThatFailValidation?.map((rule: any) => {
                                    return <><div key={rule.id} className={styles.conflictingRule}>
                                        <span >{rule.name}</span>
                                        <span >{(rule.prevEarnedDate as DateTime).toJSDate().toLocaleDateString(undefined, { timeZone: "UTC" })}</span>
                                        <span >{rule.frequency}</span>
                                    </div><hr /></>
                                })}
                                <br />
                                The new week starts on Mondays
                            </>
                        </Alert>
                    </div>
            }
        </div>
        </>
    )
}



const DatePicker = (props: {value: Date, setValue: (d: Date)=> void}) => {
    //@ts-ignore: ignore valueAsDate, it works in most browsers
    return <input className={styles.datePicker} type='date' placeholder={props.value.toISOString().substring(0,10)} value={props.value.toISOString().substring(0,10)} onInput={e=> props.setValue(e.target.valueAsDate)}></input>
}