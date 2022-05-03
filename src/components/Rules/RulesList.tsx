import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useData } from '../../hooks/useData';
import { useSignedInRider } from '../../hooks/useRider';
import { RiderLevels, Rule } from '../../models';
import styles from './RulesList.module.scss';
import { Button, Collapse, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/router';

import { RuleComponent } from './Rule';
import FuzzySearch from 'fuzzy-search';
import { AddPointsButton } from '../AddPoints/AddPointsButton';
import { useAuth } from '../../hooks/useAuth';


export type RulesListProps = {
    selectedRule?: string[] | string,
}



export const RulesList = (props: RulesListProps) => {
    const { data: rules } = useData(Rule);
    const { isCommish } = useAuth();
    const [selectedRuleIds, setSelectedRuleIds] = useState<string[]>(props.selectedRule !== undefined ? Array.isArray(props.selectedRule) ? props.selectedRule : [props.selectedRule] : [])
    const [displayedRules, setDisplayedRules] = useState(rules)
    const [searchString, setSearchString] = useState<string| undefined>(undefined);
    const [searchObject, setSearchObject] = useState<FuzzySearch<Rule> | null>(null);
    const [showAllPoints, setShowAllPoints] = useState(false);

    //eventually save this in local storage.  
    const [showFilters, setShowFilters] = useState(false);

    const { riderData } = useSignedInRider();


    const router = useRouter();

    // set the selected rules from the query props
    useEffect(() => {
        setSelectedRuleIds(props.selectedRule !== undefined ? Array.isArray(props.selectedRule) ? props.selectedRule : [props.selectedRule] : [])
    }, [props.selectedRule])

    // useEffect(()=> {
    //     console.log(displayedRules);
        
    // },[displayedRules])

    // update the displayedrules list when rules updates.  
    // will be used for when there are filters more
    // is rn unneccessary
    useEffect(()=>{
        if(rules && !displayedRules){
            setSearchObject(new FuzzySearch(rules, ['name','description'],{caseSensitive: false, sort: true}))
            setDisplayedRules(rules)
        }
        
    },[rules, displayedRules])

    const searchFunction = () => setDisplayedRules( searchObject?.search(searchString))

    return <div className={styles.ruleListPageContainer}>
        <div className={styles.title}  >
            List of Rules
        </div>
        <div className={styles.subtitle} onClick={()=> setShowAllPoints(!showAllPoints)}>
            {`Showing points for ${showAllPoints ? 'all' : riderData?.riderLevel.toLocaleLowerCase()} level riders`}
            <br />
            Select Rules to add points
        </div>
        {rules &&
        <div className={styles.searchBarContainer}>
            <SearchBar onKeyUp={()=> searchFunction()} setValue={(value: string)=> setSearchString(value)} />   
            {/* <Button variant='outline-light' size='sm' className={styles.filterButton}>Filters</Button> */}
            </div>
        }
        <div className={styles.ruleListContainer}>
            {!rules && <Spinner animation='border' variant="light" />}
            {displayedRules?.map(rule => {
                return <RuleComponent disableButtons={!isCommish} 
                        showAllPoints={showAllPoints} 
                        key={rule.id} 
                        rule={rule} 
                        selected={selectedRuleIds.includes(rule.id)} 
                        addToSelected={() => {
                            const params: URLSearchParams = new URLSearchParams()
                            let newList: string[];
                            if (!selectedRuleIds.includes(rule.id)) {
                                newList = selectedRuleIds.concat(rule.id);
                            } else {
                                newList = selectedRuleIds.filter(r => r !== rule.id);
                            }
                            newList.forEach((ruleId) => params.append("ruleId", ruleId));

                            router.push({ query: params.toString() })
                            setSelectedRuleIds(newList)
                        }} 
                />

            })}
        </div>
        {isCommish &&<div className={styles.interactionContainer}>
            <Link passHref href='/rules/create-rule'>
                <Button variant="outline-light"> Create Rule</Button>
            </Link>
        </div>}
        {/*@ts-ignore: I'm allowed to return false */}
        <AddPointsButton />
        
    </div>

}


export const SearchBar = ({onKeyUp, setValue, value}:{onKeyUp: ()=> void, setValue: (value: string)=> void, value?: string}) => {
 
    return (
        <>
                <input 
                    className={styles.searchInput} 
                    type={'text'} 
                    name={'searchBox'}
                    placeholder={'Search'} 
                    onKeyUp={onKeyUp}
                    value={value} 
                    onInput={(event:any)=> {
                        setValue(event.target.value);
                    }} />
             
          </>  
    )
}

