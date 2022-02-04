import { NextPage } from "next"
import App from "next/app"
import { useRouter } from "next/router"
import React from "react"
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom"
import { CreateRuleForm } from "../../src/components/Rules/CreateRuleForm"
import { SteezyNavBar } from "../../src/components/Layout/NavBar"
import { RuleComponent } from "../../src/components/Rules/RuleComponent"

const RulePage: NextPage = () => {
    const router = useRouter();
    const {ruleId} = router.query;
    return (
      <RuleComponent ruleId={ruleId} />
    )
}


export default RulePage