import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react'
import Head from 'next/head'
import { useSetupServiceWorker } from '../src/hooks/useSetupServiceWorker'

function MyApp({ Component, pageProps }: AppProps) {
    useSetupServiceWorker();
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
