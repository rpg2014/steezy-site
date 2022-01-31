
import Auth from "@aws-amplify/auth";
import { DataStore, Predicates } from "aws-amplify";
import Link from "next/link";

import React, { FormEvent, FormEventHandler, HTMLInputTypeAttribute, useState } from "react";
import { Alert, Button} from "react-bootstrap";
import styles from '../../../styles/CreateAccount.module.scss'
import { Rider, RiderLevels } from "../../models";
import { InputGroup } from "../InputGroup/inputGroup";





interface FormData  {
    name: string,
    email: string,
    password:string,
    riderLevel: RiderLevels,
    verificationCode: string,
}

type FlowStates = 'CREATE_ACCOUNT' | 'CONFIRM_EMAIL' | "DONE"

export const CreateAccountForm = () => {
    const [flowState, setFlowState] = useState<FlowStates>('CREATE_ACCOUNT')
    const [formState, setFormState] = useState<FormData>({name: "", email: "", password: "", verificationCode: '' , riderLevel: RiderLevels.GREEN})
    const [deliveredToEmail, setDeliveredToEmail] = useState("");
    const [userSub, setUserSub] = useState("");
    const [error, setError] = useState<Error>();
    

    const onSubmit = () => {
        Auth.signUp({
            username: formState.email,
            password: formState.password,
            attributes: {
                preferred_username: formState.name
            }
        }).then((user) => {
            console.log(user)
            setDeliveredToEmail(user.codeDeliveryDetails.Destination)
            setFlowState("CONFIRM_EMAIL")
            setUserSub(user.userSub)
        })
        .catch(setError);   
    }

    const onConfirmEmail = () => {
        Auth.confirmSignUp(formState.email, formState.verificationCode)
        .then(() => {
            console.log("Attempting login")
            return Auth.signIn(formState.email, formState.password)
        })
        .then(()=> {
            setFlowState("DONE")
        })
        .then(() => {
            console.log("Creating Rider in datastore")
            return DataStore.save(
                new Rider({
                  name: formState.name,
                  riderLevel: formState.riderLevel,
                  cognitoId: userSub
                })
              );
        }).then((rider)=>{
            console.log("rider created")
            console.log(rider)
        })
       
        .catch(setError);   
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
                
                <button className={styles.submitButton} onClick={onConfirmEmail}>Confirm Email</button>
            </div>
            </div>
            
        )
    }else if(flowState === 'DONE') {
        return (
            <div className={styles.createAccountForm}>
              <div className={styles.title}  >
                  You're all set! 
              </div>
              <p className={`${styles.text} lead`}>Return home to login</p>
              <div className={styles.interactionContainer}>
            <Link href='/'><button className={styles.returnHome}>Return Home</button></Link>
            </div>
            </div>
        )
    }

    return (
        
        <div className={styles.createAccountForm}>
              <div className={styles.title}  >
                  Create Account
              </div>
            <InputGroup label="Name" type='text' value={formState?.name} name='name' setFormState={setFormState}/>
            <InputGroup label="Email" type='email' value={formState?.email} name='email' setFormState={setFormState}/>
            <InputGroup label="Pasword" type='password' value={formState?.password} name='password' setFormState={setFormState}/>
            <InputGroup label='Rider Level' select={{options: Object.keys(RiderLevels)}} type='text' value={formState?.riderLevel} name='riderLevel' setFormState={setFormState} />
            <div className={styles.interactionContainer}>
                <button className={styles.submitButton} onClick={onSubmit}>Create Account</button>
                <div className={styles.forgotPasswordDiv}>
                    Forgot Password? 
                    {/*TODO: Link to forgot password component */}
                </div>
            </div>
            {error && <Alert className={styles.ErrorBox} >{error.message} </Alert>}
        </div>
    )
}


