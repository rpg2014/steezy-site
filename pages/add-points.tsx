import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { AddPointsForm } from "../src/components/AddPoints/AddPointsForm";
import { RulesList } from "../src/components/Rules/RulesList";



const AddPoints: NextPage = () => {
    const router = useRouter();
    const {ruleId} = router.query;
    // console.log(ruleId)
    const [showList, setShowList] = useState(ruleId === undefined);
    return (
        <>
            <Head>
                <title>Add Points</title>
            </Head>
            {/* <h1>TODO</h1> */}
             
            <AddPointsForm ruleIds={Array.isArray(ruleId)? ruleId: ruleId !== undefined ? [ruleId]: undefined} />
            
            
        </>
        )
}

export default AddPoints