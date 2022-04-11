import { DataStore } from 'aws-amplify';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { useData } from '../../hooks/useData';
import { useSignedInRider } from '../../hooks/useRider';
import { EarnedPoint, RiderLevels, Rule } from '../../models';
import { riderLevelToPointsMap } from '../../utils/utils';
import { RuleComponent } from '../Rules/Rule';
import styles from './AddPointsForm.module.scss';


//Maybe add button to go to rule when selectedRules is empty?
export const AddPointsForm = (props: {ruleIds?: string[]} ) => {
    const {riderData} = useSignedInRider();
    
    const {data} = useData(Rule, props.ruleIds)

    const[selectedRules, setSelectedRules] = useState(props.ruleIds && data ? data : []);
    const [date, setDate] = useState(new Date());

    useEffect(()=>{
        if(data && props.ruleIds){
            setSelectedRules(data)
        }
    },[data])


    // make this return all of the datastore promises from each earned point addition.  
    // const onSubmit = () => {
    //     if(!selectedRules || selectedRules.length == 0){
    //         throw new Error("You must select a rule to add");
    //     }
    //     if(!riderData) {
    //         throw new Error("You dont seem to be logged in.")
    //     }
    //     selectedRules.forEach(rule => {
    //         DataStore.save(new EarnedPoint({
    //             date: date.toISOString(),
    //             riderID: riderData.id,
    //             ruleID: rule.id,
    //             seasonID: // do we need seasons at all?
    //         }))
    //     })  
    // }

    // const { data, error: submitError, loading: submitLoading, execute } = useAsyncAction<Rule>(() => onSubmit().then(e => { successPopover(); return e }).catch(e => {throw e;}))

    if(!riderData) {
        return <></>
    }
    if(!data){
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
                {data && data.map((rule) => {
                    return (
                        <RuleComponent disableButtons key={rule.id} smallVersion rule={rule} selected={selectedRules.some(r=> r.id === rule.id)} addToSelected={() => {
                            const params: URLSearchParams = new URLSearchParams()
                            let newList: Rule[];
                            if (!selectedRules.some(r=> r.id === rule.id)) {
                                newList = selectedRules.concat(rule);
                            } else {
                                newList = selectedRules.filter(r => r.id !== rule.id);
                            }

                            // router.push({ query: params.toString() })
                            setSelectedRules(newList)
                        }} /> 
                    )
                })}
            </div>
            
            {selectedRules.length> 0 && <div className={styles.totalPointsContainer} >
                {/*@ts-ignore: We verify the rider level is in the map or we show 0}*/}
                total points = {selectedRules.map(r=> Number.parseInt(riderLevelToPointsMap.has(riderData.riderLevel as RiderLevels) ? r.levelPointsMap[riderLevelToPointsMap.get(riderData.riderLevel)]: '0')).reduce((pv, cv) => pv + cv)}
            </div>}
            <div className={styles.formInteractionContainer}>
                <Button variant='success' onClick={()=>{
                    toast.error('Not implemented yet', {
                        position: "bottom-center",
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: false,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                        theme: 'dark',
                    })
                }}>
                Submit
                </Button>
            </div>
        </div>
        </>
    )
}



const DatePicker = (props: {value: Date, setValue: (d: Date)=> void}) => {
    //@ts-ignore: ignore valueAsDate, it works in most browsers
    return <input className={styles.datePicker} type='date' placeholder={props.value.toISOString().substr(0,10)} value={props.value.toISOString().substr(0,10)} onInput={e=> props.setValue(e.target.valueAsDate)}></input>
}