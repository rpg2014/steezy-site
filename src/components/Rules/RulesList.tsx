import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useData } from '../../hooks/useData';
import { useSignedInRider } from '../../hooks/useRider';
import { RiderLevels, Rule } from '../../models';
import styles from './RulesList.module.scss';
import {Button} from 'react-bootstrap';
import { useRouter } from 'next/router';
import { combineStyles, riderLevelToPointsMap } from '../../utils/utils';


export type RulesListProps = {
    selectedRule?: string[] | string,
}



export const RulesList = (props: RulesListProps) => {
    const {data: rules} = useData(Rule)
    const {riderData } = useSignedInRider();
    console.log("props.selectedRule: "+ props.selectedRule);
    console.log("inital state: "+ props.selectedRule !== undefined ?  Array.isArray(props.selectedRule) ? props.selectedRule :[props.selectedRule]: [])
    
    const router = useRouter();
    const [selectedRuleIds, setSelectedRuleIds] = useState<string[]>(props.selectedRule !== undefined ?  Array.isArray(props.selectedRule) ? props.selectedRule :[props.selectedRule]: [])
    useEffect(()=> {
        setSelectedRuleIds(props.selectedRule !== undefined ?  Array.isArray(props.selectedRule) ? props.selectedRule :[props.selectedRule]: [])  
    },[props.selectedRule])
    
   
    return <div className={styles.ruleListPageContainer}>
        <div className={styles.title}  >
            List of Rules 
        </div>
        <div className={styles.subtitle}>
            {`Showing points for ${riderData?.riderLevel.toLocaleLowerCase()} level riders`}
        </div>
        <div className={styles.ruleListContainer}>
        {rules?.map(rule => {
            console.log("selectedRuleIds: " + selectedRuleIds);
            console.log("ruleId: " + rule.id);
            console.log("includes: "+selectedRuleIds.includes(rule.id));
            
                        
            return <RuleComp key={rule.id} rule={rule} selected={selectedRuleIds.includes(rule.id)} addToSelected={() => {

                const params: URLSearchParams = new URLSearchParams()
                let newList: string[] ;
                if(!selectedRuleIds.includes(rule.id)){
                    newList = selectedRuleIds.concat(rule.id);
                }else {
                    newList= selectedRuleIds.filter(r => r !== rule.id);
                }
                newList.forEach((ruleId)=> params.append("ruleId", ruleId));
                
                router.push({query: params.toString()})
                setSelectedRuleIds(newList)
                
            } 
        } />
            
        })}
        </div>
        <div className={styles.interactionContainer}>
        <Link passHref href='/rules/create-rule'>
        <Button variant="outline-light"> Create Rule</Button>
        </Link>
        </div>
            </div>
            
}



const RuleComp = ({rule, selected, addToSelected}: {rule: Rule, selected?: boolean, addToSelected: () => void})=> {
    const {riderData } = useSignedInRider();

    const [transitionFinished, setTransitionFinished] = useState(selected);
    // console.log(`${rule.id}: ${transitionFinished}: ${selected}`)
    const pointEntries = Object.entries(rule.levelPointsMap)
    try{
    // pointEntries.unshift(pointEntries.pop())
    }catch(e) {
        // catch undefined
    }

    return(
        //If selected, expand and show buttons for edit and add points  or maybe have add points button always present?
        <div key={rule.id} className={combineStyles(styles.ruleContainer, transitionFinished? styles.selected: '')} onTransitionEnd={()=> setTransitionFinished(!transitionFinished)} onClick={addToSelected} >
            <div className={styles.infoSection}>
                <div className={styles.ruleTextContainer}>
                    <h4 className={styles.ruleName}>{rule.name}</h4>
                        <div className={styles.ruleDescription}>{rule.description}</div>
                        <div className={styles.frequency}>{`You can earn this every ${rule.frequency.toLocaleLowerCase()}`}</div>
                    </div>
                    
                    {riderData 
                        //@ts-ignore: We verify the rider level is in the map or we show 0
                        ? <h4 className={styles.points}>{`Points: ${ riderLevelToPointsMap.has(riderData.riderLevel as RiderLevels) ? rule.levelPointsMap[riderLevelToPointsMap.get(riderData.riderLevel)]: '0'}`}</h4>
                        : (<div className={styles.pointsList}>{pointEntries.map(([k,v])=> <div key={k} className={styles.pointsListItem}>{`${k}: ${v}`}</div>) }</div>)
                    }
            </div>
                
                {
                    <div  className={combineStyles(styles.flexed, selected ? '': styles.remove)}>
                        {transitionFinished ? <>
                            <Link passHref href={'/rules/create-rule?ruleId='+rule.id}><Button className={styles.button} onTransitionEnd={(e)=>e.stopPropagation()} size='sm' variant='outline-dark'>Edit Rule</Button></Link>
                        <Button disabled className={styles.button} onTransitionEnd={(e)=>e.stopPropagation()} size='sm' variant='outline-danger'>Delete </Button>
                        </>: null}
                    </div>
                }
                
        
                
            </div>
    )
}