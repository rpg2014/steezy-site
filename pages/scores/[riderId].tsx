import { DataStore } from "aws-amplify";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiderScoreComponent } from "../../src/components/RiderScore/RiderScore";
import { useData } from "../../src/hooks/useData";
import { EarnedPoint, Rider } from "../../src/models";
import { combineStyles } from "../../src/utils/utils";



const RiderScores: NextPage = () => {
    const router = useRouter();
    const {riderId} = router.query;

    return <>
    <Head>
        <title>Rider scores</title>
    </Head>
        <RiderScoreComponent riderId={riderId!== undefined ?  Array.isArray(riderId) ? riderId[0] :riderId: undefined}/>
    
    </>
}




export default RiderScores;