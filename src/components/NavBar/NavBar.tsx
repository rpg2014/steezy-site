import Link from "next/link"
import React from "react"
import { Button, Container, Nav, Navbar } from "react-bootstrap"
import { useAuth } from "../../hooks/useAuth"
import { SignInOutButton } from "../LoginComponents/LoginPopover"
import styles from './NavBar.module.scss'



export const SteezyNavBar = () => {

    //TODO Add toggle between sticky and fixed top navbar


    const { signedIn } = useAuth();
    //have state to show offcanvas.  Have media query check to only open when below md breakpoint
    // https://www.w3schools.com/howto/howto_js_off-canvas.asp
    return (
        <div className={styles.container}>
            <Navbar collapseOnSelect className={styles.navBox + ' sticky-top'} expand="md" bg="dark" variant="dark">
                <Container className={styles.innerContainer}>
                    <Navbar.Brand href="/">
                        <img
                            alt=""
                            src="/blueBird.bmp"
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{'\t'}Steezy</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" >
                        {/* Put animated hamburger here */}
                    </Navbar.Toggle>
                    <Navbar.Collapse id="navbarScroll">
                        <Nav variant='pills' className={"me-auto " + styles.textLinksDiv}>

                            <Nav.Link href="/scoreboard">Scoreboard</Nav.Link>
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
                </Container>
            </Navbar>
        </div>
    )
}