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
import { useRiderScores } from '../src/hooks/useRuleScores'


// let engine: CalcuationEngine;

const Home: NextPage = () => {

    const { riderData } = useSignedInRider();
    const { season } = useCurrentSeason();
    const { scoresByRiderId, loadingPercent } = useRiderScores();

    const auth = useAuth();
    const { cognitoId, name, email, signedIn, isCommish } = auth;


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
                                Logged in as {riderData.name}
                                <br />
                                {season ? `Number of points earned this season: ${scoresByRiderId?.get(riderData.id)}`
                                    : `The season hasn't started yet, but you can still create an account and check out the rules`}
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
