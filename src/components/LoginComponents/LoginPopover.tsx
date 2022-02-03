import Auth from "@aws-amplify/auth"
import { HubPayload, Logger } from "@aws-amplify/core"
import { DataStore, Hub } from "aws-amplify"
import Link from "next/link"
import React, { ReactText, useEffect, useRef, useState } from "react"
import { Alert, Button, Overlay, Popover, Spinner } from "react-bootstrap"
import { toast } from "react-toastify"
import { useSyncStatus } from "../../hooks/useSyncStatus"
import { InputGroup } from "../InputGroup/inputGroup"
import styles from './loginPopover.module.scss'



export const SignInOutButton = () => {
    //check if currentauth user is null, if is show sign in else sign out.  

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [formState, setFormState] = useState<{ email: string, password: string }>({ email: "", password: "" })
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error>()

    const target = useRef(null);
    const toastId = React.useRef<string | number | undefined>();
    const { syncReady } = useSyncStatus();
    const notify = () => toastId.current = toast.loading("Performing Sync...",
        {
            position: "bottom-center",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        }
    );
    const successPopover = () => toast.success("Logged in",
        {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'dark',
        })



    const dismiss = () => toast.dismiss(toastId.current);


    useEffect(() => {
        Auth.currentAuthenticatedUser()
            .then((user) => user ? setIsLoggedIn(true) : setIsLoggedIn(false))
    }, [])


    useEffect(() => {
        if (syncReady || isLoggedIn) {
            setTimeout(dismiss, 1000)
        }
    }, [syncReady, isLoggedIn])


    const onSubmit = () => {
        setLoading(true)
        Auth.signIn(formState.email, formState.password)
            .then((user) => {
                // console.log("Logged in "+ user.attributes.preferred_username)

                setLoading(false);
                setShow(false);
                setError(undefined);
                setIsLoggedIn(true);
                successPopover();
                if (!syncReady) {
                    notify()
                }

                return DataStore.start();



                //TODO: add success  message / toast?
            })
            .catch(e => {
                setError(e)
                setLoading(false);
            });
    }
    const handleClick = () => {
        if (!isLoggedIn) {
            setShow(!show);
        } else if (isLoggedIn) {
            Auth.signOut().then((e) => {
                console.log("signed out")
                // DataStore.clear();
                // DataStore.start();
                setIsLoggedIn(false)
            });

        }
    };

    return (
        <>
            <div ref={target}>
                <Button onClick={handleClick} ref={target}>{isLoggedIn ? "Sign Out" : "Sign In"}</Button>
                <Overlay placement="bottom"
                    show={show}
                    target={target.current}
                    rootClose
                    onHide={() => { setShow(false); setError(undefined) }}
                >
                    <Popover className={styles.loginPopover}>
                        <Popover.Header as='h3' className={styles.loginHeader}>Login</Popover.Header>
                        <Popover.Body className={styles.loginBody}>
                            <InputGroup label='Email' name='email' type={"email"} setFormState={setFormState} value={formState.email} />
                            <InputGroup label='Password' name='password' type="password" setFormState={setFormState} value={formState.password} />
                            <div className={styles.loginButtonDiv}>
                                <Link passHref href='/forgot-password' >
                                    <div className={styles.forgotPasswordDiv}>
                                        Forgot Password?
                                    </div>
                                    {/*TODO: Link to forgot password component */}
                                </Link>
                                {loading ? <Spinner animation='border' variant="light" /> : <Button variant='light' onClick={onSubmit}>Login</Button>}
                            </div>
                            {error && <Alert className={styles.errorAlert} variant='danger'>
                                {error.message}
                            </Alert>
                            }                       {isLoggedIn && <Alert className={styles.errorAlert} variant='success'>Success!</Alert>}

                        </Popover.Body>
                    </Popover>


                </Overlay>
            </div>
        </>
    )
}


