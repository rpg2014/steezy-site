import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useSetupServiceWorker } from '../src/hooks/useSetupServiceWorker'
import { HubPayload } from '@aws-amplify/core'
import Amplify from '@aws-amplify/core';
import { Auth, DataStore, Hub } from 'aws-amplify';
import awsconfig from '../src/aws-exports';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer } from 'react-toastify'
import { ProvideAuth } from '../src/hooks/useAuth'


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

 
    const listener = (data: { payload: HubPayload }) => {
        // console.log(`[DATASTORE] New event: ${JSON.stringify(data)}`)
    }
    useEffect(() => {
        Hub.listen('datastore', listener)
        return () => Hub.remove('datastore', listener)
    },[])

    // TODO: setup a datastore sync waiter here if the store is empty?
    return <>
        <Head>
            <meta name="viewport"
                content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
            <title>Steezy Stevens</title>
        </Head>
        <ProvideAuth>
        <Component {...pageProps} />
        <ToastContainer />
        </ProvideAuth>
    </>
}

export default MyApp
