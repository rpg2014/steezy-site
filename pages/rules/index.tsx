import { NextPage } from "next"
import App from "next/app"
import { useRouter } from "next/router"
import React from "react"
import { RuleComponent } from "../../src/components/Rules/RuleComponent"

const RulePage: NextPage = () => {
    const router = useRouter();
    const {ruleId} = router.query;
    return (
      <RuleComponent ruleId={ruleId} />
    )
}


export default RulePage