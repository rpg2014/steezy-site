import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { RiderScoreComponent } from "../src/components/RiderScore/RiderScore";



const RiderScores: NextPage = () => {
    const router = useRouter();
    const {riderId} = router.query;

    return <>
    <Head>
        <title>Rider scores</title>
    </Head>
        <RiderScoreComponent riderId={riderId !== undefined ?  Array.isArray(riderId) ? riderId[0] :riderId: undefined}/>
    </>
}




export default RiderScores;