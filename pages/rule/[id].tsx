import { NextPage } from "next"
import { useRouter } from "next/router"
import React from "react"
import { CreateRuleForm } from "../../src/components/CreateRuleForm/CreateRuleForm"
import { SteezyNavBar } from "../../src/components/NavBar/NavBar"

const RulePage: NextPage = () => {
    const router = useRouter();
    const {id} = router.query;
    return (
        <div><SteezyNavBar />
        <h1>{`Rule Id: ${id}`}
        </h1>
        </div>
    )
}


export default RulePage