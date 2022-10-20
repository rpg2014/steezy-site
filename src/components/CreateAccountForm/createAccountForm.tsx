
import { Auth } from "@aws-amplify/auth";
import { DataStore, Predicates } from "aws-amplify";
import Link from "next/link";

import React, { FormEvent, FormEventHandler, HTMLInputTypeAttribute, useState } from "react";
import { Alert, Button, Spinner} from "react-bootstrap";
import styles from '../../../styles/CreateAccount.module.scss'
import { useAuth } from "../../hooks/useAuth";
import { Rider, RiderLevels } from "../../models";
import { InputGroup } from "../InputGroup/inputGroup";





interface FormData  {
    name: string,
    email: string,
    password:string,
    riderLevel: RiderLevels,
    verificationCode: string,
}

type FlowStates = 'CREATE_ACCOUNT' | 'CONFIRM_EMAIL' | "LOGGING_IN"| "CREATING_USER"| "DONE"

export const CreateAccountForm = () => {
    const [flowState, setFlowState] = useState<FlowStates>('CREATE_ACCOUNT')
    const [formState, setFormState] = useState<FormData>({name: "", email: "", password: "", verificationCode: '' , riderLevel: RiderLevels.GREEN})
    const [deliveredToEmail, setDeliveredToEmail] = useState("");
    const [userSub, setUserSub] = useState("");
    const [error, setError] = useState<Error>();
    const [isLoading, setIsLoading] = useState(false);
    

    const onSubmit = () => {
        setIsLoading(true);
        Auth.signUp({
            username: formState.email,
            password: formState.password,
            attributes: {
                preferred_username: formState.name
            }
        }).then((user) => {
            setIsLoading(false);
            setDeliveredToEmail(user.codeDeliveryDetails.Destination)
            setFlowState("CONFIRM_EMAIL")
            setUserSub(user.userSub)
        })
        .catch((e) => {
            setIsLoading(false)
            setError(e)
        });   
    }

    const onConfirmEmail = () => {
        setIsLoading(true)
        Auth.confirmSignUp(formState.email, formState.verificationCode)
        .then(() => {
            setFlowState("LOGGING_IN")
            console.log("Attempting login")
            return Auth.signIn(formState.email, formState.password)
        })
        .then(() => {
            setFlowState("CREATING_USER")
            console.log("Creating Rider in datastore")
            return DataStore.save(
                new Rider({
                  name: formState.name,
                  riderLevel: formState.riderLevel,
                  cognitoId: userSub
                  })
              );
        }).then((rider)=>{
            console.log(`rider ${rider.name} created`)
            setIsLoading(false);
            setFlowState("DONE")
        })
        .catch((e) => {
            setIsLoading(false)
            setError(e)
        });    
    }

    if(flowState === "CONFIRM_EMAIL") {
        return (//Email confirmation code 
            <div className={styles.createAccountForm}>
              <div className={styles.title}  >
                  Confirm your email
              </div>
              <p className={`${styles.text} lead`}>Email sent to: {deliveredToEmail}</p>
              <InputGroup label='Verification Code' type='text' value={formState.verificationCode} name='verificationCode' setFormState={setFormState} 
                placeholder='123456'/>
            <div className={styles.interactionContainer}>
                
                <Button className={styles.submitButton} variant='primary' disabled={isLoading} onClick={onConfirmEmail}>Confirm Email</Button>
            </div>
            </div>
            
        )
    }else if(flowState === "CREATE_ACCOUNT") {
        return (
            
            <div className={styles.createAccountForm}>
                <div className={styles.title}  >
                    Create Account
                </div>
                <div className={styles.form}>
                <InputGroup label="Name" type='text' value={formState?.name} name='name' setFormState={setFormState}/>
                <InputGroup label="Email" type='email' value={formState?.email} name='email' setFormState={setFormState}/>
                <InputGroup label="Pasword" type='password' value={formState?.password} name='password' setFormState={setFormState}/>
                <InputGroup label='Rider Level' select={{options: Object.keys(RiderLevels)}} type='text' value={formState?.riderLevel} name='riderLevel' setFormState={setFormState} />
                </div>
                <div className={styles.interactionContainer}>
                    <Button variant='primary' className={styles.submitButton} disabled={isLoading} onClick={onSubmit}>Create Account</Button>
                    
                </div>
                {error && <Alert className={styles.ErrorBox} variant='danger' >{error.message} </Alert>}
            </div>
        )
    }else {
        let textToDisplay ='';
        switch(flowState) {
            case 'LOGGING_IN':
                textToDisplay = "Logging in..."
                break;
            case 'CREATING_USER':
                textToDisplay = "Creating User..."
                break;
            case 'DONE': 
                textToDisplay = "You're all set!"
        }
        return (
            <div className={styles.createAccountForm}>
              <div className={[styles.loadingTitle, styles.title].join(' ')}  >
                {flowState === "DONE" ? "Completed!" : "Working..."}
                {flowState !== "DONE" && <Spinner className={styles.loadingSpinner} animation='border' />}
              </div>
              <p className={`${styles.text} lead`}>{textToDisplay}</p>
              <div className={styles.interactionContainer}>
            <Link passHref href='/'><Button disabled={isLoading} variant='success-outline' className={styles.returnHome}>Return Home</Button></Link>
            </div>
            </div>
        )
    }
}


