import Auth from '@aws-amplify/auth'

import { DataStore, Hub } from 'aws-amplify'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
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
    const {data: rules} = useData(Rule);
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
                    <p>
                        CognitoId is {cognitoId}
                        <br />
                        Name is {riderData?.name}
                        <br />
                        email is {email}
                        <br />
                        Number of points earned: {totalPoints}
                    </p>
                    
                </div>
                
                <hr className={styles.divider}/>
                <div className={styles.grid}>
                    {signedIn &&
                        <Link passHref href='/admin'>
                        <div  className={styles.cardDanger}>
                            
                            <h2>Admin Page &rarr;</h2>
                            <p>Find in-depth information about Next.js features and API.</p>
                        </div>
                        </Link>
                    }
                    <Link href="/rules" passHref>
                     <div className={styles.card}>
                        <h2>Rule List &rarr;</h2>
                        <p>See the full list of rules</p>
                        </div>
                    </Link>

                    <a
                        href="https://github.com/vercel/next.js/tree/canary/examples"
                        className={styles.card}
                    >
                        <h2>Examples &rarr;</h2>
                        <p>Discover and deploy boilerplate example Next.js projects.</p>
                    </a>

                    <a
                        href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                        className={styles.card}
                    >
                        <h2>Deploy &rarr;</h2>
                        <p>
                            Instantly deploy your Next.js site to a public URL with Vercel.
                        </p>
                    </a>
                    <Link passHref href='/admin'>
                    <div  className={styles.card}>
                        <h2>Admin Page &rarr;</h2>
                        <p>Find in-depth information about Next.js features and API.</p>
                    </div>
                    </Link>

                    <a href="https://nextjs.org/learn" className={styles.card}>
                        <h2>Learn &rarr;</h2>
                        <p>Learn about Next.js in an interactive course with quizzes!</p>
                    </a>

                    <a
                        href="https://github.com/vercel/next.js/tree/canary/examples"
                        className={styles.card}
                    >
                        <h2>Examples &rarr;</h2>
                        <p>Discover and deploy boilerplate example Next.js projects.</p>
                    </a>

                    <a
                        href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                        className={styles.card}
                    >
                        <h2>Deploy &rarr;</h2>
                        <p>
                            Instantly deploy your Next.js site to a public URL with Vercel.
                        </p>
                    </a>
                    <Link passHref href='/admin'>
                    <div  className={styles.card}>
                        <h2>Admin Page &rarr;</h2>
                        <p>Find in-depth information about Next.js features and API.</p>
                    </div>
                    </Link>

                    <a href="https://nextjs.org/learn" className={styles.card}>
                        <h2>Learn &rarr;</h2>
                        <p>Learn about Next.js in an interactive course with quizzes!</p>
                    </a>

                    <a
                        href="https://github.com/vercel/next.js/tree/canary/examples"
                        className={styles.card}
                    >
                        <h2>Examples &rarr;</h2>
                        <p>Discover and deploy boilerplate example Next.js projects.</p>
                    </a>

                    <a
                        href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                        className={styles.card}
                    >
                        <h2>Deploy &rarr;</h2>
                        <p>
                            Instantly deploy your Next.js site to a public URL with Vercel.
                        </p>
                    </a>
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
