import React from "react";
import { color, motion } from "framer-motion";
import { useState } from "react";
import { windowlistner } from "../WindowListener/WindowListener"
import "../Register/Register.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from "react-router-dom";

import axios from 'axios'

function Register() {

    const [position, setposition] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();

    const [name, setname] = useState('')
    const [username, setUsername] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [confirm, setconfirm] = useState('')

    const [errors, setErrors] = useState('');

    const submits = async (event) => {
        event.preventDefault();
        setname('')
        setemail('')
        setpassword('')
        setconfirm('')
        setUsername('')

        try {
            const response = await axios.post('https://voxify-k2iw.onrender.com/user/Register', { name, username, email, password, confirm })
            console.log(response.data)
            if (response.data.success === 'true') {
                navigate('/user/Login')
                console.log("navigate karna h")
            }
            if (response.data.sucess === false) {
                navigate('/user/Register')
                setErrors(response.data.error[0].msg)
            }
            console.log(name, email, password, confirm, username)
        } catch (error) {
            console.log(error)
        }
    }

    windowlistner('pointermove', (e) => {
        setposition({ x: e.clientX, y: e.clientY })
    })

    const login = () => {
        navigate('/user/Login')
    }

    function timingout() {
        setTimeout(() => {
            setErrors('')
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

                    <h1 style={styles.artist}>Move. Groove. Listen to Your Text!</h1>
                    <p style={styles.stories}><span style={{ fontWeight: 'bold', color: 'rgb(222, 218, 219)', fontFamily: "sans-serif" }}>GIVE YOUR WORDS A VOICE.</span>™ New to our platform? Sign up now and enjoy a free voice pack plus your first custom reading — on us! Turn your text into powerful speech and start your listening adventure today!</p>
                </motion.div>
                <motion.div style={styles.centerss}>
                    <motion.div >
                        <p style={styles.heading}>SIGN UP</p>
                        <p style={{
                            ...styles.subheading,
                            marginBottom: errors ? "70px" : "30px",
                        }}>Join today and let your words speak!</p>
                        <motion.div>
                            {errors && (
                                <p className="error" style={{
                                    ...styles.error,
                                    marginTop: errors ? "40px" : "20px",

                                }} {...timingout()} > {errors} </p>
                            )}
                        </motion.div>
                    </motion.div>
                    <motion.div>
                        <motion.div style={styles.emailContainer}>
                            <label htmlFor="name" style={styles.labelsss}>Name :</label>
                            <input style={styles.input} type="name" id="name" name="name" value={name} onChange={(event) => { setname(event.target.value) }} required></input>
                        </motion.div>
                        <motion.div style={styles.emailContainer}>
                            <label htmlFor="name" style={styles.labelsss}>Username :</label>
                            <input style={styles.input} type="username" id="username" name="username" value={username} onChange={(event) => { setUsername(event.target.value) }} required></input>
                        </motion.div>
                        <motion.div style={styles.emailContainer}>
                            <label htmlFor="email" style={styles.labelsss}>Email :</label>
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
                            type="submit" onClick={submits}>SIGN UP</motion.button>
                        <motion.div className="Account" style={styles.accountText} >
                            Already have account?{" "}
                            <motion.a title="No account" style={styles.links} onClick={login}>
                                Login!
                            </motion.a>
                        </motion.div>
                    </motion.div>
                </motion.div>
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

    },
    inputGroup: {
        marginBottom: '20px',
    },
    labelsss: {
        display: 'block',
        marginRight: '520px',
        fontSize: '20px',
        marginBottom: "10px",

    },
    labelss: {
        display: 'block',
        marginRight: '480px',
        fontSize: '20px',
        marginBottom: "10px"
    },
    labels: {
        display: 'block',
        marginRight: '400px',
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
    inputss: {
        border: 'none',
        width: '50%',
        padding: '15px',
        backgroundColor: 'rgb(31, 22, 35)',
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
        top: '350px',
        left: '43%',
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
        fontSize: "18px",
        fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
        color: "#e0dfdd"
    },
    centerss: {
        // display:'flex',
        textAlign: 'center'
    },
}
export default Register