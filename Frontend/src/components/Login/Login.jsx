import React from "react";
import { color, motion } from "framer-motion";
import { useState } from "react";
import { windowlistner } from "../WindowListener/WindowListener"
import "../Register/Register.css"
import axios from 'axios'
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [position, setposition] = useState({ x: 0, y: 0 });

    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [confirm, setconfirm] = useState('')

    const [errors, seterror] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        console.log(email, password);
        setemail('');
        setpassword('');
        setconfirm('');

        try {
            const res = await axios.post('https://voxify-k2iw.onrender.com/user/Login', { email, password });
            console.log(res.data.success)

            if (res.data.success === true) {
                navigate('/Dashboard');
            }

            if (res.data.success === false) {
                seterror(res.data.error[0].msg)
            }

        } catch (error) {
            console.log("Request failed:", error);
            seterror("Server error, please try again later.");
        }
    };


    windowlistner('pointermove', (e) => {
        setposition({ x: e.clientX, y: e.clientY })
    })

    const account = () => {
        navigate('/user/Register')
    }


    function timingout() {
        setTimeout(() => {
            seterror('')
        }, 5000);
    }
    return (
        <motion.div style={styles.login}>
            <div className="cursor" style={{
                ...styles.cursor,
                transform: `translate(${position.x}px, ${position.y}px)`
            }}></div>

            <motion.div style={styles.innerLogin}>
                <motion.div>

                    <h1 style={styles.artist}>LET'S MAKE YOUR TEXTS SPEAK AGAIN!</h1>
                    <p style={styles.stories}>STEP INTO A WORLD WHERE YOUR WORDS SPEAK FOR YOU. EVERY LISTEN UNLOCKS NEW POTENTIAL. THIS IS MORE THAN TECHNOLOGY — IT’S YOUR POWER IN ACTION.</p>
                </motion.div>
                <motion.div style={styles.centerss}>
                    <motion.div >
                        <p style={styles.heading}>LOGIN</p>
                        <p style={styles.subheading}>Continue your journey and pick up right where you left off.</p>
                    </motion.div>
                    <motion.div>
                        <motion.div style={styles.emailContainer}>
                            <label htmlFor="email" style={styles.label}>Email :</label>
                            <input style={styles.input} type="email" id="email" name="email" value={email} placeholder="example@gmail.com" onChange={(event) => { setemail(event.target.value) }} required></input>
                        </motion.div>
                        <motion.div style={styles.emailContainer}>
                            <label htmlFor="password" style={styles.labelss}>Password :</label>
                            <input style={styles.input} type="password" id="password" name="password" value={password} onChange={(event) => { setpassword(event.target.value) }}></input>
                        </motion.div>
                        <motion.div style={styles.emailContainer}>
                            <label htmlFor="confirm_password" style={styles.labels}>Confirm_Password :</label>
                            <input style={styles.input} type="password" id="confirm_password" value={confirm} name="confirm_password" onChange={(event) => setconfirm(event.target.value)}></input>
                        </motion.div>
                        <motion.button style={styles.button}
                            initial={{
                                scale: 1,
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                color: 'white',
                            }}
                            whileHover={{
                                scale: 1.04,
                                color: 'white',
                                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                            }}
                            whileTap={{
                                scale: 1.01,
                            }}
                            type="submit" onClick={submit}>LOGIN</motion.button>
                        <motion.div className="Account" style={styles.accountText} >
                            No account yet?{" "}
                            <motion.a title="No account" style={styles.links} onClick={account}>
                                Create your account now
                            </motion.a>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
            <motion.div>
                {errors && (
                    <p className="error" style={{
                        ...styles.error,
                        marginTop: errors ? "40px" : "40px",

                    }} {...timingout()} > {errors} </p>
                )}
            </motion.div>
        </motion.div>
    )
}

const styles = {
    login: {
        backgroundColor: 'rgb(19, 19, 19)',
        color: 'rgb(221, 219, 219)',
        minHeight: '100vh',
        fontFamily: "'Poppins', sans-serif",
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'

    },
    innerLogin: {
        height: '100%',
        width: '70%',
        padding: '30px',
    },
    heading: {
        color: 'white',
        fontSize: '42px',
        fontWeight: '900',
        marginBottom: '15px',
        marginTop: "10%",
        background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    subheading: {
        fontSize: '18px',
        marginBottom: '5%',
        color: '#e0dfdd'

    },
    inputGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginRight: '530px',
        fontSize: '20px',
        marginBottom: "10px",

    },
    labelss: {
        display: 'block',
        marginRight: '490px',
        fontSize: '20px',
        marginBottom: "10px"
    },
    labels: {
        display: 'block',
        marginRight: '410px',
        fontSize: '20px',
        marginBottom: "10px"
    },
    input: {
        border: 'none',
        width: '50%',
        padding: '15px',
        backgroundColor: 'rgb(19, 19, 19)',
        color: 'white',
        marginBottom: '30px',
        borderBottom: "2px solid rgb(173, 167, 167)",
    },
    link: {
        color: 'rgb(173, 167, 167)',
        textDecoration: 'none',
        marginLeft: '270px',
    },
    accountText: {
        marginTop: '20px',
        fontSize: '16px',
    },
    button: {
        border: 'none',
        borderRadius: '30px',
        padding: '15px',
        width: '60%',
        marginTop: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        fontSize: "18px",
        color: 'white',
        fontWeight: "900",
        cursor: 'pointer',
        transition: 'transform 0.3s ease'
    },
    links: {
        borderBottom: '2px solid rgb(173, 167, 167)',

    },
    cursor: {
        transition: "all 0.2s ease",
        height: '60px',
        width: '60px',
        borderRadius: '50%',
        position: 'fixed',
        border: "2px solid rgba(255, 255, 255, 0.8)",
        pointerEvents: "none",
        left: -30,
        top: -30,
        zIndex: 9999,
        mixBlendMode: 'difference'
    },
    error: {
        position: 'absolute',
        top: '410px',
        left: '39%',
        backgroundColor: 'rgba(255, 0, 0, 0.8)',
        color: 'white',
        padding: '13px 35px',
        borderRadius: '7px',
        fontSize: '16px',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    artist: {
        fontSize: '45px',
        fontWeight: "900",
        fontFamily: "'Michroma', sans-serif",
        background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        marginBottom: '20px'
    },
    stories: {
        fontSize: "16px",
        fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
        color: "#e0dfdd"
    },
    centerss: {
        // display:'flex',
        textAlign: 'center'
    },
}
export default Login