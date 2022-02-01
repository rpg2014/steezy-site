import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import React, { useEffect } from 'react'
import Head from 'next/head'
import { useSetupServiceWorker } from '../src/hooks/useSetupServiceWorker'

import Amplify, { Auth, DataStore } from 'aws-amplify';
import awsconfig from '../src/aws-exports';
import 'bootstrap/dist/css/bootstrap.min.css';


Amplify.configure(awsconfig);

declare global {
    interface Window {
        clearDataStore:any;
        startDataStore:any;
        signOut:any;
    }
}


function MyApp({ Component, pageProps }: AppProps) {
    useSetupServiceWorker();
    // Debug tools, maybe make new hook
    useEffect(() => {
        window.clearDataStore = () => {
            DataStore.clear();
        }
        window.startDataStore= () => {
            DataStore.start();
        }
        window.signOut = () => {
            Auth.signOut();
        }
    },[])
    return <>
        <Head>
            <meta name="viewport"
                content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
            <title>Steezy Stevens</title>
        </Head>
        <Component {...pageProps} />
    </>
}

export default MyApp
