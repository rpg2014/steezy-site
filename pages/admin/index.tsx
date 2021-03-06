import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { SteezyNavBar } from "../../src/components/Layout/NavBar";
import { useAuth, useRequireCommish } from "../../src/hooks/useAuth";
import styles from '../../styles/Admin.module.scss'



const Admin: NextPage = () => {

    const {signedIn, isCommish} = useAuth()


    const router = useRouter();

    
    return (
        <>
        <Head >
            <title>Commissioner's office</title>
        </Head>
        
        <main className={styles.main}>
            
            <h2 className={styles.title}>
                    Admin Page
                </h2>
                <div className={styles.description}>

                </div>
                <br />
                <hr className={styles.divider}/>
                <br />
                {!isCommish ? 
                <div> You Dont have permissions</div>
                : <div className={styles.grid}>
                    <Link passHref href="/rules/create-rule">
                    <div className={styles.card}><h2>Create new rule &rarr;</h2></div>
                    </Link>
                </div>}
        </main>
        </>
    )
}



export default Admin
