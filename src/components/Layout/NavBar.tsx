import Link from "next/link"
import React from "react"
import { Button, Container, Nav, Navbar } from "react-bootstrap"
import { useAuth } from "../../hooks/useAuth"
import { SignInOutButton } from "../LoginComponents/LoginPopover"
import styles from './NavBar.module.scss'
import logo from '/public/blueBird.png' ;
// import Image from "next/image"



export const SteezyNavBar = () => {

    //TODO Add toggle between sticky and fixed top navbar


    const { signedIn,isCommish } = useAuth();
    //have state to show offcanvas.  Have media query check to only open when below md breakpoint
    // https://www.w3schools.com/howto/howto_js_off-canvas.asp
    return (
            <Navbar collapseOnSelect className={styles.navBox + ''} fixed='top' expand="md" bg="dark" variant="dark">
                <div className={styles.innerContainer}>
                    <Link passHref href='/' >
                        <Navbar.Brand className={styles.brand} >
                            <img
                                alt=""
                                src={logo}
                                width="30"
                                height="30"
                                className={`d-inline-block align-top ${styles.brandImg}`}
                            />Steezy
                        </Navbar.Brand>
                    </Link>
                    <div className={styles.toggle}>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav"  ></Navbar.Toggle>
                    </div>
                    {/* Put animated hamburger here */}

                    <Navbar.Collapse id="navbarScroll">
                        <Nav justify className={"me-auto " + styles.textLinksDiv}>
                            <Link passHref  href='/scoreboard'>
                                <Nav.Link  className={' '+styles.navButton} >Scoreboard</Nav.Link>
                            </Link>
                            <Link passHref href="/add-points">
                            <Nav.Link className={' '+styles.navButton}>Add Points</Nav.Link>
                            </Link>
                            <Link passHref href="/rules">
                                <Nav.Link className={styles.navButton}>Rules</Nav.Link>
                            </Link>
                            {isCommish && <Link passHref href="/admin">
                                <Nav.Link className={''+styles.navButton}>Admin</Nav.Link>
                            </Link>}
                        </Nav>
                        <Nav className={styles.AuthDiv}>
                            <SignInOutButton />
                            {!signedIn && <Link passHref href='/create-account' >
                                <Button variant='outline-info' className={styles.createAccountButton} >Create Account</Button>
                            </Link>
                            }
                        </ Nav>
                    </Navbar.Collapse>
                </div>
            </Navbar>
    
    )
}