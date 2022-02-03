import { error } from "console"
import Link from "next/link"
import React from "react"
import { InputGroup, Spinner, Button, Alert } from "react-bootstrap"
import { SteezyNavBar } from "../NavBar/NavBar"
import styles from './CreateRuleForm.module.scss'

// if given ruleid we need to fetch it and prefill out the form.  
export const CreateRuleForm = ({ruleId }: {ruleId?: string | string[] | null}) =>  {

    return (
        <>
                {/* <InputGroup label='Email' name='email' type={"email"} setFormState={setFormState} value={formState.email}  />
                        <InputGroup label='Password' name='password' type="password" setFormState={setFormState} value={formState.password} />
                        <div className={styles.loginButtonDiv}>
                        <Link href='/forgot-password' >
                            <div className={styles.forgotPasswordDiv}>
                            Forgot Password? 
                            </div>
                            {/*TODO: Link to forgot password component */}
                        {/* </Link>
                            {loading? <Spinner animation='border' variant="light"/> :<Button variant='light' onClick={onSubmit}>Login</Button>}
                        </div> */}
                        {/* // {error && <Alert className={styles.errorAlert} variant='danger'>
                        //             {error.message}
                        //         </Alert> */} 
                       {<Alert className={styles.errorAlert} variant='success'>Success!</Alert>}
                   </>     
    )
}