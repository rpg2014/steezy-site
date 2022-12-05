import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useData } from '../../hooks/useData';
import { useSignedInRider } from '../../hooks/useRider';
import { Frequency, RiderLevels, Rule } from '../../models';
import styles from './RulesList.module.scss';
import { Button, Collapse, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/router';

import { RuleComponent } from './Rule';
import FuzzySearch from 'fuzzy-search';
import { AddPointsButton } from '../AddPoints/AddPointsButton';
import { useAuth } from '../../hooks/useAuth';
import { InputGroup } from '../InputGroup/inputGroup';
import { tagOptions } from '../../utils/utils';


export type RulesListProps = {
    selectedRule?: string[] | string,
}



export const RulesList = (props: RulesListProps) => {
    const { data: rules } = useData(Rule);
    const { isCommish } = useAuth();
    const [selectedRuleIds, setSelectedRuleIds] = useState<string[]>(props.selectedRule !== undefined ? Array.isArray(props.selectedRule) ? props.selectedRule : [props.selectedRule] : [])
    const [searchedRules, setSearchedRules] = useState(rules)
    const [searchString, setSearchString] = useState<string| undefined>(undefined);
    const [searchObject, setSearchObject] = useState<FuzzySearch<Rule> | null>(null);
    const [showAllPoints, setShowAllPoints] = useState(false);
    const [disableButtons, setDisableButtons] = useState(false)
    
    //eventually save this in local storage.  
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<{frequency: Frequency, tags: string}>()
    const [filteredRules, setFilteredRules] = useState(searchedRules)

    const { riderData } = useSignedInRider();


    const router = useRouter();
    useEffect(()=>{
        //@ts-ignore
        if(!window.disableButtons){
            //@ts-ignore
            window.disableButtons = () => setDisableButtons(true)
        }
    }, [])

    // set the selected rules from the query props
    useEffect(() => {
        setSelectedRuleIds(props.selectedRule !== undefined ? Array.isArray(props.selectedRule) ? props.selectedRule : [props.selectedRule] : [])
    }, [props.selectedRule])

    useEffect(()=> {
        let filteredRules = searchedRules;
        if(filters?.frequency){
            filteredRules = (filteredRules?.filter((rule) => rule.frequency === filters.frequency))
        }
        if(filters?.tags) {
            filteredRules = filteredRules?.filter((rule) => rule.tags?.includes(filters.tags))
        }
        
        setFilteredRules(filteredRules)
        
        
        
    },[searchedRules, filters?.frequency, filters?.tags])

    // update the displayedrules list when rules updates.  
    // will be used for when there are filters more
    // is rn unneccessary
    useEffect(()=>{
        if(rules && !searchedRules){
            setSearchObject(new FuzzySearch(rules, ['name','description'],{caseSensitive: false, sort: true}))
            setSearchedRules(rules)
        }
        
    },[rules, searchedRules])

    const searchFunction = () => setSearchedRules( searchObject?.search(searchString))

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
            <Button variant='outline-light' size='sm' onClick={()=> setShowFilters(!showFilters)} className={styles.filterButton}>Filters</Button>
            
            </div>
        }
        {showFilters && <div className={styles.filterContainer}>
            {/* @ts-ignore */}
                <InputGroup label='Rule Frequency' select={{ options: [undefined].concat(Object.keys(Frequency)) }} name='frequency' type='text' 
                setFormState={setFilters} value={filters?.frequency}  />
                {/* @ts-ignore */}
                <InputGroup label='Rule Tags' select={{options: tagOptions}} name='tags' type='text' setFormState={setFilters} value={filters?.tags} />
                <Button variant='outline-info' size='sm' onClick={()=> {setFilters(undefined); setShowFilters(false)}} className={styles.filterButton}>Clear Filters</Button>

                {/* Code to disable the buttons if they are a commish
                {isCommish &&
            <div className={styles.simplePointsWrapper} onClick={() => {
                setDisableButtons(!disableButtons)
                // router.push({ query: '' }, undefined ,{scroll: false})
            }}>
                <input readOnly type='checkbox' name="disableButtons" id='buttonInput' checked={disableButtons}></input>
                <label >&nbsp;Disable Buttons</label>
            </div>
        } */}
                </div>}
        <div className={styles.ruleListContainer}>
            {!rules && <Spinner animation='border' variant="light" />}
            {rules && rules.length === 0 && `There doesn't seem to be any rules, have any been created yet?`}
            {filteredRules?.map(rule => {
                return <RuleComponent disableButtons={!isCommish || disableButtons} 
                        showAllPoints={showAllPoints} 
                        smallVersion
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

                            router.push({ query: params.toString() }, undefined ,{scroll: false})
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

