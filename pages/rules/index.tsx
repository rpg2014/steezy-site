import { NextPage } from "next"
import App from "next/app"
import Head from "next/head"
import { useRouter } from "next/router"
import React from "react"
import { RulesList } from "../../src/components/Rules/RulesList"

const RulePage: NextPage = () => {
    const router = useRouter();
    const {ruleId} = router.query;
    return (
        //todo: if rule is in query, highlight it? or zoom it in or single page or something? highlighting is easiest
        <>
        <Head>
                <title>Steezy Rules</title>
            </Head>
      <RulesList selectedRule={ruleId}/>
      </>
    )
}


export default RulePage