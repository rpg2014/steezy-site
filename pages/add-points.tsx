import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";



const AddPoints: NextPage = () => {
    const router = useRouter();
    const {ruleId} = router.query;
    return (
        <>
            <Head>
                <title>Add Points</title>
            </Head>
            <h1>TODO</h1>
            {ruleId && <div>ruleId: {ruleId}</div>}
        </>
        )
}

export default AddPoints