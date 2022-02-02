import Link from "next/link"
import React from "react"
import { Button } from "react-bootstrap"
import { useAuth } from "../../hooks/useAuth"
import { SignInOutButton } from "../LoginComponents/LoginPopover"
import styles from './NavBar.module.scss'



export const NavBar = () => {

    const {signedIn} = useAuth();
    return (
        <div className={styles.AuthDiv}>
                    <SignInOutButton />
                    {!signedIn && <Link passHref href='create-account' >
                        <Button variant='outline-info' className={styles.createAccountButton} >Create Account</Button>
                    </Link>
                    }
                </div>
    )
}