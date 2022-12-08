import { DataStore } from "aws-amplify"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { Spinner, Button, Alert, ListGroup } from "react-bootstrap"
import { toast } from "react-toastify"
import { useAsyncAction } from "../../hooks/useAsyncAction"
import { useAuth } from "../../hooks/useAuth"
import { useData } from "../../hooks/useData"
import { useSignedInRider } from "../../hooks/useRider"
import { Frequency, RiderLevels, Rule } from "../../models"
import { riderLevelToPointsMap, tagOptions } from "../../utils/utils"
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
    tags?: (string | null)[] | null,
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
export const CreateRuleForm = ({ ruleId }: { ruleId?: string | null }) => {
    const [formState, setFormState] = useState<FormState>(initalFormState)
    const [simplePoints, setSimplePoints] = useState(true)

    const [loading, setLoading] = useState(ruleId ? true : false);
    const [error, setError] = useState();

    const { riderData } = useSignedInRider();
    const { signedIn, cognitoId } = useAuth();

    useEffect(() => {
        const getRuleToEdit = async () => {
            if (ruleId) {
                setError(undefined);
                setLoading(true)
                try{
                    const original = await DataStore.query(Rule, ruleId)
                    if (original) {
                        setSimplePoints(false)
                        setFormState({
                            name: original.name,
                            description: original.description,
                            frequency: original.frequency as Frequency,
                            tags: original.tags,
                            //@ts-ignore: We verify that green is present, before getting
                            greenPoints: riderLevelToPointsMap.has(RiderLevels.GREEN) ? original.levelPointsMap[riderLevelToPointsMap.get(RiderLevels.GREEN)] : 0,
                            //@ts-ignore: We verify that green is present, before getting
                            bluePoints: riderLevelToPointsMap.has(RiderLevels.BLUE) ? original.levelPointsMap[riderLevelToPointsMap.get(RiderLevels.BLUE)] : 0,
                            //@ts-ignore: We verify that green is present, before getting
                            blackPoints: riderLevelToPointsMap.has(RiderLevels.BLACK) ? original.levelPointsMap[riderLevelToPointsMap.get(RiderLevels.BLACK)] : 0,
                            //@ts-ignore: We verify that green is present, before getting
                            doubleBlackPoints: riderLevelToPointsMap.has(RiderLevels.DOUBLEBLACK) ? original.levelPointsMap[riderLevelToPointsMap.get(RiderLevels.DOUBLEBLACK)] : 0,
                        })
                        setLoading(false)
                    }
                    setLoading(false);
                }catch(err: any) {
                    setError(err)
                }
                
            }
        }
        getRuleToEdit();
    }, [ruleId])


    const onSubmit = () => {

        if (!formState.name || !formState.description || !formState.frequency) {
            throw new Error("Missing a field, double check the form");
        } else if (formState.greenPoints === 0 && formState.bluePoints === 0 && formState.blackPoints === 0 && formState.doubleBlackPoints === 0) {
            throw new Error("Can't create a rule with all points as 0");
        } else {

            let tags: (string | null)[] | null | undefined = undefined
            if(formState.tags) {
                if(Array.isArray(formState.tags)) {
                    tags = formState.tags
                }else {
                    tags = [formState.tags]
                }
            }

            // Long term todo: if name is same or similar, suggest rule to edit instead, see comment below
            if (ruleId) {

                return DataStore.query(Rule, ruleId).then((original: Rule | undefined) => {
                    if (original) {
                        return DataStore.save(Rule.copyOf(original, updated => {
                            updated.name = formState.name;
                            updated.description = formState.description;
                            updated.frequency = formState.frequency;
                            updated.lastEditedByCognitoId = cognitoId;
                            updated.tags = tags,
                            updated.levelPointsMap = JSON.stringify({
                                greenPoints: formState.greenPoints,
                                bluePoints: formState.bluePoints,
                                blackPoints: formState.blackPoints,
                                doubleBlackPoints: formState.doubleBlackPoints,
                            })
                        }))// create new rule if one doesn't exist
                    } else {

                        return DataStore.save(new Rule({
                            name: formState.name,
                            description: formState.description,
                            frequency: formState.frequency,
                            lastEditedByCognitoId: cognitoId,
                            tags: tags,
                            levelPointsMap: JSON.stringify({
                                greenPoints: formState.greenPoints,
                                bluePoints: formState.bluePoints,
                                blackPoints: formState.blackPoints,
                                doubleBlackPoints: formState.doubleBlackPoints,
                            })
                        }))
                    }
                })

            } else {
                return DataStore.save(new Rule({
                    name: formState.name,
                    description: formState.description,
                    frequency: formState.frequency,
                    lastEditedByCognitoId: cognitoId,
                    tags: tags,
                    levelPointsMap: JSON.stringify({
                        greenPoints: formState.greenPoints,
                        bluePoints: formState.bluePoints,
                        blackPoints: formState.blackPoints,
                        doubleBlackPoints: formState.doubleBlackPoints,
                    })

                }))
            }
        }
    }
    const successPopover = () => toast.success(ruleId ? 'Rule Updated!' : "Rule Created!",
        {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'dark',
        })

    const { data, error: submitError, loading: submitLoading, execute } = useAsyncAction<Rule>(() => onSubmit().then(e => { successPopover(); return e }).catch(e => {throw e;}))

    if (!signedIn) {
        return <Alert className={styles.errorAlert} variant='danger'>
            You must sign in to create a rule
        </Alert>
    }

    return (
        <div className={styles.formContainer}>
            {loading ? <Spinner animation='border' />
                : <>
                    <div className={styles.formTitle}  >
                        {ruleId ? 'Edit Rule' : 'Create Rule'}
                    </div>

                    <div className={styles.seeAllRulesDiv}>
                        Search the  <Link passHref href='/rules'>rule's</Link> to make sure the rule doesn't already exist
                    </div>
                    {/* {!loading ? */}
                    <div className={styles.form}>
                        <InputGroup label='Rule Name' name='name' type='text' setFormState={setFormState} value={formState.name} />
                        <InputGroup label='How do you earn it?' name='description' type='text' setFormState={setFormState} value={formState.description} />
                        <InputGroup label='How Often?' select={{ options: Object.keys(Frequency) }} name='frequency' type='text' setFormState={setFormState} value={formState.frequency} />
                        {/* @ts-ignore */}
                        <InputGroup label='Tags' name="tags" select={{options: tagOptions}} setFormState={setFormState} value={formState.tags?.toString()}></InputGroup>
                        <div className={styles.pointsHeader}>
                            <h4 className=''>Points</h4>
                            <div className={styles.simplePointsWrapper} onClick={() => setSimplePoints(!simplePoints)}>
                                <input readOnly type='checkbox' name="simplePoints" id='point_input' checked={simplePoints}></input>
                                <label >&nbsp;Simple Points</label>
                            </div>
                        </div>
                        {!simplePoints ?
                            <>
                                <InputGroup label='Green Rider Points' name='greenPoints' setFormState={setFormState} value={formState.greenPoints.toString()} />
                                <InputGroup label='Blue Rider Points' name='bluePoints' setFormState={setFormState} value={formState.bluePoints.toString()} />
                                <InputGroup label='Black Rider Points' name='blackPoints' setFormState={setFormState} value={formState.blackPoints.toString()} />
                                <InputGroup label='Double Black Rider Points' name='doubleBlackPoints' setFormState={setFormState} value={formState.doubleBlackPoints.toString()} />
                                
                            </>
                        :
                            <>
                                <InputGroup label='Points for all levels' name="points" setFormState={(fn: (state: any) => any)=> {
                                    const newValues= fn({})
                                    setFormState({
                                        ...formState,
                                        greenPoints: newValues.points,
                                        bluePoints: newValues.points,
                                        blackPoints: newValues.points,
                                        doubleBlackPoints: newValues.points,
                                    })

                                }}/>
                            </>
                        }
                        

                        <div className={styles.formInteractionContainer}>
                            {submitLoading ? <Spinner animation='border' variant="light" /> :
                                !data ? <Button variant='light' onClick={execute}>Submit</Button> : <Link passHref href={`/rules?ruleId=${data.id}`}><Button variant='outline-success'>See Rule List</Button></Link>}

                        </div>
                        {submitError && !data &&<Alert className={styles.alert} variant='danger'>
                            {submitError.message}
                        </Alert>}
                        {/* {data && <Alert className={styles.alert} variant='success'>Success! {ruleId ? 'Edited' :'Created'} rule {data.name}</Alert>} */}
                    </div>
                </>
            }
        </div>
    )
}