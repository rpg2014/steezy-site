import { NextPage } from "next"
import { useRouter } from "next/router"
import React from "react"
import { CreateRuleForm } from "../../src/components/CreateRuleForm/CreateRuleForm"

const CreateRule: NextPage = () => {
    return (
        <CreateRuleForm ruleId={null} />
    )
}


export default CreateRule