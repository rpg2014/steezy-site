import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import React from "react"
import { CreateRuleForm } from "../../src/components/Rules/CreateRuleForm"

const CreateRule: NextPage = () => {
    const{ ruleId } = useRouter().query;
    return (
        <>
        <Head>
                <title>Create Rule</title>
            </Head>
        <CreateRuleForm ruleId={ruleId!== undefined ?  Array.isArray(ruleId) ? ruleId[0] :ruleId: null} />
        </>
    )
}


export default CreateRule