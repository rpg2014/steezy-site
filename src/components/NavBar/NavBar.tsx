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


    const { signedIn } = useAuth();
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
                            />{'\t'}Steezy
                        </Navbar.Brand>
                    </Link>
                    <div className={styles.toggle}>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav"  ></Navbar.Toggle>
                    </div>
                    {/* Put animated hamburger here */}

                    <Navbar.Collapse id="navbarScroll">
                        <Nav variant='pills' className={"me-auto " + styles.textLinksDiv}>
                            <Link passHref href='/scoreboard'>
                                <Nav.Link>Scoreboard</Nav.Link>
                            </Link>
                            <Nav.Link href="/add-points">Add Points</Nav.Link>
                        </Nav>
                        <Nav className={styles.AuthDiv}>
                            <SignInOutButton />
                            {!signedIn && <Link passHref href='create-account' >
                                <Button variant='outline-info' className={styles.createAccountButton} >Create Account</Button>
                            </Link>
                            }
                        </ Nav>
                    </Navbar.Collapse>
                </div>
            </Navbar>
    
    )
}