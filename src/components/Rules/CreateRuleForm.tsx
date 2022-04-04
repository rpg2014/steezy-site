import { DataStore } from "aws-amplify"
import { error } from "console"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { Spinner, Button, Alert, ListGroup } from "react-bootstrap"
import { useAsyncAction } from "../../hooks/useAsyncAction"
import { useAuth } from "../../hooks/useAuth"
import { useData } from "../../hooks/useData"
import { useSignedInRider } from "../../hooks/useRider"
import { Frequency, RiderLevels, Rule } from "../../models"
import { riderLevelToPointsMap } from "../../utils/utils"
import { InputGroup } from "../InputGroup/inputGroup"
import { SteezyNavBar } from "../Layout/NavBar"
import styles from './CreateRuleForm.module.scss'


interface FormState {
    name: string,
    description: string,
    frequency: Frequency,
    greenPoints: number,
    bluePoints: number,
    blackPoints: number,
    doubleBlackPoints: number,
}
const initalFormState: FormState = {
    name: "",
    description: "",
    frequency: Frequency.SEASON, 
    greenPoints: 0, 
    bluePoints: 0,
    blackPoints: 0,
    doubleBlackPoints: 0,
}


// if given ruleid we need to fetch it and prefill out the form.  
// will need to show error if you dont have permissions?
export const CreateRuleForm = ({ruleId }: {ruleId?: string | null}) =>  {
    const [formState, setFormState] = useState<FormState>(initalFormState)

    const[loading, setLoading] = useState(ruleId ?true: false);

    const{riderData} = useSignedInRider();

    useEffect(()=> {
        const getRuleToEdit  = async () => {
            if(ruleId){
                setLoading(true)
                const original = await DataStore.query(Rule, ruleId)
                if(original) {
                    setFormState({
                        name: original.name,
                        description: original.description,
                        frequency: original.frequency as Frequency, 
                        //@ts-ignore: We verify that green is present, before getting
                        greenPoints: riderLevelToPointsMap.has(RiderLevels.GREEN) ? original.levelPointsMap[riderLevelToPointsMap.get(RiderLevels.GREEN)]: 0, 
                        //@ts-ignore: We verify that green is present, before getting
                        bluePoints: riderLevelToPointsMap.has(RiderLevels.BLUE) ? original.levelPointsMap[riderLevelToPointsMap.get(RiderLevels.BLUE)]: 0, 
                        //@ts-ignore: We verify that green is present, before getting
                        blackPoints: riderLevelToPointsMap.has(RiderLevels.BLACK) ? original.levelPointsMap[riderLevelToPointsMap.get(RiderLevels.BLACK)]: 0, 
                        //@ts-ignore: We verify that green is present, before getting
                        doubleBlackPoints: riderLevelToPointsMap.has(RiderLevels.DOUBLEBLACK) ? original.levelPointsMap[riderLevelToPointsMap.get(RiderLevels.DOUBLEBLACK)]: 0, 
                    })
                    setLoading(false)
                }       
            }
        }
        getRuleToEdit();
    },[ruleId])
    

    const onSubmit = () => {
        
        if(!formState.name || !formState.description || !formState.frequency){
            throw new Error("Missing a field, double check the form")
        }else if(formState.greenPoints === 0 && formState.bluePoints === 0 && formState.blackPoints === 0 && formState.doubleBlackPoints){ 
            throw new Error("Cant create rule with points as all 0");
        }else{
            //TODO: if prop ruleId is present, edit exsisting rule, else new rule
            // Long term todo: if name is same or similar, suggest rule to edit instead, see comment below
            if(ruleId){
                
                return DataStore.query(Rule, ruleId).then((original: Rule| undefined)=> {
                    if(original ) {
                    return DataStore.save(Rule.copyOf(original, updated =>{
                    updated.name = formState.name;
                    updated.description = formState.description;
                    updated.frequency = formState.frequency;
                    updated.lastEditedBy = riderData;
                    updated.levelPointsMap = JSON.stringify({
                        greenPoints: formState.greenPoints,
                        bluePoints: formState.bluePoints,
                        blackPoints: formState.blackPoints,
                        doubleBlackPoints: formState.doubleBlackPoints,
                  })}))// create new rule if one doesn't exist
                }else {
                    
                    return DataStore.save(new Rule({
                        name: formState.name,
                        description: formState.description,
                        frequency: formState.frequency,
                        lastEditedBy: riderData,
                        levelPointsMap: JSON.stringify({
                            greenPoints: formState.greenPoints,
                            bluePoints: formState.bluePoints,
                            blackPoints: formState.blackPoints,
                            doubleBlackPoints: formState.doubleBlackPoints,
                    })}))
                }
                })
                  
            }else{
                return DataStore.save(new Rule({
                    name: formState.name,
                    description: formState.description,
                    frequency: formState.frequency,
                    levelPointsMap: JSON.stringify({
                        greenPoints: formState.greenPoints,
                        bluePoints: formState.bluePoints,
                        blackPoints: formState.blackPoints,
                        doubleBlackPoints: formState.doubleBlackPoints,
                    })
                    
                }), /* Doesn't work yet r=> r.name("eq",formState.name)  want to prevent updating the same rules.*/)
            }
        }
    }

    const {data, error, loading:submitLoading, execute} = useAsyncAction<Rule>(onSubmit)


    return (
        <div className={styles.createRuleContainer}>
            <div className={styles.title}  >
                {ruleId ? 'Edit Rule' : 'Create Rule'}
            </div>
            <div className={styles.seeAllRulesDiv}>
                Search the  <Link href='/rules'>rule's</Link> to make sure the rule doesn't already exist
            </div>
            {/* {!loading ? */}
             <div className={styles.form}>
                <InputGroup label='Rule Name' name='name' type='text' setFormState={setFormState} value={formState.name} />
                <InputGroup label='How do you earn it?' name='description' type='text' setFormState={setFormState} value={formState.description} />
                <InputGroup label='How Often?' select={{ options: Object.keys(Frequency) }} name='frequency' type='text' setFormState={setFormState} value={formState.frequency} />
                <h4 className=''>Points</h4>
                <InputGroup label='Green Rider Points' name='greenPoints' setFormState={setFormState} value={formState.greenPoints.toString()} />
                <InputGroup label='Blue Rider Points' name='bluePoints' setFormState={setFormState} value={formState.bluePoints.toString()} />
                <InputGroup label='Black Rider Points' name='blackPoints' setFormState={setFormState} value={formState.blackPoints.toString()} />
                <InputGroup label='Double Black Rider Points' name='doubleBlackPoints' setFormState={setFormState} value={formState.doubleBlackPoints.toString()} />


                <div className={styles.interactionContainer}>
                    {submitLoading ? <Spinner animation='border' variant="light" /> : <Button variant='light' onClick={execute}>Submit</Button>}

                </div>
                {error && <Alert className={styles.errorAlert} variant='danger'>
                    {error.message}
                </Alert>}
                {data && <Alert className={styles.successAlert} variant='success'>Success! {ruleId ? 'Edited' :'Created'} rule {data.name}</Alert>}
            </div>
                 {/* <Spinner animation='border' variant="light" /> */}
        </div>
    )
}