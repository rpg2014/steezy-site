import Auth from '@aws-amplify/auth'

import { DataStore, Hub } from 'aws-amplify'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Alert, Button } from 'react-bootstrap'
import { useAuth } from '../src/hooks/useAuth'
import styles from '../styles/Home.module.scss'
// import { CalcuationEngine } from '../steezy-wasm/pkg/steezy_wasm'
import { useCurrentSeason, useData } from '../src/hooks/useData'
import { useSignedInRider } from '../src/hooks/useRider'
import { riderLevelToPointsMap } from '../src/utils/utils'
import { useRiderScores } from '../src/hooks/useRuleScores'
import {DateTime} from 'luxon'
import { TimePeriod } from '../src/components/Scoreboard/Scoreboard'
import { TimePeriodSelector } from '../src/components/TimePeriodSelector/TimePeriodSelector'


// let engine: CalcuationEngine;

const Home: NextPage = () => {

    const { riderData } = useSignedInRider();
    const { season } = useCurrentSeason();
    const { scoresByRiderId, currentTimePeriod, setTimePeriod } = useRiderScores();

    const auth = useAuth();
    const { cognitoId, name, email, signedIn, isCommish } = auth;

    const toggleTimePeriod = () => {
        if(currentTimePeriod === 'all') {
            //@ts-ignore: this should be safe, as long as there is a valid current season when this is called.  
            setTimePeriod(new Date().getMonth() as TimePeriod)
        }else {
            setTimePeriod('all')
        }
    }
    return (
        <>
            <main className={styles.main}>
                <h1 className={styles.title}>
                    Welcome to Steezy
                </h1>
                <h2 style={{textAlign: "center"}}>
                    {season && `The ${season?.name} has started!`}
                </h2>
                <div className={styles.description}>
                    <div>
                        {!signedIn &&
                            <Alert variant='warning'>
                                Please log in or <Link href='/create-account'> create an account</Link>
                            </Alert>}
                        {signedIn && riderData ?
                            <>
                            {season && 
                                <div className={styles.container} onClick={toggleTimePeriod}>
                                    {`Points earned ${currentTimePeriod !=='all' ? `in ${DateTime.fromObject({month: Number.parseInt(currentTimePeriod) + 1}).monthLong}`: 'this season'}: `}
                                    <span style={{marginTop: '1rem', fontSize: "larger"}}>{`${scoresByRiderId?.get(riderData.id) ? scoresByRiderId.get(riderData.id)?.toLocaleString(): "Loading"}`}</span>
                                </div>}
                                {/* {season && <Leaderboard />} */}
                                {/* <br /> */}
                                { !season && `The season hasn't started yet, but you can still create an account and check out the rules`}
                            </> : `Unable to find user data`
                        }
                    </div>

                </div>
                <hr className={styles.divider} />
                <div className={styles.grid}>
                    {signedIn && isCommish &&
                        <Link passHref href='/admin'>
                            <div className={styles.cardSecondary}>

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
                    <Link href={`/scores?riderId=${riderData?.id}`} passHref>
                        <div className={styles.card}>
                            <h2>My Points &rarr;</h2>
                            <p>See the points you've earned</p>
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



// const Leaderboard = () => {
//     const {currentTimePeriod, scoresByRiderId, setTimePeriod} = useRiderScores();
//     useEffect(() => {
//         if(currentTimePeriod !== new Date().getMonth().toString()) {
//             //@ts-ignore;
//             setTimePeriod(new Date().getMonth() as TimePeriod)
//         }
//     })
//     let leaderboard = [];
//     if(scoresByRiderId){
//         let riderList = Array.from(scoresByRiderId.keys())
//         riderList.sort((a, b) => scoresByRiderId.get(b) - scoresByRiderId.get(a))
//         console.log(riderList)
//         riderList.slice(0,3).forEach(rider => {
//             leaderboard.push(<div><span>{rider}</span><span>{scoresByRiderId.get(rider)}</span></div>)
//         })
//     }
//     return <>
//     Leaderboard for {DateTime.fromObject({month: new Date().getMonth() +1}).monthLong}
//     <hr />
//     {leaderboard}
//     </>
// }