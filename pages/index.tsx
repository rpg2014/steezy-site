import Auth from '@aws-amplify/auth'

import { DataStore, Hub } from 'aws-amplify'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Alert, Button } from 'react-bootstrap'
import { SignInOutButton } from '../src/components/LoginComponents/LoginPopover'
import { SteezyNavBar } from '../src/components/Layout/NavBar'
import { useAuth } from '../src/hooks/useAuth'
import { useSyncStatus } from '../src/hooks/useSyncStatus'
import { EarnedPoint, Rider, Rule, Season } from '../src/models'
import styles from '../styles/Home.module.scss'
// import { CalcuationEngine } from '../steezy-wasm/pkg/steezy_wasm'
import { useCurrentSeason, useData } from '../src/hooks/useData'
import { useSignedInRider } from '../src/hooks/useRider'
import { riderLevelToPointsMap } from '../src/utils/utils'


// let engine: CalcuationEngine;

const Home: NextPage = () => {

    const {riderData} = useSignedInRider();
    const {season} = useCurrentSeason();
    const {data: seasons} = useData(Season);

    const {syncReady} = useSyncStatus();

    const auth = useAuth();
    const { cognitoId, name, email, signedIn } = auth;


    // Will prob wanna move this to context?
    const [totalPoints, setTotalPoints] = useState(0);
    useEffect(()=> {
        //Sums up all of the earned points for a rider.  
        const getSumOfPoints = async () => {
            if(signedIn && riderData && season){
                // first gets  all of the earned points for current rider
                let ridersEarnedPoints = await DataStore.query(EarnedPoint, c=> c.riderID('eq', riderData.id).seasonID('eq',season.id))
                
                // then map that list of earned POints to rules, so we can get the points per rule
                let ruleListForEarnedPointsPromise = ridersEarnedPoints.map(point=> DataStore.query(Rule, r => r.id('eq', point.ruleID)).then(rules=> {
                    if(rules.length !== 1){
                        console.log('something is broken');
                        
                    }
                    return rules[0];
                }))
                // await the promise due to the return type of Datastore, could combine with above line.
                let rules = await Promise.all(ruleListForEarnedPointsPromise)
                // sum them up
                let sum = 0; //@ts-ignore: the rider level is gonna be in the level points map
                rules.forEach(rule => sum = sum + Number.parseInt(rule.levelPointsMap[riderLevelToPointsMap.get(riderData.riderLevel)]))
                setTotalPoints(sum)
            }
        }
        getSumOfPoints()
    },[signedIn, riderData, season])
    



    return (
        
            <>
            
            <main className={styles.main}>
                
                <h1 className={styles.title}>
                    Welcome to Steezy
                </h1>
                <div className={styles.description}>
                        <div>
                            {!signedIn &&
                            <Alert variant='warning'>
                                Please log in or <Link href='/create-account'> create an account</Link>
                            </Alert>}
                            {signedIn && <>
                            CognitoId is {cognitoId}
                            <br />
                            Name is {riderData?.name}
                            <br />
                            email is {email}
                            <br />
                            Number of points earned: {totalPoints}
                            </>
                            }
                        </div>
                        
                    </div>
                <hr className={styles.divider}/>
                <div className={styles.grid}>
                    {signedIn &&
                        <Link passHref href='/admin'>
                        <div  className={styles.cardDanger}>
                            
                            <h2>Admin Page &rarr;</h2>
                            <p>Do admin actions like create a new rule</p>
                        </div>
                        </Link>
                    }
                    <Link href="/rules" passHref>
                     <div className={styles.card}>
                        <h2>Rule List &rarr;</h2>
                        <p>See the full list of rules</p>
                        </div>
                    </Link>
                    <Link href='/scoreboard' passHref>
                        <div className={styles.card}>
                            <h2>Scoreboard &rarr;</h2>
                            <p>See the Seasons scores</p>
                        </div>
                    </Link>

                    
                </div>
            </main>

            {/* <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <img src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
        </>
    )
}

export default Home
