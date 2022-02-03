import React from 'react';
import styles from '../../../styles/components.module.scss';
import { SteezyNavBar } from './NavBar';


export const Layout = (props: { children: React.ReactElement }) => {
    return (
        <div className={styles.container}>
            <SteezyNavBar />
            <div className={styles.container}>
                {props.children}
            </div>
        </div>
    )
}