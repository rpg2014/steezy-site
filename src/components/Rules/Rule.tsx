import { DataStore } from "aws-amplify";
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useSignedInRider } from "../../hooks/useRider";
import { Rule } from "../../models";
import styles from './RulesList.module.scss';
import { combineStyles, riderLevelToPointsMap } from "../../utils/utils";
import Link from "next/link";
import { Button, Modal } from "react-bootstrap";

export type RuleComponentProps = { 
    showAllPoints?: boolean, 
    rule: Rule, 
    selected?: boolean, 
    addToSelected?: () => void
    smallVersion?: boolean ,
    disableButtons?: boolean,
}

export const RuleComponent = ({ rule, selected, addToSelected, showAllPoints = false, smallVersion, disableButtons }: RuleComponentProps ) => {
    const { riderData } = useSignedInRider();
    const { isCommish, cognitoId } = useAuth();
    const [transitionFinished, setTransitionFinished] = useState(selected);
    // console.log(`${rule.id}: ${transitionFinished}: ${selected}`)
    const pointEntries = Object.entries(rule.levelPointsMap)
    try {
        // pointEntries.unshift(pointEntries.pop())
    } catch (e) {
        // catch undefined
    }

    return (
        //If selected, expand and show buttons for edit and add points  or maybe have add points button always present? }  onClick={() => {addToSelected(); setTimeout(()=> setTransitionFinished(!transitionFinished),0)}} 
        <div className={combineStyles(styles.ruleContainer, !disableButtons ? transitionFinished ? styles.selected : '' : selected ? styles.selected: '')} onTransitionEnd={() => !disableButtons && setTransitionFinished(!transitionFinished)} onClick={() => { addToSelected && addToSelected();}}>
            
            <div className={styles.infoSection} >
                <div className={styles.ruleTextContainer}>
                    <h4 className={styles.ruleName}>{rule.name}</h4>
                    {!smallVersion && <div className={styles.ruleDescription}>{rule.description}</div>}
                    {!smallVersion && <div className={styles.frequency}>{`You can earn this every ${rule.frequency.toLocaleLowerCase()}`}</div>}
                </div>
                {riderData && !showAllPoints
                    //@ts-ignore: We verify the rider level is in the map or we show 0
                    ? <h4 className={styles.points}>{`Points: ${riderLevelToPointsMap.has(riderData.riderLevel as RiderLevels) ? Number.parseInt(rule.levelPointsMap[riderLevelToPointsMap.get(riderData.riderLevel)]).toLocaleString() : '0'}`}</h4>
                    : (<div className={styles.pointsList}>{pointEntries.map(([k, v]) => <div key={k} className={styles.pointsListItem}>{`${k}: ${v}`}</div>)}</div>)
                }
            </div>
            {selected && smallVersion && <div className={styles.ruleDescription}>{rule.description}</div>}
            {
                <div className={!disableButtons ? combineStyles(styles.flexed, selected ? '' : styles.remove) : ''} >
                    
                    {transitionFinished && !disableButtons ? <>
                        {/* <Link passHref href={'/add-points?ruleId='+rule.id}><Button className={styles.button} onClick={(e)=> e.stopPropagation()} onTransitionEnd={(e)=>{e.stopPropagation()}} size='sm' variant='outline-success'>Add Points</Button></Link> */}
                        <Link passHref href={'/rules/create-rule?ruleId=' + rule.id}><Button className={styles.button} onClick={(e) => e.stopPropagation()} onTransitionEnd={(e) => e.stopPropagation()} size='sm' variant='outline-dark'>Edit Rule</Button></Link>
                        <DeleteButton  disabled={rule.lastEditedByCognitoId !== cognitoId && !isCommish} onDelete={() => DataStore.delete(Rule, rule.id)} />
                    </> : null}
                </div>
            }
            
        </div>
    )
}


const DeleteButton = (props: {disabled: boolean, onDelete: () => void}) => {
    const [show, setShow] = useState(false);

    const toggle = () => setShow(!show);
    
    return (
        <div onClick={(e)=> {e.stopPropagation()}} onTransitionEnd={e => e.stopPropagation()}>
            <Button disabled={props.disabled} className={styles.button} onClick={toggle}   size='sm' variant='outline-danger'>Delete </Button>
            <Modal
            
            centered
            show={show}
            onHide={toggle}
           >
                <Modal.Header closeButton  >
                    <Modal.Title>Confirm deletion</Modal.Title>
                </Modal.Header >

                <Modal.Body >
                    <p>Are you sure you want to delete this?</p>
                </Modal.Body>

                <Modal.Footer >
                    <Button variant="secondary"  onClick={toggle}>Cancel</Button>
                    <Button variant="danger"  onClick={props.onDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}