import Auth from '@aws-amplify/auth'

import { DataStore, Hub } from 'aws-amplify'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { SignInOutButton } from '../src/components/LoginComponents/LoginPopover'
import { SteezyNavBar } from '../src/components/NavBar/NavBar'
import { useAuth } from '../src/hooks/useAuth'
import { useSyncStatus } from '../src/hooks/useSyncStatus'
import { Rider } from '../src/models'
import styles from '../styles/Home.module.scss'

const Home: NextPage = () => {

    const [riderData, setRiderData] = useState<Rider>();

    const {syncReady} = useSyncStatus();

    const auth = useAuth();
    const { cognitoId, name, email, signedIn } = auth;

    


    //Query to get the rider data for the currenly logged in user.  
    useEffect(() => {
        if (signedIn && cognitoId ) {
            console.log(`Query for: ${cognitoId}`)
            DataStore.query(Rider, r => r.cognitoId('eq', cognitoId))
                .then(riders => {
                    // console.log(`saving riders: ${JSON.stringify(riders)}`)
                    setRiderData(riders[0])

                }).catch(console.error);
        } else {
            setRiderData(undefined)
        }

    }, [cognitoId, signedIn, syncReady])
    return (
        <div className={styles.container}>
            
            <SteezyNavBar />
            <main className={styles.main}>
                
                <h1 className={styles.title}>
                    Welcome to Steezy
                </h1>

                <div className={styles.description}>
                    <p>
                        UserId is {cognitoId}
                        <br />
                        Name is {name}
                        <br />
                        email is {email}
                    </p>
                    <hr />
                    <div style={{ fontSize: '20px' }}>
                        User Object is:
                        <br />
                        <pre style={{ textAlign: "left", backgroundColor: 'black', color: "white", fontSize: "16px" }}>
                            {JSON.stringify(riderData, null, 2)}
                        </pre>
                    </div>
                </div>
                
                <div className={styles.grid}>
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
        </div>
    )
}

export default Home
