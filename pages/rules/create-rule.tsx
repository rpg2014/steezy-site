import { NextPage } from "next"
import { useRouter } from "next/router"
import React from "react"
import { CreateRuleForm } from "../../src/components/Rules/CreateRuleForm"

const CreateRule: NextPage = () => {
    const{ ruleId } = useRouter().query;
    return (
        <CreateRuleForm ruleId={ruleId!== undefined ?  Array.isArray(ruleId) ? ruleId[0] :ruleId: null} />
    )
}


export default CreateRule