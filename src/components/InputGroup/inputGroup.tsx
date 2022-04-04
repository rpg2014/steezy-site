import { HTMLInputTypeAttribute } from "react"
import { RiderLevels } from "../../models"
import styles from './inputGroup.module.scss'

interface InputGroupProps { label: string; 
    type?: HTMLInputTypeAttribute; 
    value?: string; 
    name?: string;
    setFormState: (e: any) =>void;
    placeholder?: string,
    children?: React.ReactNode;
    select?: {
        options: string[]
    }
}

export const InputGroup = (props: InputGroupProps ) => {
    const onInput = (event: any) => {
        props.setFormState((state: any) => {
            return {
                ...state,
                [event.target.name]: event.target.value,
            }
        })
    }
    return (
        <div className={styles.inputGroup}>
                <label className={`${styles.inputLabel} text-white`} >{props.label}</label>
                {props.select ? 
                <select value={props.value} name={props.name} className={styles.inputField} onChange={onInput}>
                    {Object.values(props.select.options).map(option =>
                        <option key={option} value={option}>{option}</option>
                    )}
                </select>
                : <input 
                    className={`${styles.inputField} border`} 
                    type={props.type ? props.type : 'text'} 
                    name={props.name}
                    placeholder={props.placeholder? props.placeholder: props.label} 
                    value={props.value} 
                    onInput={onInput} />
                }
            </div>
    )
}