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
import { Rider, Rule, Season } from '../src/models'
import styles from '../styles/Home.module.scss'
// import { CalcuationEngine } from '../steezy-wasm/pkg/steezy_wasm'
import { useData } from '../src/hooks/useData'
import { useSignedInRider } from '../src/hooks/useRider'


// let engine: CalcuationEngine;

const Home: NextPage = () => {

    const {riderData} = useSignedInRider();
    const {data: rules} = useData(Rule);
    
    const {data: seasons} = useData(Season);

    const {syncReady} = useSyncStatus();

    const auth = useAuth();
    const { cognitoId, name, email, signedIn } = auth;


    



    return (
        
            <>
            
            <main className={styles.main}>
                
                <h1 className={styles.title}>
                    Welcome to Steezy
                </h1>
                
                <div className={styles.description}>
                    <p>
                        UserId is {cognitoId}
                        <br />
                        Name is {riderData?.name}
                        <br />
                        email is {email}
                        <br />
                        Number of points earned: {riderData?.earnedPoints?.length}
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
