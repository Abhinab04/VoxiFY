import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons';
import '../../Header/header.css'
import { motion } from "framer-motion";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

function DashHeader() {
    const [dropdown, setdropdown] = useState(false)

    const down = () => {
        setdropdown(!dropdown)
    }

    const navigate = useNavigate();


    const logout = async () => {
        try {
            const response = await axios.get('http://localhost:3001/user/Logout')
            console.log(response.data.success);
            if (response.data.success === 'true') {
                navigate('/user/Login')
            }
        } catch (error) {
            console.log(error);
        }
    }

    const feedback = () => {
        navigate('/contact')
    }

    return (
        <header style={styles.header}>
            <nav style={styles.nav}>
                <div style={styles.saperate}>
                    <div style={styles.name}>
                        <h1>VoxiFY</h1>
                    </div>
                    <div style={styles.naxs}>
                        <div style={styles.dropdownContainer}>
                            <div style={styles.gear}>
                                <button onClick={down} className="line" style={styles.dropdownButton}>Settings</button>
                            </div>
                            {
                                dropdown &&
                                (<div style={styles.dropdownMenu}>
                                    <a style={styles.dropdownitems} className="helps">VoxiFY Help</a>
                                    <a style={styles.dropdownitems} className="helps" onClick={feedback}>Send feedback</a>
                                    <a style={styles.dropdownitems} className="helps">Discord</a>
                                    <a onClick={logout} style={styles.dropdownitems} className="helps">Logout</a>
                                </div>
                                )}
                        </div>
                        <a className="line" href="#contact" style={styles.navLink} onClick={feedback}>Contact</a> {/*iska href ko baad mai chnage karenge*/}
                    </div>
                </div>
            </nav>
        </header>
    );
};

const styles = {
    saperate: {
        display: 'flex',
        justifyContent: 'space-between'

    },
    name: {
        fontFamily: "Arial, sans-serif",
        marginLeft: '80px',
        fontSize: '25px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)', // Gradient background
        WebkitBackgroundClip: 'text', // Background clip for text
        WebkitTextFillColor: 'transparent',
        fontWeight: '900',
    },
    ify: {
        color: '#c49a00'
    },
    header: {
        textAlign: 'center',
        backgroundColor: 'rgb(19, 19, 19)',
        color: 'white',
        padding: '10px',
        position: 'sticky',
        top: 0,
        zIndex: 999,
    },
    nav: {
        marginTop: '12px',
    },
    naxs: {
        marginRight: '60px',
        display: 'flex',
        gap: '20px',
        alignItems: 'center'
    },
    navLink: {
        fontFamily: "Arial, sans-serif",
        color: 'white',
        textDecoration: 'none',
        margin: '0 15px',
        marginTop: '4px',
        fontSize: '20px',
        cursor: 'pointer',
    },
    dropdownContainer: {
        position: 'relative'
    },
    dropdownButton: {
        border: 'none',
        color: 'white',
        fontSize: '20px',
        cursor: 'pointer',
        marginRight: '18px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownMenu: {
        position: 'absolute',
        top: '40px',
        right: '0',
        backgroundColor: '#19191a',
        color: 'black',
        borderRadius: '14px',
        padding: '12px',
        zIndex: 1000,
        border: '2px solid white',
        display: 'inline-block',
        marginLeft: '30px',
        textDecoration: 'none'
    },
    gear: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        padding: '1px 15px'
    },
    icon: {
        fontSize: '20px',
        marginTop: '8px'
    }
};


export default DashHeader