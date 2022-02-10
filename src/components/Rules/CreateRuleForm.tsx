import { DataStore } from "aws-amplify"
import { error } from "console"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { Spinner, Button, Alert, ListGroup } from "react-bootstrap"
import { useAsyncAction } from "../../hooks/useAsyncAction"
import { useAuth } from "../../hooks/useAuth"
import { useData } from "../../hooks/useData"
import { Period, Rule, RuleScaling } from "../../models"
import { InputGroup } from "../InputGroup/inputGroup"
import { SteezyNavBar } from "../Layout/NavBar"
import styles from './CreateRuleForm.module.scss'


interface FormState {
    name: string,
    description: string,
    period: Period,
    basePoints?: number,
    ruleScaling?: RuleScaling
    // TODO: maybe have ability to input points for each level, and then a rule scaling is created automagically.  
}

// if given ruleid we need to fetch it and prefill out the form.  
export const CreateRuleForm = ({ruleId }: {ruleId?: string | string[] | null}) =>  {
    const [formState, setFormState] = useState<FormState>({name: "", description: "", basePoints: 0, period: Period.SEASONLY})
    const {signedIn} = useAuth();


    const {data: ruleScalings } = useData(RuleScaling)
    
    const onSubmit = () => {
        if(!formState.name || !formState.description || !formState.period || !formState.basePoints || !formState.ruleScaling){
            throw new Error("Missing a field, double check the form")
        }else {
            
            return DataStore.save(new Rule({
                name: formState.name,
                description: formState.description,
                basePoints: Number.parseInt(formState.basePoints.toString()),
                period: formState.period,
                RuleScaling: formState.ruleScaling,
                ruleRuleScalingId: formState.ruleScaling.id
            }), /* Doesn't work yet r=> r.name("eq",formState.name)  want to prevent updating the same rules.*/)
        }
    }

    const {data, error, loading, execute} = useAsyncAction<Rule>(onSubmit)


    return (
        <div className={styles.createRuleContainer}>
            <div className={styles.title}  >
                Create Rule
            </div>
            <div className={styles.seeAllRulesDiv}>
                Search the  <Link href='/rule'>rule's</Link> to make sure the rule doesn't already exist 
            </div>
            <div className={styles.form}>
                <InputGroup label='Rule Name' name='name' type='text' setFormState={setFormState} value={formState.name} />
                <InputGroup label='Description' name='description' type='text' setFormState={setFormState} value={formState.description} />
                <InputGroup label='How Often?' select={{ options: Object.keys(Period) }} name='period' type='text' setFormState={setFormState} value={formState.period} />
                <p className={styles.paragraph}>The score is calcuated for a rider by the base points times the rider's level ruleScaling multiplier</p>
                <InputGroup label='Base Points' name='basePoints' type='number' setFormState={setFormState} value={formState.basePoints?.toString()} />
                
                <ListGroup  className={styles.ruleScalingList} >
                    {ruleScalings ? ruleScalings.map(scaling => {
                        return <ListGroup.Item 
                            key={scaling.id}
                            className={`${styles.listItem} ${formState.ruleScaling?.id === scaling.id && styles.listItemActive}`}
                            variant='dark'
                            // active={formState.ruleScaling?.id === scaling.id}
                            onClick={()=> setFormState({...formState,ruleScaling: scaling})} 
                            >
                                {`${scaling.name? scaling.name: scaling.id}: db: ${scaling.doubleBlack}, bla: ${scaling.black}, blu: ${scaling.blue}, g: ${scaling.green}, ${scaling.scaleType}`}
                                </ListGroup.Item>
                    }):<Spinner animation='grow' variant='light' />}
                   {ruleScalings?.length === 0 && "There are no RuleScalings, you shouldn't see this"}
                
                </ListGroup>
                <div className={styles.interactionContainer}>
                    {loading ? <Spinner animation='border' variant="light" /> : <Button variant='light' onClick={execute}>Submit</Button>}

                </div>
                {error && <Alert className={styles.errorAlert} variant='danger'>
                    {error.message}
                </Alert>}
                {data && <Alert variant='success'>Success! Created rule {data.name}</Alert>}
            </div>
        </div>
    )
}