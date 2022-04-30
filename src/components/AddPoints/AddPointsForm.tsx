import { DataStore, Predicates } from 'aws-amplify';
import { randomUUID } from 'crypto';
import Link from 'next/link';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { useCurrentSeason, useData } from '../../hooks/useData';
import { useSignedInRider } from '../../hooks/useRider';
import { EarnedPoint, Rider, RiderLevels, Rule } from '../../models';
import { riderLevelToPointsMap } from '../../utils/utils';
import { RuleComponent } from '../Rules/Rule';
import styles from './AddPointsForm.module.scss';


//Maybe add button to go to rule when selectedRules is empty?
export const AddPointsForm = (props: {ruleIds?: string[]} ) => {
    const {riderData} = useSignedInRider();
    
    const {data: rules} = useData(Rule, props.ruleIds)

    // const[selectedRules, setSelectedRules] = useState(props.ruleIds && data ? data : []);
    const [date, setDate] = useState(new Date());
    const {season, loading: seasonLoading, error: seasonError} = useCurrentSeason();

    


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

        
        
        return Promise.all(rules.map(rule => {
            const pointProps = {
                date: date.toISOString().substring(0,10),
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


    if(!riderData) {
        return <Alert style={{marginTop: '1rem'}} variant='danger'>Please sign in or <Link href='/create-account'> create an account</Link></Alert>
    }
    if(!rules){
        return <Spinner animation='border'/>
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
            <DatePicker value={date} setValue={v=>setDate(v)} />
            
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
                {!submitError && !submitLoading && !data && <Button  variant='success' onClick={executeCreatePoints}>
                        Submit
                    </Button>
                }
            </div>
        </div>
        </>
    )
}



const DatePicker = (props: {value: Date, setValue: (d: Date)=> void}) => {
    //@ts-ignore: ignore valueAsDate, it works in most browsers
    return <input className={styles.datePicker} type='date' placeholder={props.value.toISOString().substr(0,10)} value={props.value.toISOString().substr(0,10)} onInput={e=> props.setValue(e.target.valueAsDate)}></input>
}