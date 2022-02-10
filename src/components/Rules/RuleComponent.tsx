
import Link from 'next/link';
import React from 'react';
import { useData } from '../../hooks/useData';
import { Rule } from '../../models';
import styles from './RuleComponent.module.scss';

export const RuleComponent = (props: any) => {
    const {data: rules} = useData(Rule)
    return <div className={styles.container}>
        List of Rules 
        {rules?.map(rule => {
            return <div key={rule.id} className={styles.ruleListItem}>{`${rule.name}: period ${rule.period}; points: ${rule.basePoints}; scaling: ${rule.RuleScaling.name}}`}</div>
        })}
        <Link href='/rules/create-rule'> Create Rule</Link>
            </div>
            
}