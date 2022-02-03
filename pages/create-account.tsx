import { NextPage } from "next";
import Head  from "next/head";
import Link from "next/link";
import React from "react";
import { Alert, Button } from "react-bootstrap";
import { CreateAccountForm } from "../src/components/CreateAccountForm/createAccountForm";
import { useAuth } from "../src/hooks/useAuth";
import styles from '../styles/CreateAccount.module.scss'


const CreateAccount: NextPage = () => {
    const {signedIn } = useAuth();
    return (
        <>
            <Head>
                <title>Create Steezy Account</title>
            </Head>
                {signedIn ? <Alert variant='light'>You shouldn't be here, You are already logged in.</Alert> 
                : <CreateAccountForm/>
    }
            
        </>
    )
}


export default CreateAccount;