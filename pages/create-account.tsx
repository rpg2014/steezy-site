import { NextPage } from "next";
import Head  from "next/head";
import Link from "next/link";
import React from "react";
import { CreateAccountForm } from "../src/components/CreateAccountForm/createAccountForm";
import styles from '../styles/CreateAccount.module.scss'


const CreateAccount: NextPage = () => {
    return (
        <>
            <Head>
                <title>Create Steezy Account</title>
            </Head>

            <div className={styles.container}>
                <Link href="/"  ><span className={styles.backText}>Back </span></Link>
                <CreateAccountForm/>
            </div>
        </>
    )
}


export default CreateAccount;