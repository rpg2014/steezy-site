import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "react-bootstrap";
import styles from './AddPointsButton.module.scss'

export const AddPointsButton = () => {
    const{ ruleId } = useRouter().query;
    let show = false;
    if (ruleId ) {
        show=true;
    }


    let params: string = '';
    if(Array.isArray(ruleId)){
        ruleId.forEach(id => params = params.concat('ruleId=').concat(id).concat('&'))
    }else if(ruleId){
        params = params.concat('ruleId='+ruleId);
    }

    return (show &&//<Collapse in={show} >
        // <div className={styles.addPointsButton} style={{width: '100%'}}>
            <Link  passHref href={`/add-points?${params}`}>
                <Button className={styles.addPointsButton} variant='success'>Add points</Button>
                </Link>
                // </div>
                // </Collapse>
    )
}