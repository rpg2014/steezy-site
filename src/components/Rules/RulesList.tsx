import Link from 'next/link';
import React, { useEffect } from 'react';
import { useData } from '../../hooks/useData';
import { useSignedInRider } from '../../hooks/useRider';
import { RiderLevels, Rule } from '../../models';
import styles from './RulesList.module.scss';
import {Button} from 'react-bootstrap';

export type RulesListProps = {
    selectedRule?: string[] | string,
}

const riderLevelToPointsMap: Map<RiderLevels,string> = new Map()
.set(RiderLevels.GREEN, "greenPoints")
.set(RiderLevels.BLUE, "bluePoints")
.set(RiderLevels.BLACK, "blackPoints")
.set(RiderLevels.DOUBLEBLACK, "doubleBlackPoints")

export const RulesList = (props: RulesListProps) => {
    const {data: rules} = useData(Rule)
    const {riderData } = useSignedInRider();
   
    return <div className={styles.ruleListPageContainer}>
        <div className={styles.title}  >
            List of Rules 
        </div>
        <div className={styles.subtitle}>
            {`Showing points for ${riderData?.riderLevel.toLocaleLowerCase()} level riders`}
        </div>
        <div className={styles.ruleListContainer}>
        {rules?.map(rule => {

            return <RuleComp key={rule.id} rule={rule} />
            
        })}
        </div>
        <div className={styles.interactionContainer}>
        <Link passHref href='/rules/create-rule'>
        <Button variant="outline-light"> Create Rule</Button>
        </Link>
        </div>
            </div>
            
}



const RuleComp = ({rule}: {rule: Rule})=> {
    const {riderData } = useSignedInRider();
    return(
        <div key={rule.id} className={styles.ruleContainer} >
            
            <div className={styles.ruleTextContainer}>
                <h4 className={styles.ruleName}>{rule.name}</h4>
                
                <div className={styles.ruleDescription}>{rule.description}</div>
                <div className={styles.frequency}>{`You can earn this every ${rule.frequency.toLocaleLowerCase()}`}</div>
                </div>
                <h4 className={styles.points}>
                {riderData 
                //@ts-ignore: We verify the rider level is in the map or we show 0
                ? `Points: ${ riderLevelToPointsMap.has(riderData.riderLevel as RiderLevels) ? rule.levelPointsMap[riderLevelToPointsMap.get(riderData.riderLevel)]: '0'}`
                : Object.entries(rule.levelPointsMap).map(([k,v])=> `${k}: ${v}`)
                }
                </h4>
                
        
                
            </div>
    )
}